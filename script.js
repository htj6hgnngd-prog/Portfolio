const works = [
  { id: "pPTTScpvxMA", title: "НИЖНИЙ НОВГОРОД", fullTitle: "НИЖНИЙ НОВГОРОД. КАК Я ОБЛАЖАЛСЯ И РАЗОЗЛИЛ МЕСТНЫХ?", role: "ПОЛНАЯ СЪЁМКА", image: "https://i.ytimg.com/vi/pPTTScpvxMA/maxresdefault.jpg" },
  { id: "RBRXIkmQUJI", title: "ТАТАРСТАН", fullTitle: "ПАФОС И БАБЛО В ТАТАРСТАНЕ. ПОЧЕМУ В КАЗАНИ ТАК ХОРОШО ЖИВУТ?", role: "ПОЛНАЯ СЪЁМКА", image: "https://i.ytimg.com/vi/RBRXIkmQUJI/maxresdefault.jpg" },
  { id: "FhwHKvgYwGo", title: "МАРКЕТПЛЕЙСЫ", fullTitle: "ПОЧЕМУ МАРКЕТПЛЕЙСЫ НЕ БИЗНЕС И КТО НА НИХ ЗАРАБАТЫВАЕТ?", role: "СЪЁМКА БОЛЬШЕЙ ЧАСТИ ИНТЕРВЬЮ", image: "https://i.ytimg.com/vi/FhwHKvgYwGo/maxresdefault.jpg" }
];

const ai = {
  title: "РЕКЛАМА ТОВАРА ДЛЯ МАРКЕТПЛЕЙСА",
  role: "ИИ-РОЛИК",
  behance: "https://www.behance.net/gallery/230138193/Veo-3-AI-Ads"
};

let activeVideo = 0;
let viewerType = null;

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

function restoreAIPlayer() {
  const player = $("#ai-player");
  const home = $("#ai-player-home");
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
    // Some mobile browsers can briefly reject seeks while metadata is changing.
  }
}

function resetViewer() {
  const viewer = $("#viewer");
  if (!viewer) return;

  restoreAIPlayer();

  const frame = $("#viewer-frame");
  if (frame) frame.replaceChildren();

  viewer.classList.remove("is-open");
  viewer.hidden = true;
  viewer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  viewerType = null;
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

  $("#viewer-title").textContent = work.title;
  $("#viewer-role").textContent = work.role;
  $("#viewer-source").textContent = "ЮТУБ ↗";
  $("#viewer-source").href = `https://www.youtube.com/watch?v=${work.id}`;
  $("#viewer-count").textContent = `${String(index + 1).padStart(2, "0")} / ${String(works.length).padStart(2, "0")}`;
  $("#viewer-controls").hidden = false;
  $("#viewer-frame").innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${work.id}?autoplay=1&rel=0&playsinline=1&modestbranding=1" title="${work.fullTitle.replaceAll('"', '&quot;')}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;

  openViewer();
}

function renderAI() {
  const player = $("#ai-player");
  const frame = $("#viewer-frame");
  if (!player || !frame) return;

  viewerType = "ai";
  $("#viewer-title").textContent = ai.title;
  $("#viewer-role").textContent = ai.role;
  $("#viewer-source").textContent = "БЕХАНС ↗";
  $("#viewer-source").href = ai.behance;
  $("#viewer-controls").hidden = true;

  player.controls = true;
  player.muted = false;
  player.setAttribute("tabindex", "0");
  player.setAttribute("aria-hidden", "false");
  frame.replaceChildren(player);

  openViewer();

  const playPromise = player.play();
  if (playPromise?.catch) playPromise.catch(() => {});
}

function openViewer() {
  const viewer = $("#viewer");
  viewer.hidden = false;
  viewer.setAttribute("aria-hidden", "false");
  viewer.classList.add("is-open");
  document.body.classList.add("modal-open");
  $("#viewer-close").focus({ preventScroll: true });
}

function closeViewer() {
  resetViewer();
}

function moveVideo(direction) {
  if (viewerType !== "youtube") return;
  renderYoutube((activeVideo + direction + works.length) % works.length);
}

function prewarmAI() {
  const player = $("#ai-player");
  if (!player || player.dataset.prewarmed === "1") return;
  player.dataset.prewarmed = "1";
  player.preload = "auto";
  player.load();
}

$("#youtube-featured").addEventListener("click", () => renderYoutube(activeVideo));
$$(".work-thumb").forEach((el, index) => el.addEventListener("click", () => renderYoutube(index)));
$("#ai-featured").addEventListener("click", renderAI);
$("#viewer-close").addEventListener("click", closeViewer);
$("#viewer-prev").addEventListener("click", () => moveVideo(-1));
$("#viewer-next").addEventListener("click", () => moveVideo(1));
$("#viewer").addEventListener("pointerdown", (event) => {
  if (event.target === $("#viewer")) closeViewer();
});

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
      prewarmAI();
      instance.disconnect();
    }
  }, { rootMargin: "1800px 0px" });
  observer.observe(aiSection);
}

window.addEventListener("load", () => {
  if (!navigator.connection?.saveData) setTimeout(prewarmAI, 120);
}, { once: true });

window.addEventListener("scroll", updateNav, { passive: true });
window.addEventListener("pageshow", resetViewer);
window.addEventListener("pagehide", resetViewer);

resetViewer();
updateNav();
