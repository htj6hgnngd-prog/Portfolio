import { spawn } from "node:child_process";
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const root = path.dirname(fileURLToPath(import.meta.url));
const input = path.join(root, "assets", "site-case", "denisovphoto-desktop.png");
const output = "/tmp/portfolio-denisovphoto-desktop.webp";

function runFFmpeg(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
      if (stderr.length > 6000) stderr = stderr.slice(-6000);
    });
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) return resolve();
      reject(new Error("site capture conversion failed (code=" + code + ", signal=" + (signal || "none") + "): " + stderr.slice(-1500)));
    });
  });
}

try {
  await runFFmpeg([
    "-y",
    "-hide_banner",
    "-loglevel", "error",
    "-i", input,
    "-frames:v", "1",
    "-c:v", "libwebp",
    "-q:v", "86",
    "-compression_level", "6",
    output
  ]);

  const [sourceInfo, outputInfo] = await Promise.all([stat(input), stat(output)]);
  const reduction = Math.round((1 - outputInfo.size / sourceInfo.size) * 100);
  console.log("Site capture WebP ready: " + (outputInfo.size / 1024).toFixed(0) + " KB (PNG " + (sourceInfo.size / 1024).toFixed(0) + " KB, -" + reduction + "%)");
} catch (error) {
  console.error("Site capture WebP optimization skipped:", error.message);
  process.exitCode = 0;
}
