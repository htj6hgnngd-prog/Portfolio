(() => {
  const photos = [
    { src: "/assets/photos/reportage-01.jpg", alt: "Репортажный кадр сверху", ratio: 1418 / 1056 },
    { src: "/assets/photos/reportage-02.jpg", alt: "Репортажный кадр на открытом воздухе", ratio: 1536 / 1024 },
    { src: "/assets/photos/reportage-03.jpg", alt: "Портрет", ratio: 1024 / 1536 },
    { src: "/assets/photos/reportage-04.jpg", alt: "Динамичный репортажный кадр", ratio: 1536 / 1024 },
    { src: "/assets/photos/reportage-05.jpg", alt: "Детали оформления", ratio: 1536 / 1024 },
    { src: "/assets/photos/reportage-06.jpg", alt: "Гости мероприятия", ratio: 1536 / 1024 },
    { src: "/assets/photos/reportage-07.jpg", alt: "Репортажный кадр сверху", ratio: 1024 / 1536 },
    { src: "/assets/photos/reportage-08.jpg", alt: "Групповой репортажный портрет", ratio: 1536 / 1024 },
    { src: "/assets/photos/reportage-09.jpg", alt: "Гости за столом", ratio: 1536 / 1024 },
    { src: "/assets/photos/reportage-10.jpg", alt: "Портрет гостей", ratio: 1536 / 1024 }
  ];

  const section = document.getElementById("photo");
  if (!section) return;

  if (!document.querySelector('link[data-photo-styles]')) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "/photo.css?v=3";
    stylesheet.dataset.photoStyles = "true";
    document.head.appendChild(stylesheet);
  }

  section.classList.remove("is-pending");
  section.classList.add("photo-section");
  section.innerHTML = `
    <div class="section-label">
      <div class="section-number">04</div>
      <h2>ФОТО</h2>
      <p>РЕПОРТАЖ / ПОРТРЕТ / АТМОСФЕРА</p>
      <span class="label-rule"></span>
    </div>
    <div class="section-content photo-content">
      <button class="photo-hero" type="button" data-photo-index="0" aria-label="Открыть фотографию 1 из 10">
        <img src="${photos[0].src}" alt="${photos[0].alt}" fetchpriority="high" decoding="async">
      </button>
      <div class="photo-grid" aria-label="Фотографии">
        ${photos.slice(1).map((photo, index) => `
          <button class="photo-card" type="button" data-photo-index="${index + 1}" aria-label="Открыть фотографию ${index + 2} из ${photos.length}">
            <img src="${photo.src}" alt="${photo.alt}" loading="lazy" decoding="async">
          </button>`).join("")}
      </div>
    </div>
  `;

  const grid = section.querySelector(".photo-grid");
  const cards = Array.from(section.querySelectorAll("[data-photo-index]"));
  const cardsByIndex = new Map(cards.map((card) => [Number(card.dataset.photoIndex), card]));
  if (!grid || !cards.length) return;

  function rowPattern() {
    return window.innerWidth <= 720
      ? [[1, 2], [3, 4], [5, 6], [7, 8], [9]]
      : [[1, 2], [3, 4], [5, 6, 7], [8, 9]];
  }

  function layoutGallery() {
    const width = grid.clientWidth;
    if (!width) return;

    const style = getComputedStyle(grid);
    const gap = parseFloat(style.getPropertyValue("--photo-gap")) || (window.innerWidth <= 900 ? 7 : 12);
    const fragment = document.createDocumentFragment();

    rowPattern().forEach((indexes) => {
      const row = document.createElement("div");
      row.className = "photo-row";

      const usableWidth = width - gap * (indexes.length - 1);
      const ratioSum = indexes.reduce((sum, index) => sum + photos[index].ratio, 0);
      const rowHeight = usableWidth / ratioSum;
      row.style.height = `${rowHeight}px`;

      let consumed = 0;
      indexes.forEach((index, position) => {
        const card = cardsByIndex.get(index);
        if (!card) return;

        let cardWidth;
        if (position === indexes.length - 1) {
          cardWidth = usableWidth - consumed;
        } else {
          cardWidth = rowHeight * photos[index].ratio;
          consumed += cardWidth;
        }

        card.style.width = `${cardWidth}px`;
        card.style.height = `${rowHeight}px`;
        row.appendChild(card);
      });

      fragment.appendChild(row);
    });

    grid.replaceChildren(fragment);
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layoutGallery, 90);
  });

  const viewer = document.createElement("div");
  viewer.className = "photo-viewer";
  viewer.id = "photo-viewer";
  viewer.hidden = true;
  viewer.setAttribute("role", "dialog");
  viewer.setAttribute("aria-modal", "true");
  viewer.setAttribute("aria-label", "Просмотр фотографий");
  viewer.innerHTML = `
    <div class="photo-viewer-top">
      <div class="photo-viewer-title"><strong>ФОТО</strong><span>РЕПОРТАЖ / ПОРТРЕТ / АТМОСФЕРА</span></div>
      <button class="photo-viewer-close" type="button" aria-label="Закрыть">×</button>
    </div>
    <div class="photo-viewer-stage">
      <button class="photo-viewer-arrow photo-viewer-arrow--prev" type="button" aria-label="Предыдущее фото">‹</button>
      <img class="photo-viewer-image" alt="">
      <button class="photo-viewer-arrow photo-viewer-arrow--next" type="button" aria-label="Следующее фото">›</button>
    </div>
    <div class="photo-viewer-bottom"><span class="photo-viewer-count"></span></div>
  `;
  document.body.appendChild(viewer);

  const stage = viewer.querySelector(".photo-viewer-stage");
  const image = viewer.querySelector(".photo-viewer-image");
  const count = viewer.querySelector(".photo-viewer-count");
  const close = viewer.querySelector(".photo-viewer-close");
  const prev = viewer.querySelector(".photo-viewer-arrow--prev");
  const next = viewer.querySelector(".photo-viewer-arrow--next");

  let active = 0;
  let savedScrollY = 0;
  let touchStartX = 0;
  let touchStartY = 0;

  function render(index) {
    active = (index + photos.length) % photos.length;
    image.src = photos[active].src;
    image.alt = photos[active].alt;
    count.textContent = `${String(active + 1).padStart(2, "0")} / ${String(photos.length).padStart(2, "0")}`;

    const preloadPrev = new Image();
    preloadPrev.src = photos[(active - 1 + photos.length) % photos.length].src;
    const preloadNext = new Image();
    preloadNext.src = photos[(active + 1) % photos.length].src;
  }

  function lockPage() {
    savedScrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  }

  function unlockPage() {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    window.scrollTo(0, savedScrollY);
  }

  function open(index) {
    render(index);
    lockPage();
    viewer.hidden = false;
    requestAnimationFrame(() => close.focus({ preventScroll: true }));
  }

  function shut() {
    if (viewer.hidden) return;
    viewer.hidden = true;
    image.removeAttribute("src");
    unlockPage();
  }

  cards.forEach((card) => {
    card.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      open(Number(card.dataset.photoIndex || 0));
    });
  });

  close.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    shut();
  });

  prev.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    render(active - 1);
  });

  next.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    render(active + 1);
  });

  viewer.addEventListener("click", (event) => {
    if (event.target === viewer || event.target === stage) {
      event.preventDefault();
      event.stopPropagation();
      shut();
    }
  });

  stage.addEventListener("touchstart", (event) => {
    const touch = event.changedTouches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  }, { passive: true });

  stage.addEventListener("touchend", (event) => {
    const touch = event.changedTouches[0];
    const dx = touch.clientX - touchStartX;
    const dy = touch.clientY - touchStartY;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.15) {
      render(active + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });

  document.addEventListener("keydown", (event) => {
    if (viewer.hidden) return;
    if (event.key === "Escape") shut();
    if (event.key === "ArrowLeft") render(active - 1);
    if (event.key === "ArrowRight") render(active + 1);
  });

  requestAnimationFrame(layoutGallery);
})();
