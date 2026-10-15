const SHARE_URL = "https://disk.yandex.ru/i/8FjQftFoCoMlBQ";
const DOWNLOAD_API = "https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=" + encodeURIComponent(SHARE_URL);

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    res.statusCode = 405;
    return res.end("Method not allowed");
  }
  try {
    const response = await fetch(DOWNLOAD_API, { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error("Yandex link resolution failed: " + response.status);
    const { href } = await response.json();
    if (!href || !href.startsWith("https://")) throw new Error("Yandex did not return a valid media URL");
    const mediaUrl = new URL(href);
    mediaUrl.searchParams.set("disposition", "inline");
    res.statusCode = 302;
    res.setHeader("Location", mediaUrl.toString());
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Referrer-Policy", "no-referrer");
    return res.end();
  } catch (error) {
    console.error("AI video redirect error:", error);
    res.statusCode = 502;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.end("Video temporarily unavailable");
  }
}
