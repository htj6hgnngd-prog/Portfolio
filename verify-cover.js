import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

function jpegSize(buffer) {
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buffer[offset + 1];
    offset += 2;
    if (marker === 0xd8 || marker === 0xd9) continue;
    if (offset + 2 > buffer.length) break;
    const length = buffer.readUInt16BE(offset);
    const sof = [0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker);
    if (sof && offset + 7 < buffer.length) {
      return { height: buffer.readUInt16BE(offset + 3), width: buffer.readUInt16BE(offset + 5) };
    }
    if (length < 2) break;
    offset += length;
  }
  return null;
}

const chunks = await Promise.all(
  Array.from({ length: 6 }, (_, index) => readFile(path.join(root, `cover-chunk-${index}.txt`), "utf8"))
);
const base64 = chunks.join("").replace(/\s+/g, "");
if (base64.length !== 31580) throw new Error(`Cover base64 length mismatch: ${base64.length}`);

const buffer = Buffer.from(base64, "base64");
if (buffer.length !== 23683) throw new Error(`Cover byte length mismatch: ${buffer.length}`);
if (buffer[0] !== 0xff || buffer[1] !== 0xd8 || buffer.at(-2) !== 0xff || buffer.at(-1) !== 0xd9) {
  throw new Error("Cover is not a complete JPEG");
}
const size = jpegSize(buffer);
if (!size || size.width !== 480 || size.height !== 270) {
  throw new Error(`Cover dimensions invalid: ${size ? `${size.width}x${size.height}` : "unreadable"}`);
}

const [html, css, loader] = await Promise.all([
  readFile(path.join(root, "index.html"), "utf8"),
  readFile(path.join(root, "hotfix.css"), "utf8"),
  readFile(path.join(root, "cover-loader.js"), "utf8")
]);

for (const token of ["id=\"cartoon-cover-img\"", "/cover-loader.js?v=1"]) {
  if (!html.includes(token)) throw new Error(`Cover wiring missing in index.html: ${token}`);
}
for (const token of ["#ai-cartoon-home > .ai-native-video", "#ai-cartoon-home > .cartoon-cover-img", "display: none !important"]) {
  if (!css.includes(token)) throw new Error(`Cover CSS wiring missing: ${token}`);
}
for (const token of ["31580", "23683", "data:image/jpeg;base64"]) {
  if (!loader.includes(token)) throw new Error(`Cover loader validation missing: ${token}`);
}

console.log(`Cartoon cover verified: ${size.width}x${size.height}, ${buffer.length} bytes; DOM/CSS/loader wired`);
