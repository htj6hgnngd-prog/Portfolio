import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import { copyFile, rename, stat, unlink } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const root = path.dirname(fileURLToPath(import.meta.url));

const items = [
  {
    name: "promo-1",
    publicUrl: "https://disk.yandex.ru/i/iIj6z28I2z0d3w",
    source: "/tmp/portfolio-promo-1-source.mov",
    video: "/tmp/portfolio-promo-1.mp4",
    cover: path.join(root, "promo-1-cover.jpg"),
    coverTimes: ["00:00:08.000", "00:00:14.000", "00:00:20.000", "00:00:26.000", "00:00:32.000"]
  },
  {
    name: "promo-2",
    publicUrl: "https://disk.yandex.ru/i/CGJbZxDuh1ORXw",
    source: "/tmp/portfolio-promo-2-source.mov",
    video: "/tmp/portfolio-promo-2.mp4",
    cover: path.join(root, "promo-2-cover.jpg"),
    coverTimes: ["00:00:06.000"]
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
    child.on("exit", (code, signal) => {
      if (code === 0) return resolve(errorText);
      reject(new Error(`${label} failed (code=${code}, signal=${signal || "none"}): ${errorText.slice(-3000)}`));
    });
  });
}

function probeVideoCodec(file) {
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, ["-hide_banner", "-i", file], { stdio: ["ignore", "ignore", "pipe"] });
    let text = "";
    child.stderr.on("data", (chunk) => { text += chunk.toString(); });
    child.on("error", reject);
    child.on("exit", () => {
      const match = text.match(/Video:\s*([^,\s]+)/i);
      resolve(match?.[1]?.toLowerCase() || "unknown");
    });
  });
}

async function resolveMetadata(publicUrl) {
  const api = `https://cloud-api.yandex.net/v1/disk/public/resources?public_key=${encodeURIComponent(publicUrl)}`;
  const response = await fetch(api, {
    redirect: "follow",
    headers: {
      accept: "application/json",
      "user-agent": "Mozilla/5.0 PortfolioEventMediaBuilder/5.0"
    }
  });
  if (!response.ok) throw new Error(`Yandex metadata ${response.status}`);
  const data = await response.json();
  if (!data.file) throw new Error("Yandex metadata returned no direct file URL");
  return data;
}

async function downloadFile(url, output) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: { "user-agent": "Mozilla/5.0 PortfolioEventMediaBuilder/5.0" }
  });
  if (!response.ok || !response.body) throw new Error(`event source download ${response.status}`);
  await pipeline(Readable.fromWeb(response.body), createWriteStream(output));
}

async function buildCover(item) {
  let best = null;
  const candidates = [];

  for (let i = 0; i < item.coverTimes.length; i += 1) {
    const at = item.coverTimes[i];
    const candidate = `${item.cover}.candidate-${i}.jpg`;
    try {
      await runFFmpeg([
        "-y", "-hide_banner", "-loglevel", "error",
        "-ss", at,
        "-i", item.source,
        "-frames:v", "1",
        "-vf", "scale=1280:-2",
        "-q:v", "2",
        candidate
      ], `${item.name} cover ${at}`);
      const info = await stat(candidate);
      candidates.push(candidate);
      if (info.size >= 5000 && (!best || info.size > best.size)) {
        best = { path: candidate, size: info.size, at };
      }
    } catch (error) {
      console.warn(`${item.name}: cover candidate ${at} skipped: ${error.message}`);
    }
  }

  if (!best) throw new Error(`${item.name}: no valid cover candidate`);
  await copyFile(best.path, item.cover);
  await Promise.all(candidates.map((candidate) => unlink(candidate).catch(() => {})));
  console.log(`${item.name}: selected cover frame ${best.at}, ${(best.size / 1024).toFixed(0)} KB`);
}

for (const item of items) {
  const meta = await resolveMetadata(item.publicUrl);
  console.log(`${meta.name || item.name}: ${meta.mime_type || "unknown"}, ${Number(meta.size || 0)} bytes`);

  await downloadFile(meta.file, item.source);
  const sourceInfo = await stat(item.source);
  if (sourceInfo.size < 100000) throw new Error(`${item.name}: downloaded source is too small`);
  console.log(`${item.name} cached source: ${(sourceInfo.size / 1024 / 1024).toFixed(1)} MB`);

  await runFFmpeg([
    "-y", "-hide_banner", "-loglevel", "error",
    "-i", item.source,
    "-map", "0:v:0", "-map", "0:a?",
    "-c", "copy",
    "-movflags", "+faststart",
    item.video
  ], `${item.name} remux`);

  let codec = await probeVideoCodec(item.video);
  if (codec !== "h264" && codec !== "avc1") {
    const converted = `${item.video}.h264.mp4`;
    console.log(`${item.name}: codec ${codec}, converting to browser-safe H.264`);
    await runFFmpeg([
      "-y", "-hide_banner", "-loglevel", "error",
      "-i", item.source,
      "-map", "0:v:0", "-map", "0:a?",
      "-c:v", "libx264", "-preset", "ultrafast", "-crf", "22", "-threads", "1",
      "-pix_fmt", "yuv420p",
      "-c:a", "aac", "-b:a", "160k",
      "-movflags", "+faststart",
      converted
    ], `${item.name} compatibility transcode`);
    await rename(converted, item.video);
    codec = await probeVideoCodec(item.video);
  }

  if (codec !== "h264" && codec !== "avc1") {
    throw new Error(`${item.name}: unsupported output codec ${codec}`);
  }

  await buildCover(item);

  const videoInfo = await stat(item.video);
  const coverInfo = await stat(item.cover);
  if (videoInfo.size < 100000 || coverInfo.size < 5000) {
    throw new Error(`${item.name} output verification failed: video=${videoInfo.size}, cover=${coverInfo.size}`);
  }
  console.log(`${item.name} ready: ${codec} MP4 ${(videoInfo.size / 1024 / 1024).toFixed(1)} MB, cover ${(coverInfo.size / 1024).toFixed(0)} KB`);
}
