import http from "node:http";
import { createReadStream, createWriteStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { brotliCompressSync, gzipSync, constants as zlibConstants } from "node:zlib";

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3000);
const SITE_CAPTURE_WEBP = "/tmp/portfolio-denisovphoto-desktop.webp";
const SITE_CAPTURE_PNG = path.join(root, "assets", "site-case", "denisovphoto-desktop.png");
const PHOTO_SOURCE_DIR = path.join(root, "assets", "photos");

const AI_ID = "5-9tzVe57JY";
const ADOBE_EMBED = `https://www-ccv.adobe.io/v1/player/ccv/${AI_ID}/embed?api_key=behance1&bgcolor=%23191919`;

const CARTOON_PUBLIC_URL = "https://disk.yandex.ru/i/Q6JaTkvI-IB1tw";
const CARTOON_META_API = `https://cloud-api.yandex.net/v1/disk/public/resources?public_key=${encodeURIComponent(CARTOON_PUBLIC_URL)}`;
const CARTOON_DOWNLOAD_API = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${encodeURIComponent(CARTOON_PUBLIC_URL)}`;
const CARTOON_FILE = "/tmp/portfolio-cartoon.mp4";

const EVENT_MEDIA = {
  promo1: {
    publicUrl: "https://disk.yandex.ru/i/iIj6z28I2z0d3w",
    videoPath: "/media/promo-1-video",
    posterPath: "/media/promo-1-poster"
  },
  promo2: {
    publicUrl: "https://disk.yandex.ru/i/CGJbZxDuh1ORXw",
    videoPath: "/media/promo-2-video",
    posterPath: "/media/promo-2-poster"
  }
};

const EVENT_COVER_FALLBACKS = {
  "/promo-1-cover.jpg": EVENT_MEDIA.promo1.publicUrl,
  "/promo-2-cover.jpg": EVENT_MEDIA.promo2.publicUrl
};

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4"
};

let aiMediaCache = null;
let aiMediaCacheExpiresAt = 0;
let aiVideoBuffer = null;
let aiVideoWarmPromise = null;

let cartoonMetaCache = null;
let cartoonMetaExpiresAt = 0;
let cartoonDownloadUrl = null;
let cartoonDownloadExpiresAt = 0;
let cartoonWarmPromise = null;
let cartoonReady = false;
let cartoonSize = 0;

const yandexMetaCache = new Map();
const yandexDownloadCache = new Map();

function decodeEmbeddedUrl(value) {
  if (!value) return null;
  let decoded = value;
  try {
    decoded = JSON.parse(`"${value}"`);
  } catch {
    // Attribute URLs are already plain strings.
  }
  return decoded
    .replaceAll("&amp;", "&")
    .replaceAll("&#38;", "&")
    .replaceAll("\\u0026", "&");
}

async function resolveAIMedia() {
  if (aiMediaCache && Date.now() < aiMediaCacheExpiresAt) return aiMediaCache;

  const response = await fetch(ADOBE_EMBED, {
    redirect: "follow",
    headers: {
      accept: "text/html,application/xhtml+xml",
      "user-agent": "Mozilla/5.0 PortfolioMediaResolver/1.0"
    }
  });

  if (!response.ok) throw new Error(`Adobe player returned ${response.status}`);
  const html = await response.text();

  const mp4Raw =
    html.match(/"mp4URL"\s*:\s*"([^"]+)"/i)?.[1] ||
    html.match(/<source[^>]+src=["']([^"']+\.mp4[^"']*)["']/i)?.[1];

  const hlsRaw =
    html.match(/"m3u8URL"\s*:\s*"([^"]+)"/i)?.[1] ||
    html.match(/<source[^>]+src=["']([^"']+\.m3u8[^"']*)["']/i)?.[1];

  let mp4 = decodeEmbeddedUrl(mp4Raw);
  const hls = decodeEmbeddedUrl(hlsRaw);

  if (!mp4 && hls) {
    mp4 = hls.replace("/rend/master.m3u8", `/rend/${AI_ID}_576.mp4`);
  }

  if (!mp4) throw new Error("Direct MP4 URL was not found in Adobe player markup");

  const posterRaw =
    html.match(/data-poster=["']([^"']+)["']/i)?.[1] ||
    html.match(/"posterURL"\s*:\s*"([^"]+)"/i)?.[1];

  let poster = decodeEmbeddedUrl(posterRaw);
  if (!poster && hls) {
    const hlsUrl = new URL(hls);
    poster = `${hlsUrl.origin}/${AI_ID}/image/${AI_ID}_poster.jpg${hlsUrl.search}`;
  }

  aiMediaCache = { mp4, poster };
  aiMediaCacheExpiresAt = Date.now() + 10 * 60 * 1000;
  return aiMediaCache;
}

async function warmAIVideo() {
  if (aiVideoBuffer) return aiVideoBuffer;
  if (aiVideoWarmPromise) return aiVideoWarmPromise;

  aiVideoWarmPromise = (async () => {
    const media = await resolveAIMedia();
    const response = await fetch(media.mp4, {
      redirect: "follow",
      headers: { "user-agent": "Mozilla/5.0 PortfolioMediaCache/1.0" }
    });

    if (!response.ok) throw new Error(`Direct MP4 returned ${response.status}`);
    const arrayBuffer = await response.arrayBuffer();
    aiVideoBuffer = Buffer.from(arrayBuffer);
    console.log(`AI ad cached in memory: ${(aiVideoBuffer.length / 1024 / 1024).toFixed(2)} MB`);
    return aiVideoBuffer;
  })();

  try {
    return await aiVideoWarmPromise;
  } finally {
    aiVideoWarmPromise = null;
  }
}

async function resolveYandexMeta(publicUrl) {
  const cached = yandexMetaCache.get(publicUrl);
  if (cached && Date.now() < cached.expiresAt) return cached.data;

  const api = `https://cloud-api.yandex.net/v1/disk/public/resources?public_key=${encodeURIComponent(publicUrl)}`;
  const response = await fetch(api, {
    redirect: "follow",
    headers: {
      accept: "application/json",
      "user-agent": "Mozilla/5.0 PortfolioYandexResolver/1.0"
    }
  });

  if (!response.ok) throw new Error(`Yandex metadata returned ${response.status}`);
  const data = await response.json();
  const normalized = {
    preview: data.preview || null,
    mime: data.mime_type || "video/mp4",
    size: Number(data.size || 0)
  };
  yandexMetaCache.set(publicUrl, { data: normalized, expiresAt: Date.now() + 30 * 60 * 1000 });
  return normalized;
}

async function resolveYandexDownload(publicUrl) {
  const cached = yandexDownloadCache.get(publicUrl);
  if (cached && Date.now() < cached.expiresAt) return cached.href;

  const api = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${encodeURIComponent(publicUrl)}`;
  const response = await fetch(api, {
    redirect: "follow",
    headers: {
      accept: "application/json",
      "user-agent": "Mozilla/5.0 PortfolioYandexResolver/1.0"
    }
  });

  if (!response.ok) throw new Error(`Yandex download API returned ${response.status}`);
  const data = await response.json();
  if (!data.href) throw new Error("Yandex download API returned no href");

  yandexDownloadCache.set(publicUrl, { href: data.href, expiresAt: Date.now() + 25 * 60 * 1000 });
  return data.href;
}

async function resolveCartoonMeta() {
  if (cartoonMetaCache && Date.now() < cartoonMetaExpiresAt) return cartoonMetaCache;

  const response = await fetch(CARTOON_META_API, {
    redirect: "follow",
    headers: {
      accept: "application/json",
      "user-agent": "Mozilla/5.0 PortfolioCartoonResolver/1.0"
    }
  });

  if (!response.ok) throw new Error(`Yandex metadata returned ${response.status}`);
  const data = await response.json();
  cartoonMetaCache = {
    preview: data.preview || null,
    mime: data.mime_type || "video/mp4",
    size: Number(data.size || 0)
  };
  cartoonMetaExpiresAt = Date.now() + 30 * 60 * 1000;
  return cartoonMetaCache;
}

async function resolveCartoonDownload() {
  if (cartoonDownloadUrl && Date.now() < cartoonDownloadExpiresAt) return cartoonDownloadUrl;

  const response = await fetch(CARTOON_DOWNLOAD_API, {
    redirect: "follow",
    headers: {
      accept: "application/json",
      "user-agent": "Mozilla/5.0 PortfolioCartoonResolver/1.0"
    }
  });

  if (!response.ok) throw new Error(`Yandex download API returned ${response.status}`);
  const data = await response.json();
  if (!data.href) throw new Error("Yandex download API returned no href");

  cartoonDownloadUrl = data.href;
  cartoonDownloadExpiresAt = Date.now() + 25 * 60 * 1000;
  return cartoonDownloadUrl;
}

async function warmCartoonVideo() {
  if (cartoonReady) return { file: CARTOON_FILE, size: cartoonSize };
  if (cartoonWarmPromise) return cartoonWarmPromise;

  cartoonWarmPromise = (async () => {
    const href = await resolveCartoonDownload();
    const response = await fetch(href, {
      redirect: "follow",
      headers: { "user-agent": "Mozilla/5.0 PortfolioCartoonCache/1.0" }
    });

    if (!response.ok || !response.body) throw new Error(`Yandex cartoon file returned ${response.status}`);

    await pipeline(Readable.fromWeb(response.body), createWriteStream(CARTOON_FILE));
    const info = await stat(CARTOON_FILE);
    cartoonSize = info.size;
    cartoonReady = cartoonSize > 0;
    if (!cartoonReady) throw new Error("Downloaded cartoon file is empty");

    console.log(`Cartoon cached on Railway disk: ${(cartoonSize / 1024 / 1024).toFixed(2)} MB`);
    return { file: CARTOON_FILE, size: cartoonSize };
  })();

  try {
    return await cartoonWarmPromise;
  } finally {
    cartoonWarmPromise = null;
  }
}

async function serveOptimizedPhoto(req, res, id) {
  const normalized = String(id || "").padStart(2, "0");
  if (!/^\d{2}$/.test(normalized)) {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const webp = `/tmp/portfolio-reportage-${normalized}.webp`;
  const jpg = path.join(PHOTO_SOURCE_DIR, `reportage-${normalized}.jpg`);

  let file = webp;
  let contentType = "image/webp";
  let cacheControl = "public, max-age=31536000, immutable";

  try {
    await stat(webp);
  } catch {
    file = jpg;
    contentType = "image/jpeg";
    cacheControl = "no-store, max-age=0";
  }

  const info = await stat(file);
  res.writeHead(200, {
    "content-type": contentType,
    "content-length": info.size,
    "cache-control": cacheControl
  });

  if (req.method === "HEAD") return res.end();
  createReadStream(file).pipe(res);
}

async function serveSiteCapture(req, res) {
  let file = SITE_CAPTURE_WEBP;
  let contentType = "image/webp";
  let cacheControl = "public, max-age=31536000, immutable";

  try {
    await stat(file);
  } catch {
    file = SITE_CAPTURE_PNG;
    contentType = "image/png";
    cacheControl = "no-store, max-age=0";
  }

  const info = await stat(file);
  res.writeHead(200, {
    "content-type": contentType,
    "content-length": info.size,
    "cache-control": cacheControl
  });

  if (req.method === "HEAD") return res.end();
  createReadStream(file).pipe(res);
}

async function streamRemoteVideo(req, res, href, contentType = "video/mp4") {
  const headers = {
    accept: "*/*",
    "user-agent": "Mozilla/5.0 PortfolioMediaStream/1.0"
  };
  if (req.headers.range) headers.range = req.headers.range;

  const response = await fetch(href, {
    redirect: "follow",
    headers
  });

  if (!response.ok && response.status !== 206) {
    throw new Error(`Remote video returned ${response.status}`);
  }

  const outgoing = {
    "content-type": contentType,
    "accept-ranges": response.headers.get("accept-ranges") || "bytes",
    "cache-control": "public, max-age=300"
  };

  const contentLength = response.headers.get("content-length");
  const contentRange = response.headers.get("content-range");
  if (contentLength) outgoing["content-length"] = contentLength;
  if (contentRange) outgoing["content-range"] = contentRange;

  res.writeHead(response.status === 206 ? 206 : 200, outgoing);
  if (req.method === "HEAD" || !response.body) return res.end();

  await pipeline(Readable.fromWeb(response.body), res);
}

function parseRange(range, total) {
  if (!range) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!match) return { invalid: true };

  let start;
  let end;

  if (!match[1] && match[2]) {
    const suffix = Number(match[2]);
    if (!Number.isFinite(suffix) || suffix <= 0) return { invalid: true };
    start = Math.max(total - suffix, 0);
    end = total - 1;
  } else {
    start = match[1] ? Number(match[1]) : 0;
    end = match[2] ? Math.min(Number(match[2]), total - 1) : total - 1;
  }

  if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || start > end || start >= total) {
    return { invalid: true };
  }

  return { start, end };
}

function serveBufferedVideo(req, res, buffer) {
  const total = buffer.length;
  const range = parseRange(req.headers.range, total);
  const common = {
    "content-type": "video/mp4",
    "accept-ranges": "bytes",
    "cache-control": "public, max-age=86400, immutable"
  };

  if (!range) {
    res.writeHead(200, { ...common, "content-length": total });
    if (req.method === "HEAD") return res.end();
    return res.end(buffer);
  }

  if (range.invalid) {
    res.writeHead(416, { "content-range": `bytes */${total}` });
    return res.end();
  }

  const chunk = buffer.subarray(range.start, range.end + 1);
  res.writeHead(206, {
    ...common,
    "content-range": `bytes ${range.start}-${range.end}/${total}`,
    "content-length": chunk.length
  });
  if (req.method === "HEAD") return res.end();
  return res.end(chunk);
}

function serveVideoFile(req, res, file, total) {
  const range = parseRange(req.headers.range, total);
  const common = {
    "content-type": "video/mp4",
    "accept-ranges": "bytes",
    "cache-control": "public, max-age=86400, immutable"
  };

  if (!range) {
    res.writeHead(200, { ...common, "content-length": total });
    if (req.method === "HEAD") return res.end();
    return createReadStream(file).pipe(res);
  }

  if (range.invalid) {
    res.writeHead(416, { "content-range": `bytes */${total}` });
    return res.end();
  }

  res.writeHead(206, {
    ...common,
    "content-range": `bytes ${range.start}-${range.end}/${total}`,
    "content-length": range.end - range.start + 1
  });
  if (req.method === "HEAD") return res.end();
  return createReadStream(file, { start: range.start, end: range.end }).pipe(res);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    const coverFallbackUrl = EVENT_COVER_FALLBACKS[url.pathname];
    if (coverFallbackUrl) {
      const localCover = path.join(root, url.pathname.slice(1));
      try {
        await stat(localCover);
      } catch {
        try {
          const meta = await resolveYandexMeta(coverFallbackUrl);
          if (!meta.preview) throw new Error("Event preview unavailable");
          res.writeHead(302, { location: meta.preview, "cache-control": "no-store" });
          res.end();
          return;
        } catch (error) {
          console.error("Event cover fallback error:", error);
          res.writeHead(404, { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" });
          res.end("Poster unavailable");
          return;
        }
      }
    }

    const photoMatch = url.pathname.match(/^\/media\/photos\/reportage-(\d{2})$/);
    if (photoMatch) {
      await serveOptimizedPhoto(req, res, photoMatch[1]);
      return;
    }

    if (url.pathname === "/media/site-capture") {
      await serveSiteCapture(req, res);
      return;
    }

    if (url.pathname === "/media/ai-video") {
      try {
        const media = await resolveAIMedia();
        await streamRemoteVideo(req, res, media.mp4, "video/mp4");
      } catch (error) {
        console.error("AI ad stream error:", error);
        try {
          const media = await resolveAIMedia();
          res.writeHead(302, { location: media.mp4, "cache-control": "no-store" });
          res.end();
        } catch {
          res.writeHead(502, { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" });
          res.end("AI video unavailable");
        }
      }
      return;
    }

    if (url.pathname === "/media/ai-poster") {
      try {
        const media = await resolveAIMedia();
        if (!media.poster) throw new Error("Poster unavailable");
        res.writeHead(302, { location: media.poster, "cache-control": "public, max-age=3600" });
        res.end();
      } catch (error) {
        console.error("AI ad poster resolver error:", error);
        res.writeHead(404, { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" });
        res.end("Poster unavailable");
      }
      return;
    }

    if (url.pathname === "/media/cartoon-video") {
      try {
        const href = await resolveCartoonDownload();
        await streamRemoteVideo(req, res, href, "video/mp4");
      } catch (error) {
        console.error("Cartoon stream error:", error);
        res.writeHead(502, { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" });
        res.end("Cartoon unavailable");
      }
      return;
    }

    if (url.pathname === "/media/cartoon-poster") {
      try {
        const meta = await resolveCartoonMeta();
        if (!meta.preview) throw new Error("Cartoon preview unavailable");
        res.writeHead(302, { location: meta.preview, "cache-control": "public, max-age=3600" });
        res.end();
      } catch (error) {
        console.error("Cartoon poster resolver error:", error);
        res.writeHead(404, { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" });
        res.end("Poster unavailable");
      }
      return;
    }

    const eventMedia = Object.values(EVENT_MEDIA).find(
      (item) => url.pathname === item.videoPath || url.pathname === item.posterPath
    );

    if (eventMedia) {
      if (url.pathname === eventMedia.videoPath) {
        try {
          const href = await resolveYandexDownload(eventMedia.publicUrl);
          res.writeHead(302, { location: href, "cache-control": "no-store" });
          res.end();
        } catch (error) {
          console.error("Event video resolver error:", error);
          res.writeHead(502, { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" });
          res.end("Event video unavailable");
        }
        return;
      }

      try {
        const meta = await resolveYandexMeta(eventMedia.publicUrl);
        if (!meta.preview) throw new Error("Event preview unavailable");
        res.writeHead(302, { location: meta.preview, "cache-control": "public, max-age=3600" });
        res.end();
      } catch (error) {
        console.error("Event poster resolver error:", error);
        res.writeHead(404, { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" });
        res.end("Poster unavailable");
      }
      return;
    }

    const requested = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
    const safe = path.normalize(requested).replace(/^(\.\.(\/|\\|$))+/, "");
    let file = path.join(root, safe);
    if (!file.startsWith(root)) throw new Error("bad path");
    try {
      const info = await stat(file);
      if (info.isDirectory()) file = path.join(file, "index.html");
    } catch {
      file = path.join(root, "index.html");
    }
    const body = await readFile(file);
    const ext = path.extname(file).toLowerCase();
    const versioned = url.searchParams.has("v");
    const textAsset = ext === ".html" || ext === ".css" || ext === ".js" || ext === ".svg";
    const cacheControl = ext === ".html"
      ? "no-store, max-age=0"
      : versioned
        ? "public, max-age=31536000, immutable"
        : "public, max-age=604800, stale-while-revalidate=86400";

    let output = body;
    const headers = {
      "content-type": types[ext] || "application/octet-stream",
      "cache-control": cacheControl
    };

    if (textAsset && body.length > 1024) {
      const accepted = String(req.headers["accept-encoding"] || "");
      if (accepted.includes("br")) {
        output = brotliCompressSync(body, {
          params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 4 }
        });
        headers["content-encoding"] = "br";
        headers["vary"] = "Accept-Encoding";
      } else if (accepted.includes("gzip")) {
        output = gzipSync(body, { level: 6 });
        headers["content-encoding"] = "gzip";
        headers["vary"] = "Accept-Encoding";
      }
    }

    headers["content-length"] = output.length;
    res.writeHead(200, headers);
    res.end(output);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Portfolio listening on ${port}`);
});
