(() => {
  const works = {
    promo1: { video: "/media/promo-1-video", ratio: 0.18 },
    promo2: { video: "/media/promo-2-video", ratio: 0.22 }
  };

  const waitFor = (target, eventName, errorName = "error", timeoutMs = 18000) =>
    new Promise((resolve, reject) => {
      let timer;
      const cleanup = () => {
        clearTimeout(timer);
        target.removeEventListener(eventName, onReady);
        target.removeEventListener(errorName, onError);
      };
      const onReady = () => {
        cleanup();
        resolve();
      };
      const onError = () => {
        cleanup();
        reject(new Error(`${eventName} failed`));
      };
      target.addEventListener(eventName, onReady, { once: true });
      target.addEventListener(errorName, onError, { once: true });
      timer = setTimeout(() => {
        cleanup();
        reject(new Error(`${eventName} timeout`));
      }, timeoutMs);
    });

  async function captureFrame(key) {
    const work = works[key];
    const image = document.querySelector(`[data-event-work="${key}"] .media-frame > img`);
    if (!work || !image || image.dataset.autoFrame === "1") return;

    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = work.video;

    try {
      if (video.readyState < 1) await waitFor(video, "loadedmetadata");

      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      const targetTime = duration > 0
        ? Math.min(Math.max(duration * work.ratio, 1.5), Math.max(duration - 0.25, 0.1))
        : 1.5;

      const seeked = waitFor(video, "seeked");
      video.currentTime = targetTime;
      await seeked;

      if (!video.videoWidth || !video.videoHeight) throw new Error("Video dimensions unavailable");

      const maxWidth = 1280;
      const scale = Math.min(1, maxWidth / video.videoWidth);
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
      canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
      const context = canvas.getContext("2d", { alpha: false });
      if (!context) throw new Error("Canvas unavailable");

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frame = canvas.toDataURL("image/jpeg", 0.9);
      if (!frame || frame === "data:,") throw new Error("Empty frame");

      image.src = frame;
      image.dataset.autoFrame = "1";
    } catch {
      // Keep the Yandex-generated poster already present in the markup as fallback.
    } finally {
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
  }

  const start = async () => {
    await captureFrame("promo1");
    await captureFrame("promo2");
  };

  const section = document.getElementById("video");
  if (!section || !("IntersectionObserver" in window)) {
    start();
    return;
  }

  const observer = new IntersectionObserver((entries, instance) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    instance.disconnect();
    start();
  }, { rootMargin: "900px 0px" });

  observer.observe(section);
})();
