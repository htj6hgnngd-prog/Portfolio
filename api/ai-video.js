import { Readable } from "node:stream";

const SHARE_URL = "https://disk.yandex.ru/i/8FjQftFoCoMlBQ";
const DOWNLOAD_API = "https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=" + encodeURIComponent(SHARE_URL);

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    res.statusCode = 405;
    return res.end("Method not allowed");
  }

  try {
    const meta = await fetch(DOWNLOAD_API, { headers: { Accept: "application/json" } });
    if (!meta.ok) throw new Error("Yandex share resolution failed: " + meta.status);
    const { href } = await meta.json();
    if (!href) throw new Error("Yandex did not return a media URL");

    const headers = {};
    if (req.headers.range) headers.Range = req.headers.range;
    const upstream = await fetch(href, { method: req.method, headers });
    if (!upstream.ok && upstream.status !== 206) {
      throw new Error("Yandex media request failed: " + upstream.status);
    }

    res.statusCode = upstream.status;
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", 'inline; filename="ai-product-ad.mp4"');
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300, stale-while-revalidate=60");
    for (const name of ["content-length", "content-range", "last-modified", "etag"]) {
      const value = upstream.headers.get(name);
      if (value) res.setHeader(name, value);
    }
    if (req.method === "HEAD" || !upstream.body) return res.end();
    Readable.fromWeb(upstream.body).pipe(res);
  } catch (error) {
    console.error("AI video proxy error:", error);
    if (!res.headersSent) {
      res.statusCode = 502;
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
    }
    res.end("Video temporarily unavailable");
  }
}
