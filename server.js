import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3000);
const AI_ID = "5-9tzVe57JY";
const ADOBE_EMBED = `https://www-ccv.adobe.io/v1/player/ccv/${AI_ID}/embed?api_key=behance1&bgcolor=%23191919`;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

let aiMediaCache = null;
let aiMediaCacheExpiresAt = 0;

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
      "accept": "text/html,application/xhtml+xml",
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

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === "/media/ai-video" || url.pathname === "/media/ai-poster") {
      try {
        const media = await resolveAIMedia();
        const target = url.pathname === "/media/ai-video" ? media.mp4 : media.poster;
        if (!target) throw new Error("Requested media URL unavailable");
        res.writeHead(302, {
          location: target,
          "cache-control": "no-store, max-age=0"
        });
        res.end();
      } catch (error) {
        console.error("AI media resolver error:", error);
        res.writeHead(502, {
          "content-type": "text/plain; charset=utf-8",
          "cache-control": "no-store"
        });
        res.end("AI media unavailable");
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
    const dynamicAsset = ext === ".html" || ext === ".css" || ext === ".js";
    res.writeHead(200, {
      "content-type": types[ext] || "application/octet-stream",
      "cache-control": dynamicAsset ? "no-store, max-age=0" : "public, max-age=604800"
    });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Portfolio listening on ${port}`);
});
