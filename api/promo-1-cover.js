const SHARE_URL = "https://disk.yandex.ru/i/iIj6z28I2z0d3w";
const RESOURCE_API = "https://cloud-api.yandex.net/v1/disk/public/resources?public_key=" + encodeURIComponent(SHARE_URL);

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    res.statusCode = 405;
    return res.end("Method not allowed");
  }
  try {
    const response = await fetch(RESOURCE_API, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error("Yandex preview resolution failed: " + response.status);
    const { preview } = await response.json();
    if (!preview || !preview.startsWith("https://")) throw new Error("Yandex did not return a valid preview URL");
    res.statusCode = 302;
    res.setHeader("Location", preview);
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Referrer-Policy", "no-referrer");
    return res.end();
  } catch (error) {
    console.error("Promo 1 cover redirect error:", error);
    res.statusCode = 502;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.end("Preview temporarily unavailable");
  }
}
