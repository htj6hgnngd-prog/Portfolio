(() => {
  const works = {
    promo1: {
      title: "ПРОМО",
      role: "ПОЛНЫЙ ЦИКЛ",
      source: "https://disk.yandex.ru/i/iIj6z28I2z0d3w",
      video: "/media/promo-1-video"
    },
    promo2: {
      title: "ПРОМО 2",
      role: "ПОЛНЫЙ ЦИКЛ",
      source: "https://disk.yandex.ru/i/CGJbZxDuh1ORXw",
      video: "/media/promo-2-video"
    }
  };

  const openEventVideo = (key) => {
    const work = works[key];
    if (!work) return;

    const frame = document.getElementById("viewer-frame");
    const title = document.getElementById("viewer-title");
    const role = document.getElementById("viewer-role");
    const source = document.getElementById("viewer-source");
    const controls = document.getElementById("viewer-controls");
    if (!frame || !title || !role || !source || !controls || typeof openViewer !== "function") return;

    title.textContent = work.title;
    role.textContent = work.role;
    source.textContent = "ЯНДЕКС ДИСК ↗";
    source.href = work.source;
    controls.hidden = true;

    const player = document.createElement("video");
    player.className = "event-viewer-video";
    player.src = work.video;
    player.controls = true;
    player.autoplay = true;
    player.playsInline = true;
    player.preload = "metadata";
    player.setAttribute("webkit-playsinline", "");

    frame.replaceChildren(player);
    openViewer();

    const playPromise = player.play();
    if (playPromise?.catch) playPromise.catch(() => {});
  };

  document.querySelectorAll("[data-event-work]").forEach((button) => {
    button.addEventListener("click", () => openEventVideo(button.dataset.eventWork));
  });
})();

import("/photo-gallery.js?v=4").catch((error) => {
  console.error("Photo gallery failed to load", error);
});
