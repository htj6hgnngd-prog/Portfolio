import { spawn } from "node:child_process";
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const root = path.dirname(fileURLToPath(import.meta.url));

const items = [
  {
    name: "promo-1",
    publicUrl: "https://disk.yandex.ru/i/iIj6z28I2z0d3w",
    video: "/tmp/portfolio-promo-1.mp4",
    cover: path.join(root, "promo-1-cover.jpg")
  },
  {
    name: "promo-2",
    publicUrl: "https://disk.yandex.ru/i/CGJbZxDuh1ORXw",
    video: "/tmp/portfolio-promo-2.mp4",
    cover: path.join(root, "promo-2-cover.jpg")
  }
];

function runFFmpeg(args, label) {
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, args, { stdio: ["ignore", "ignore", "pipe"] });
    let errorText = "";
    child.stderr.on("data", (chunk) => {
      errorText += chunk.toString();
      if (errorText.length > 12000) errorText = errorText.slice(-12000);
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) return resolve();
      reject(new Error(`${label} failed (${code}): ${errorText.slice(-3000)}`));
    });
  });
}

async function resolveDirectFile(publicUrl) {
  const api = `https://cloud-api.yandex.net/v1/disk/public/resources?public_key=${encodeURIComponent(publicUrl)}`;
  const response = await fetch(api, {
    redirect: "follow",
    headers: {
      accept: "application/json",
      "user-agent": "Mozilla/5.0 PortfolioEventMediaBuilder/2.0"
    }
  });
  if (!response.ok) throw new Error(`Yandex metadata ${response.status}`);
  const data = await response.json();
  if (!data.file) throw new Error("Yandex metadata returned no direct file URL");
  console.log(`${data.name || "event video"}: ${data.mime_type || "unknown"}, ${Number(data.size || 0)} bytes`);
  return data.file;
}

for (const item of items) {
  const source = await resolveDirectFile(item.publicUrl);

  await runFFmpeg([
    "-y",
    "-hide_banner",
    "-loglevel", "error",
    "-i", source,
    "-map", "0:v:0",
    "-map", "0:a?",
    "-c:v", "libx264",
    "-preset", "veryfast",
    "-crf", "21",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac",
    "-b:a", "160k",
    "-movflags", "+faststart",
    item.video
  ], `${item.name} transcode`);

  await runFFmpeg([
    "-y",
    "-hide_banner",
    "-loglevel", "error",
    "-i", item.video,
    "-vf", "thumbnail=300,scale=1280:-2",
    "-frames:v", "1",
    "-q:v", "2",
    item.cover
  ], `${item.name} cover`);

  const videoInfo = await stat(item.video);
  const coverInfo = await stat(item.cover);
  if (videoInfo.size < 100000 || coverInfo.size < 5000) {
    throw new Error(`${item.name} output verification failed: video=${videoInfo.size}, cover=${coverInfo.size}`);
  }
  console.log(`${item.name} ready: H.264 MP4 ${(videoInfo.size / 1024 / 1024).toFixed(1)} MB, cover ${(coverInfo.size / 1024).toFixed(0)} KB`);
}
