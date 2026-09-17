import http from "node:http";
import { spawn } from "node:child_process";
import { Readable } from "node:stream";

const externalPort = Number(process.env.PORT || 3000);
const internalPort = externalPort === 3001 ? 3002 : 3001;

const EVENT_MEDIA = {
  "/media/promo-1-video": {
    publicUrl: "https://disk.yandex.ru/i/iIj6z28I2z0d3w",
    type: "video"
  },
  "/media/promo-1-poster": {
    publicUrl: "https://disk.yandex.ru/i/iIj6z28I2z0d3w",
    type: "poster"
  },
  "/media/promo-2-video": {
    publicUrl: "https://disk.yandex.ru/i/CGJbZxDuh1ORXw",
    type: "video"
  },
  "/media/promo-2-poster": {
    publicUrl: "https://disk.yandex.ru/i/CGJbZxDuh1ORXw",
    type: "poster"
  }
};

const metaCache = new Map();
const downloadCache = new Map();

async function resolveMeta(publicUrl) {
  const cached = metaCache.get(publicUrl);
  if (cached && Date.now() < cached.expiresAt) return cached.data;

  const api = `https://cloud-api.yandex.net/v1/disk/public/resources?public_key=${encodeURIComponent(publicUrl)}`;
  const response = await fetch(api, {
    redirect: "follow",
    headers: {
      accept: "application/json",
      "user-agent": "Mozilla/5.0 PortfolioPromoProxy/1.0"
    }
  });

  if (!response.ok) throw new Error(`Yandex metadata ${response.status}`);
  const json = await response.json();
  const data = {
    preview: json.preview || null,
    mime: json.mime_type || "video/mp4"
  };
  metaCache.set(publicUrl, { data, expiresAt: Date.now() + 30 * 60 * 1000 });
  return data;
}

async function resolveDownload(publicUrl) {
  const cached = downloadCache.get(publicUrl);
  if (cached && Date.now() < cached.expiresAt) return cached.href;

  const api = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${encodeURIComponent(publicUrl)}`;
  const response = await fetch(api, {
    redirect: "follow",
    headers: {
      accept: "application/json",
      "user-agent": "Mozilla/5.0 PortfolioPromoProxy/1.0"
    }
  });

  if (!response.ok) throw new Error(`Yandex download API ${response.status}`);
  const json = await response.json();
  if (!json.href) throw new Error("Yandex download href missing");
  downloadCache.set(publicUrl, { href: json.href, expiresAt: Date.now() + 20 * 60 * 1000 });
  return json.href;
}

async function servePoster(req, res, publicUrl) {
  const meta = await resolveMeta(publicUrl);
  if (!meta.preview) throw new Error("Yandex preview missing");

  const upstream = await fetch(meta.preview, {
    redirect: "follow",
    headers: {
      accept: "image/avif,image/webp,image/*,*/*;q=0.8",
      "user-agent": req.headers["user-agent"] || "Mozilla/5.0 PortfolioPromoProxy/1.0"
    }
  });

  if (!upstream.ok) throw new Error(`Yandex preview ${upstream.status}`);
  const body = Buffer.from(await upstream.arrayBuffer());
  const contentType = upstream.headers.get("content-type") || "image/jpeg";

  res.writeHead(200, {
    "content-type": contentType,
    "content-length": body.length,
    "cache-control": "public, max-age=3600",
    "access-control-allow-origin": "*"
  });
  if (req.method === "HEAD") return res.end();
  res.end(body);
}

async function serveVideo(req, res, publicUrl) {
  const href = await resolveDownload(publicUrl);
  const headers = {
    "user-agent": req.headers["user-agent"] || "Mozilla/5.0 PortfolioPromoProxy/1.0"
  };
  if (req.headers.range) headers.range = req.headers.range;

  const upstream = await fetch(href, {
    method: "GET",
    redirect: "follow",
    headers
  });

  if (!(upstream.ok || upstream.status === 206)) {
    throw new Error(`Yandex video ${upstream.status}`);
  }

  const responseHeaders = {
    "content-type": upstream.headers.get("content-type") || "video/mp4",
    "accept-ranges": upstream.headers.get("accept-ranges") || "bytes",
    "cache-control": "public, max-age=3600",
    "access-control-allow-origin": "*"
  };
  const contentLength = upstream.headers.get("content-length");
  const contentRange = upstream.headers.get("content-range");
  if (contentLength) responseHeaders["content-length"] = contentLength;
  if (contentRange) responseHeaders["content-range"] = contentRange;

  res.writeHead(upstream.status, responseHeaders);
  if (req.method === "HEAD") {
    upstream.body?.cancel().catch(() => {});
    return res.end();
  }
  if (!upstream.body) return res.end();
  Readable.fromWeb(upstream.body).pipe(res);
}

function proxyToInternal(req, res) {
  const request = http.request(
    {
      hostname: "127.0.0.1",
      port: internalPort,
      method: req.method,
      path: req.url,
      headers: { ...req.headers, host: `127.0.0.1:${internalPort}` }
    },
    (upstream) => {
      res.writeHead(upstream.statusCode || 502, upstream.headers);
      upstream.pipe(res);
    }
  );

  request.on("error", (error) => {
    console.error("Internal proxy error:", error.message);
    if (!res.headersSent) {
      res.writeHead(503, { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" });
    }
    res.end("Portfolio is starting");
  });

  req.pipe(request);
}

async function waitForInternal() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${internalPort}/`, { method: "GET" });
      if (response.ok) {
        await response.arrayBuffer();
        return;
      }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Internal portfolio server did not start");
}

async function verifyPromoSources() {
  for (const [path, item] of Object.entries(EVENT_MEDIA)) {
    if (item.type !== "poster") continue;
    const meta = await resolveMeta(item.publicUrl);
    if (!meta.preview) throw new Error(`${path}: preview missing`);
    const preview = await fetch(meta.preview, { redirect: "follow", headers: { "user-agent": "Mozilla/5.0 PortfolioPromoVerifier/1.0" } });
    if (!preview.ok) throw new Error(`${path}: preview ${preview.status}`);
    const bytes = Buffer.from(await preview.arrayBuffer());
    const type = preview.headers.get("content-type") || "unknown";
    console.log(`${path} verified: ${type}, ${bytes.length} bytes`);
  }
}

const child = spawn(process.execPath, ["server.js"], {
  env: { ...process.env, PORT: String(internalPort) },
  stdio: ["ignore", "inherit", "inherit"]
});

child.on("exit", (code, signal) => {
  console.error(`Internal portfolio server exited: code=${code} signal=${signal}`);
  process.exit(code ?? 1);
});

await waitForInternal();

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    const item = EVENT_MEDIA[url.pathname];
    if (!item) return proxyToInternal(req, res);

    if (item.type === "poster") {
      await servePoster(req, res, item.publicUrl);
    } else {
      await serveVideo(req, res, item.publicUrl);
    }
  } catch (error) {
    console.error("Promo media proxy error:", error);
    if (!res.headersSent) {
      res.writeHead(502, { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" });
    }
    res.end("Promo media unavailable");
  }
});

server.listen(externalPort, "0.0.0.0", () => {
  console.log(`Portfolio media proxy listening on ${externalPort}, internal app on ${internalPort}`);
  verifyPromoSources().catch((error) => console.error("Promo cover verification failed:", error));
});
