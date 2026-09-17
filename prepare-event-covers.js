import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));

const items = [
  {
    name: "promo-1",
    publicUrl: "https://disk.yandex.ru/i/iIj6z28I2z0d3w",
    output: path.join(root, "promo-1-cover.jpg")
  },
  {
    name: "promo-2",
    publicUrl: "https://disk.yandex.ru/i/CGJbZxDuh1ORXw",
    output: path.join(root, "promo-2-cover.jpg")
  }
];

async function getPreviewUrl(publicUrl) {
  const api = `https://cloud-api.yandex.net/v1/disk/public/resources?public_key=${encodeURIComponent(publicUrl)}`;
  const response = await fetch(api, {
    redirect: "follow",
    headers: {
      accept: "application/json",
      "user-agent": "Mozilla/5.0 PortfolioCoverBuilder/1.0"
    }
  });
  if (!response.ok) throw new Error(`metadata ${response.status}`);
  const data = await response.json();
  if (!data.preview) throw new Error("preview URL missing");
  return data.preview;
}

function previewCandidate(raw, size) {
  const url = new URL(raw);
  url.searchParams.set("size", size);
  url.searchParams.set("crop", "0");
  url.searchParams.set("quality", "95");
  return url.toString();
}

async function fetchJpeg(url) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: {
      accept: "image/jpeg,image/*;q=0.9,*/*;q=0.8",
      "user-agent": "Mozilla/5.0 PortfolioCoverBuilder/1.0"
    }
  });
  if (!response.ok) throw new Error(`preview ${response.status}`);
  const type = response.headers.get("content-type") || "";
  const bytes = Buffer.from(await response.arrayBuffer());
  if (!type.startsWith("image/") || bytes.length < 64) {
    throw new Error(`invalid preview type=${type} bytes=${bytes.length}`);
  }
  return { bytes, type };
}

for (const item of items) {
  const raw = await getPreviewUrl(item.publicUrl);
  let best = null;
  let lastError = null;

  for (const size of ["XXXL", "XXL", "XL", "L"]) {
    try {
      const candidate = await fetchJpeg(previewCandidate(raw, size));
      if (!best || candidate.bytes.length > best.bytes.length) {
        best = { ...candidate, size };
      }
      if (candidate.bytes.length >= 20_000) break;
    } catch (error) {
      lastError = error;
    }
  }

  if (!best) {
    try {
      const fallback = await fetchJpeg(raw);
      best = { ...fallback, size: "original" };
    } catch (error) {
      lastError = error;
    }
  }

  if (!best) throw new Error(`${item.name}: ${lastError?.message || "cover unavailable"}`);

  await writeFile(item.output, best.bytes);
  console.log(`${item.name} cover prepared: ${best.type}, size=${best.size}, ${best.bytes.length} bytes`);
}
