import http from "node:http";
import { spawn } from "node:child_process";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";

const externalPort = Number(process.env.PORT || 3000);
const internalPort = externalPort === 3001 ? 3002 : 3001;

const EVENT_VIDEO_FILES = {
  "/media/promo-1-video": "/tmp/portfolio-promo-1.mp4",
  "/media/promo-2-video": "/tmp/portfolio-promo-2.mp4"
};

function parseRange(range, total) {
  if (!range) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!match) return { invalid: true };

  let start;
  let end;
  if (!match[1] && match[2]) {
    const suffix = Number(match[2]);
    if (!Number.isFinite(suffix) || suffix <= 0) return { invalid: true };
    start = Math.max(total - suffix, 0);
    end = total - 1;
  } else {
    start = match[1] ? Number(match[1]) : 0;
    end = match[2] ? Math.min(Number(match[2]), total - 1) : total - 1;
  }

  if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || start > end || start >= total) {
    return { invalid: true };
  }
  return { start, end };
}

async function serveLocalVideo(req, res, file) {
  const info = await stat(file);
  const total = info.size;
  const range = parseRange(req.headers.range, total);
  const common = {
    "content-type": "video/mp4",
    "accept-ranges": "bytes",
    "cache-control": "public, max-age=86400",
    "access-control-allow-origin": "*"
  };

  if (!range) {
    res.writeHead(200, { ...common, "content-length": total });
    if (req.method === "HEAD") return res.end();
    return createReadStream(file).pipe(res);
  }

  if (range.invalid) {
    res.writeHead(416, { "content-range": `bytes */${total}` });
    return res.end();
  }

  res.writeHead(206, {
    ...common,
    "content-range": `bytes ${range.start}-${range.end}/${total}`,
    "content-length": range.end - range.start + 1
  });
  if (req.method === "HEAD") return res.end();
  createReadStream(file, { start: range.start, end: range.end }).pipe(res);
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
      const response = await fetch(`http://127.0.0.1:${internalPort}/`);
      if (response.ok) {
        await response.arrayBuffer();
        return;
      }
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Internal portfolio server did not start");
}

let mediaPrepareStarted = false;

function prepareSiteCaptureInBackground() {
  const worker = spawn(process.execPath, ["prepare-site-capture.js"], {
    env: process.env,
    stdio: ["ignore", "inherit", "inherit"]
  });

  worker.on("error", (error) => {
    console.error("Site capture optimization failed to start:", error.message);
  });

  worker.on("exit", (code, signal) => {
    if (code === 0) return;
    console.error(`Site capture optimization exited: code=${code} signal=${signal || "none"}`);
  });
}

function prepareEventMediaInBackground() {
  if (mediaPrepareStarted) return;
  mediaPrepareStarted = true;

  const worker = spawn(process.execPath, ["prepare-event-media.js"], {
    env: process.env,
    stdio: ["ignore", "inherit", "inherit"]
  });

  worker.on("error", (error) => {
    console.error("Event media background preparation failed to start:", error.message);
  });

  worker.on("exit", (code, signal) => {
    if (code === 0) {
      console.log("Event media background preparation complete");
      return;
    }
    console.error(`Event media background preparation exited: code=${code} signal=${signal || "none"}`);
  });
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
    const localVideo = EVENT_VIDEO_FILES[url.pathname];
    if (localVideo) {
      try {
        await serveLocalVideo(req, res, localVideo);
      } catch (error) {
        if (error?.code === "ENOENT") {
          proxyToInternal(req, res);
          return;
        }
        throw error;
      }
      return;
    }
    proxyToInternal(req, res);
  } catch (error) {
    console.error("Portfolio proxy error:", error);
    if (!res.headersSent) {
      res.writeHead(502, { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" });
    }
    res.end("Media unavailable");
  }
});

server.listen(externalPort, "0.0.0.0", () => {
  console.log(`Portfolio proxy listening on ${externalPort}, internal app on ${internalPort}`);
  setTimeout(prepareSiteCaptureInBackground, 250).unref();
  setTimeout(prepareEventMediaInBackground, 12000).unref();
});
