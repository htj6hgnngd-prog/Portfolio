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

const eventWorks={promo1:{title:"ПРОМО",role:"ПОЛНЫЙ ЦИКЛ",source:"https://disk.yandex.ru/i/iIj6z28I2z0d3w",video:"/media/promo-1-video"},promo2:{title:"ПРОМО 2",role:"ПОЛНЫЙ ЦИКЛ",source:"https://disk.yandex.ru/i/CGJbZxDuh1ORXw",video:"/media/promo-2-video"}};
function renderEvent(key){const w=eventWorks[key];if(!w)return;viewerType="event";activeAIKey=null;$("#viewer-title").textContent=w.title;$("#viewer-role").textContent=w.role;$("#viewer-source").textContent="ЯНДЕКС ДИСК ↗";$("#viewer-source").href=w.source;$("#viewer-controls").hidden=true;const p=document.createElement("video");p.className="event-viewer-video";p.src=w.video;p.controls=true;p.autoplay=true;p.playsInline=true;p.preload="metadata";p.setAttribute("webkit-playsinline","");$("#viewer-frame").replaceChildren(p);openViewer();const play=p.play();if(play?.catch)play.catch(()=>{})}
let activeVideo = 0;
let viewerType = null;
let activeAIKey = null;
let viewerScrollY = null;

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

function lockViewerScroll(){if(viewerScrollY!==null)return;viewerScrollY=window.scrollY;document.documentElement.classList.add("modal-open");document.body.classList.add("modal-open")}
function unlockViewerScroll(){const y=viewerScrollY;viewerScrollY=null;document.documentElement.classList.remove("modal-open");document.body.classList.remove("modal-open");if(y!==null&&Math.abs(window.scrollY-y)>1)requestAnimationFrame(()=>window.scrollTo(0,y))}
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

  if (key === "cartoon") {
    const cover = document.getElementById("cartoon-cover-img");
    const coverSrc = cover?.currentSrc || cover?.src;
    if (coverSrc) player.poster = coverSrc;
  }
  player.preload = "auto";
  try { player.load(); } catch {}

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

$("#youtube-featured").addEventListener("click", () => renderYoutube(activeVideo));
$$(".work-thumb").forEach((el, index) => el.addEventListener("click", () => renderYoutube(index)));
$('[data-ai-work]').forEach((el) => el.addEventListener("click", () => renderAI(el.dataset.aiWork)));
$("[data-event-work]").forEach((el)=>el.addEventListener("click",()=>renderEvent(el.dataset.eventWork)));
$("#viewer-close").addEventListener("click", closeViewer);
$("#viewer-prev").addEventListener("click", () => moveVideo(-1));
$("#viewer-next").addEventListener("click", () => moveVideo(1));

const viewerElement=$("#viewer");const isViewerInteractiveTarget=t=>t instanceof Element&&Boolean(t.closest(".viewer-header,.viewer-frame,.viewer-controls"));viewerElement.addEventListener("click",e=>{if(isViewerInteractiveTarget(e.target))return;e.preventDefault();e.stopImmediatePropagation();closeViewer()},true);viewerElement.addEventListener("touchmove", (event) => {
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

let navFrame = 0;
window.addEventListener("scroll", () => {
  if (navFrame) return;
  navFrame = requestAnimationFrame(() => {
    navFrame = 0;
    updateNav();
  });
}, { passive: true });
window.addEventListener("resize", updateNav, { passive: true });
window.addEventListener("pageshow", resetViewer);
window.addEventListener("pagehide", resetViewer);

resetViewer();
updateNav();

const loadedSections=new Set();function loadNear(id,distance,task){const target=document.getElementById(id);if(!target||loadedSections.has(id))return;const run=async()=>{if(loadedSections.has(id))return;loadedSections.add(id);try{await task()}catch(error){console.error(id+" section failed to load",error)}};if(!("IntersectionObserver"in window)){run();return}const o=new IntersectionObserver(entries=>{if(!entries.some(e=>e.isIntersecting))return;o.disconnect();run()},{rootMargin:distance+"px 0px",threshold:0});o.observe(target)}loadNear("photo",600,()=>import("/photo-gallery.js?v=20260918-clean"));
