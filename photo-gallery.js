(() => {
  const photos = [
    {
      src: "https://d2ol7oe51mr4n9.cloudfront.net/user_3DAx441iE4cBNKdBbYvFbic9eQg/2e2ec536-eb8f-4666-a1d1-ce859d002750.jpg",
      alt: "Репортажный кадр сверху"
    },
    {
      src: "https://d2ol7oe51mr4n9.cloudfront.net/user_3DAx441iE4cBNKdBbYvFbic9eQg/8be6c358-9737-497d-b206-4bd7fc74d3bd.jpg",
      alt: "Репортажный кадр на открытом воздухе"
    },
    {
      src: "https://d2ol7oe51mr4n9.cloudfront.net/user_3DAx441iE4cBNKdBbYvFbic9eQg/d53b7bd6-43de-44b2-902c-c072ea815070.jpg",
      alt: "Портрет"
    },
    {
      src: "https://d2ol7oe51mr4n9.cloudfront.net/user_3DAx441iE4cBNKdBbYvFbic9eQg/d33a9924-d73b-49c0-9a46-760d1e789ac3.jpg",
      alt: "Динамичный репортажный кадр"
    },
    {
      src: "https://d2ol7oe51mr4n9.cloudfront.net/user_3DAx441iE4cBNKdBbYvFbic9eQg/3ba0cf23-af8d-4104-945c-ee86f063e971.jpg",
      alt: "Детали оформления"
    },
    {
      src: "https://d2ol7oe51mr4n9.cloudfront.net/user_3DAx441iE4cBNKdBbYvFbic9eQg/fe27b99d-7fb2-432d-99be-1cbfb150847d.jpg",
      alt: "Гости мероприятия"
    },
    {
      src: "https://d2ol7oe51mr4n9.cloudfront.net/user_3DAx441iE4cBNKdBbYvFbic9eQg/576a2689-0ce1-4069-a459-83ebd661fbe1.jpg",
      alt: "Репортажный кадр сверху"
    },
    {
      src: "https://d2ol7oe51mr4n9.cloudfront.net/user_3DAx441iE4cBNKdBbYvFbic9eQg/fb91add9-db96-429d-bfd5-a838e468eac1.jpg",
      alt: "Групповой репортажный портрет"
    },
    {
      src: "https://d2ol7oe51mr4n9.cloudfront.net/user_3DAx441iE4cBNKdBbYvFbic9eQg/0dedbb3b-52ab-47ec-a5fc-1d3e72634ad9.jpg",
      alt: "Гости за столом"
    },
    {
      src: "https://d2ol7oe51mr4n9.cloudfront.net/user_3DAx441iE4cBNKdBbYvFbic9eQg/eb3db2cc-ebbe-4ccc-a59f-c936db089bc1.jpg",
      alt: "Портрет гостей"
    }
  ];

  const section = document.getElementById("photo");
  if (!section) return;

  if (!document.querySelector('link[data-photo-styles]')) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "/photo.css?v=1";
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
        <span class="photo-hero-mark">РЕПОРТАЖ</span>
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
  if (!grid || !cards.length) return;

  const ROW = () => parseFloat(getComputedStyle(grid).getPropertyValue("--photo-row")) || 8;
  const GAP = () => parseFloat(getComputedStyle(grid).getPropertyValue("--photo-gap")) || 12;

  function sizeCard(card) {
    if (card.classList.contains("photo-hero")) return;
    const img = card.querySelector("img");
    if (!img?.naturalWidth || !card.clientWidth) return;
    const targetHeight = card.clientWidth * (img.naturalHeight / img.naturalWidth);
    const span = Math.ceil((targetHeight + GAP()) / (ROW() + GAP()));
    card.style.gridRowEnd = `span ${Math.max(1, span)}`;
  }

  function layout() {
    cards.forEach(sizeCard);
  }

  cards.forEach((card) => {
    const img = card.querySelector("img");
    if (!img) return;
    if (img.complete) sizeCard(card);
    else img.addEventListener("load", () => sizeCard(card), { once: true });
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 80);
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

  requestAnimationFrame(layout);
})();
