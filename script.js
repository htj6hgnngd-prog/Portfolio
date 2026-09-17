const works = [
  { id: "pPTTScpvxMA", title: "НИЖНИЙ НОВГОРОД", fullTitle: "НИЖНИЙ НОВГОРОД. КАК Я ОБЛАЖАЛСЯ И РАЗОЗЛИЛ МЕСТНЫХ?", role: "ПОЛНАЯ СЪЁМКА", image: "https://i.ytimg.com/vi/pPTTScpvxMA/maxresdefault.jpg" },
  { id: "RBRXIkmQUJI", title: "ТАТАРСТАН", fullTitle: "ПАФОС И БАБЛО В ТАТАРСТАНЕ. ПОЧЕМУ В КАЗАНИ ТАК ХОРОШО ЖИВУТ?", role: "ПОЛНАЯ СЪЁМКА", image: "https://i.ytimg.com/vi/RBRXIkmQUJI/maxresdefault.jpg" },
  { id: "FhwHKvgYwGo", title: "МАРКЕТПЛЕЙСЫ", fullTitle: "ПОЧЕМУ МАРКЕТПЛЕЙСЫ НЕ БИЗНЕС И КТО НА НИХ ЗАРАБАТЫВАЕТ?", role: "СЪЁМКА БОЛЬШЕЙ ЧАСТИ ИНТЕРВЬЮ", image: "https://i.ytimg.com/vi/FhwHKvgYwGo/maxresdefault.jpg" }
];

const aiWorks = {
  cartoon: {
    title: "МУЛЬТФИЛЬМ",
    role: "ПОЛНЫЙ АВТОРСКИЙ ЦИКЛ",
    sourceLabel: "ЯНДЕКС ДИСК ↗",
    source: "https://disk.yandex.ru/i/Q6JaTkvI-IB1tw",
    playerId: "ai-cartoon-player",
    homeId: "ai-cartoon-home"
  },
  ad: {
    title: "РЕКЛАМА ТОВАРА ДЛЯ МАРКЕТПЛЕЙСА",
    role: "ПОЛНЫЙ АВТОРСКИЙ ЦИКЛ",
    sourceLabel: "БЕХАНС ↗",
    source: "https://www.behance.net/gallery/230138193/Veo-3-AI-Ads",
    playerId: "ai-ad-player",
    homeId: "ai-ad-home"
  }
};

let activeVideo = 0;
let viewerType = null;
let activeAIKey = null;
let viewerScrollY = null;

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

function lockViewerScroll() {
  if (viewerScrollY !== null) return;
  viewerScrollY = window.scrollY;
  const body = document.body;
  body.classList.add("modal-open");
  body.style.position = "fixed";
  body.style.top = `-${viewerScrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
}

function unlockViewerScroll() {
  if (viewerScrollY === null) {
    document.body.classList.remove("modal-open");
    return;
  }

  const y = viewerScrollY;
  viewerScrollY = null;
  const body = document.body;
  body.classList.remove("modal-open");
  body.style.position = "";
  body.style.top = "";
  body.style.left = "";
  body.style.right = "";
  body.style.width = "";
  window.scrollTo(0, y);
}

function prepareCartoonPoster() {
  const player = document.getElementById("ai-cartoon-player");
  if (!player || player.dataset.posterPrepared === "1" || player.dataset.posterPreparing === "1") return;

  player.dataset.posterPreparing = "1";
  player.preload = "auto";

  const capture = () => {
    if (!player.videoWidth || !player.videoHeight) return;

    try {
      const maxWidth = 1280;
      const scale = Math.min(1, maxWidth / player.videoWidth);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(player.videoWidth * scale);
      canvas.height = Math.round(player.videoHeight * scale);
      const context = canvas.getContext("2d", { alpha: false });
      context.drawImage(player, 0, 0, canvas.width, canvas.height);
      player.poster = canvas.toDataURL("image/jpeg", 0.9);
      player.dataset.posterPrepared = "1";
    } catch {
      // Keep the server-provided fallback poster if canvas capture is unavailable.
    }

    player.dataset.posterPreparing = "0";
    try { player.currentTime = 0; } catch {}
  };

  const seekToTitle = () => {
    const titleTime = 1.5;
    const safeTime = Number.isFinite(player.duration)
      ? Math.min(titleTime, Math.max(0, player.duration - 0.1))
      : titleTime;

    const onSeeked = () => {
      player.removeEventListener("seeked", onSeeked);
      capture();
    };

    player.addEventListener("seeked", onSeeked, { once: true });
    try {
      player.currentTime = safeTime;
    } catch {
      player.dataset.posterPreparing = "0";
    }
  };

  if (player.readyState >= 1) {
    seekToTitle();
  } else {
    player.addEventListener("loadedmetadata", seekToTitle, { once: true });
    player.load();
  }
}

function restoreAIPlayer(key = activeAIKey) {
  if (!key || !aiWorks[key]) return;
  const work = aiWorks[key];
  const player = document.getElementById(work.playerId);
  const home = document.getElementById(work.homeId);
  if (!player || !home) return;

  player.pause();
  player.controls = false;
  player.muted = true;
  player.setAttribute("tabindex", "-1");
  player.setAttribute("aria-hidden", "true");

  if (player.parentElement !== home) home.insertBefore(player, home.firstChild);

  try {
    if (player.readyState > 0) player.currentTime = 0;
  } catch {
    // Mobile browsers can reject a seek while metadata is changing.
  }
}

function resetViewer() {
  const viewer = $("#viewer");
  if (!viewer) return;

  if (activeAIKey) restoreAIPlayer(activeAIKey);

  const frame = $("#viewer-frame");
  if (frame) frame.replaceChildren();

  viewer.classList.remove("is-open");
  viewer.hidden = true;
  viewer.setAttribute("aria-hidden", "true");
  unlockViewerScroll();
  viewerType = null;
  activeAIKey = null;
}

function updateFeatured(index) {
  activeVideo = index;
  const work = works[index];
  $("#featured-image").src = work.image;
  $("#featured-title").textContent = work.title;
  $("#featured-role").textContent = work.role;
  $$(".work-thumb").forEach((el, i) => el.classList.toggle("is-selected", i === index));
}

function renderYoutube(index) {
  updateFeatured(index);
  const work = works[index];
  viewerType = "youtube";
  activeAIKey = null;

  $("#viewer-title").textContent = work.title;
  $("#viewer-role").textContent = work.role;
  $("#viewer-source").textContent = "ЮТУБ ↗";
  $("#viewer-source").href = `https://www.youtube.com/watch?v=${work.id}`;
  $("#viewer-count").textContent = `${String(index + 1).padStart(2, "0")} / ${String(works.length).padStart(2, "0")}`;
  $("#viewer-controls").hidden = false;
  $("#viewer-frame").innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${work.id}?autoplay=1&rel=0&playsinline=1&modestbranding=1" title="${work.fullTitle.replaceAll('"', '&quot;')}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;

  openViewer();
}

function renderAI(key) {
  const work = aiWorks[key];
  if (!work) return;

  const player = document.getElementById(work.playerId);
  const frame = $("#viewer-frame");
  if (!player || !frame) return;

  if (activeAIKey && activeAIKey !== key) restoreAIPlayer(activeAIKey);

  viewerType = "ai";
  activeAIKey = key;
  $("#viewer-title").textContent = work.title;
  $("#viewer-role").textContent = work.role;
  $("#viewer-source").textContent = work.sourceLabel;
  $("#viewer-source").href = work.source;
  $("#viewer-controls").hidden = true;

  player.controls = true;
  player.muted = false;
  player.setAttribute("tabindex", "0");
  player.setAttribute("aria-hidden", "false");
  try { player.currentTime = 0; } catch {}
  frame.replaceChildren(player);

  openViewer();

  const playPromise = player.play();
  if (playPromise?.catch) playPromise.catch(() => {});
}

function openViewer() {
  const viewer = $("#viewer");
  lockViewerScroll();
  viewer.hidden = false;
  viewer.setAttribute("aria-hidden", "false");
  viewer.classList.add("is-open");
  $("#viewer-close").focus({ preventScroll: true });
}

function closeViewer() {
  resetViewer();
}

function moveVideo(direction) {
  if (viewerType !== "youtube") return;
  renderYoutube((activeVideo + direction + works.length) % works.length);
}

function prewarmAI(key) {
  const work = aiWorks[key];
  if (!work) return;
  const player = document.getElementById(work.playerId);
  if (!player || player.dataset.prewarmed === "1") return;
  player.dataset.prewarmed = "1";
  player.preload = "auto";
  player.load();
}

$("#youtube-featured").addEventListener("click", () => renderYoutube(activeVideo));
$$(".work-thumb").forEach((el, index) => el.addEventListener("click", () => renderYoutube(index)));
$$('[data-ai-work]').forEach((el) => el.addEventListener("click", () => renderAI(el.dataset.aiWork)));
$("#viewer-close").addEventListener("click", closeViewer);
$("#viewer-prev").addEventListener("click", () => moveVideo(-1));
$("#viewer-next").addEventListener("click", () => moveVideo(1));

const viewerElement = $("#viewer");
viewerElement.addEventListener("pointerdown", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const isInteractive = target?.closest(".viewer-header, .viewer-frame, .viewer-controls");
  if (!isInteractive) {
    event.preventDefault();
    closeViewer();
  }
});

viewerElement.addEventListener("touchmove", (event) => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target?.closest(".viewer-frame")) event.preventDefault();
}, { passive: false });

document.addEventListener("keydown", (event) => {
  if (!$("#viewer").classList.contains("is-open")) return;
  if (event.key === "Escape") closeViewer();
  if (event.key === "ArrowLeft") moveVideo(-1);
  if (event.key === "ArrowRight") moveVideo(1);
});

const navButtons = $$(".nav-grid button");
const sections = navButtons.map((button) => document.getElementById(button.dataset.target));
navButtons.forEach((button) => button.addEventListener("click", () => document.getElementById(button.dataset.target)?.scrollIntoView({ behavior: "smooth", block: "start" })));

function updateNav() {
  const marker = 92;
  let current = sections[0]?.id;
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= marker) current = section.id;
  });
  navButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.target === current));
}

const aiSection = $("#ai");
if (aiSection && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, instance) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      prewarmAI("cartoon");
      prewarmAI("ad");
      instance.disconnect();
    }
  }, { rootMargin: "1800px 0px" });
  observer.observe(aiSection);
}

prepareCartoonPoster();

window.addEventListener("load", () => {
  if (!navigator.connection?.saveData) {
    setTimeout(() => prewarmAI("cartoon"), 80);
    setTimeout(() => prewarmAI("ad"), 180);
  }
}, { once: true });

window.addEventListener("scroll", updateNav, { passive: true });
window.addEventListener("pageshow", resetViewer);
window.addEventListener("pagehide", resetViewer);

resetViewer();
updateNav();
