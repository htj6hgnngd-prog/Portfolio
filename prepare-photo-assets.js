import { spawn } from "node:child_process";
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const root = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.join(root, "assets", "photos");

function runFFmpeg(args, label) {
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
      if (stderr.length > 5000) stderr = stderr.slice(-5000);
    });
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) return resolve();
      reject(new Error(label + " failed (code=" + code + ", signal=" + (signal || "none") + "): " + stderr.slice(-1200)));
    });
  });
}

let sourceBytes = 0;
let webpBytes = 0;

for (let i = 1; i <= 10; i += 1) {
  const id = String(i).padStart(2, "0");
  const input = path.join(sourceDir, "reportage-" + id + ".jpg");
  const output = "/tmp/portfolio-reportage-" + id + ".webp";

  try {
    await runFFmpeg([
      "-y", "-hide_banner", "-loglevel", "error",
      "-i", input,
      "-frames:v", "1",
      "-c:v", "libwebp",
      "-q:v", "86",
      "-compression_level", "5",
      output
    ], "photo " + id);

    const [src, dst] = await Promise.all([stat(input), stat(output)]);
    sourceBytes += src.size;
    webpBytes += dst.size;
  } catch (error) {
    console.error("Photo optimization skipped for " + id + ":", error.message);
  }
}

if (sourceBytes && webpBytes) {
  const reduction = Math.round((1 - webpBytes / sourceBytes) * 100);
  console.log("Photo WebP set ready: " + (webpBytes / 1024).toFixed(0) + " KB (JPEG " + (sourceBytes / 1024).toFixed(0) + " KB, -" + reduction + "%)");
}
