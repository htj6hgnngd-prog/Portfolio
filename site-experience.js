(() => {
  const section = document.getElementById("site");
  if (!section) return;

  section.classList.remove("is-pending");
  section.classList.add("site-showcase");

  const images = {
    home: "https://static.tildacdn.com/tild6366-3163-4233-b331-396366363230/5.jpg",
    services: "https://static.tildacdn.com/tild3833-3562-4631-b462-653461646338/21.jpg",
    film: "https://static.tildacdn.com/tild3337-6163-4830-b661-303063623838/19.jpg",
    stories: "https://res.cloudinary.com/dxqtfevzq/image/upload/q_auto/f_auto/v1780311378/23_ptrusy.png"
  };

  section.innerHTML = `
    <div class="section-label">
      <div class="section-number">06</div>
      <h2>ВЕБ-РАЗРАБОТКА</h2>
      <p>DENISOV PHOTO</p>
      <span class="label-rule"></span>
    </div>

    <div class="section-content site-showcase-content">
      <div class="site-demo" aria-label="Демонстрация сайта Denisov Photo">
        <div class="site-demo-bar">
          <span class="site-demo-dots"><i></i><i></i><i></i></span>
          <span class="site-demo-address">denisovphoto.ru</span>
          <a href="https://denisovphoto.ru/" target="_blank" rel="noreferrer">↗</a>
        </div>

        <div class="site-demo-screen">
          <div class="site-page is-active" data-site-page="home" style="--site-image:url('${images.home}')">
            <div class="site-page-nav"><strong>DENISOV PHOTO</strong><span>ГЛАВНАЯ</span><span>ПАКЕТЫ</span><span>PHOTO & FILM</span><span>ИСТОРИИ</span><b>ПРОВЕРИТЬ ДАТУ</b></div>
            <div class="site-home-copy"><small>DENISOV PHOTO · МОСКВА</small><h3>Свадебная фото<br>и видео съёмка</h3><p>Церемония, прогулка или полный свадебный день</p><button type="button">ПРОВЕРИТЬ ДАТУ</button></div>
          </div>

          <div class="site-page" data-site-page="services" style="--site-image:url('${images.services}')">
            <div class="site-page-nav site-page-nav--light"><strong>DENISOV PHOTO</strong><span>ГЛАВНАЯ</span><span class="is-current">ПАКЕТЫ</span><span>PHOTO & FILM</span><span>ИСТОРИИ</span><b>ПРОВЕРИТЬ ДАТУ</b></div>
            <div class="site-services-copy"><small>ПАКЕТЫ И СТОИМОСТЬ</small><h3>Выберите формат свадебного дня</h3><div class="site-package-grid"><article><span>до 3 часов</span><strong>35 000 ₽</strong></article><article><span>до 6 часов</span><strong>55 000 ₽</strong></article><article><span>до 10 часов</span><strong>80 000 ₽</strong></article><article><span>Photo & Film</span><strong>от 150 000 ₽</strong></article></div></div>
          </div>

          <div class="site-page" data-site-page="film" style="--site-image:url('${images.film}')">
            <div class="site-page-nav"><strong>DENISOV PHOTO</strong><span>ГЛАВНАЯ</span><span>ПАКЕТЫ</span><span class="is-current">PHOTO & FILM</span><span>ИСТОРИИ</span><b>ПРОВЕРИТЬ ДАТУ</b></div>
            <div class="site-film-copy"><small>ПРЕМИУМ</small><h3>Photo & Film</h3><p>Фото, фильм и teaser одной командой</p><div><span>Фото</span><span>Фильм</span><span>Teaser</span></div></div>
          </div>

          <div class="site-page" data-site-page="stories" style="--site-image:url('${images.stories}')">
            <div class="site-page-nav site-page-nav--light"><strong>DENISOV PHOTO</strong><span>ГЛАВНАЯ</span><span>ПАКЕТЫ</span><span>PHOTO & FILM</span><span class="is-current">ИСТОРИИ</span><b>ПРОВЕРИТЬ ДАТУ</b></div>
            <div class="site-stories-copy"><small>ПОРТФОЛИО</small><h3>Свадебные истории</h3><p>Атмосфера, эмоции, детали и ощущение дня.</p><button type="button">СМОТРЕТЬ КАДРЫ</button></div>
          </div>

          <div class="site-date-modal" aria-hidden="true">
            <div class="site-date-card">
              <button type="button" class="site-date-close" aria-label="Закрыть">×</button>
              <small>СВОБОДНЫЕ ДАТЫ</small>
              <h3>Проверить дату</h3>
              <p>Оставьте дату свадьбы — ответ придёт быстро.</p>
              <div class="site-form-row"><span>Имя</span><span>Телефон</span></div>
              <div class="site-form-row"><span>Telegram</span><span>Дата свадьбы</span></div>
              <button type="button" class="site-form-submit">ПРОВЕРИТЬ ДАТУ</button>
            </div>
          </div>

          <span class="site-demo-cursor" aria-hidden="true"></span>
        </div>

        <div class="site-demo-switcher" aria-label="Страницы сайта">
          <button type="button" data-site-target="home" class="is-active">Главная</button>
          <button type="button" data-site-target="services">Пакеты</button>
          <button type="button" data-site-target="film">Photo & Film</button>
          <button type="button" data-site-target="stories">Истории</button>
          <button type="button" data-site-target="date">Проверить дату</button>
        </div>
      </div>
    </div>`;

  const pages = [...section.querySelectorAll("[data-site-page]")];
  const switches = [...section.querySelectorAll("[data-site-target]")];
  const screen = section.querySelector(".site-demo-screen");
  const demo = section.querySelector(".site-demo");
  const cursor = section.querySelector(".site-demo-cursor");
  const modal = section.querySelector(".site-date-modal");
  const close = section.querySelector(".site-date-close");
  if (!screen || !demo || !cursor || !modal || !close) return;

  const order = ["home", "services", "film", "stories", "date"];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let index = 0;
  let timer = 0;
  let visible = false;
  let manualHoldUntil = 0;

  function show(name, manual = false) {
    const nextIndex = order.indexOf(name);
    if (nextIndex < 0) return;
    index = nextIndex;
    const pageName = name === "date" ? "stories" : name;
    pages.forEach((page) => page.classList.toggle("is-active", page.dataset.sitePage === pageName));
    modal.classList.toggle("is-open", name === "date");
    modal.setAttribute("aria-hidden", name === "date" ? "false" : "true");
    switches.forEach((button) => button.classList.toggle("is-active", button.dataset.siteTarget === name));
    if (manual) manualHoldUntil = performance.now() + 7000;
  }

  function cursorTo(target) {
    if (!target || reduceMotion) return;
    const a = screen.getBoundingClientRect();
    const b = target.getBoundingClientRect();
    const x = b.left - a.left + b.width * .7;
    const y = b.top - a.top + b.height * .6;
    cursor.style.transform = `translate3d(${x}px,${y}px,0)`;
    cursor.classList.add("is-visible");
  }

  function clickCursor() {
    cursor.classList.remove("is-clicking");
    void cursor.offsetWidth;
    cursor.classList.add("is-clicking");
  }

  function schedule(delay = 3000) {
    clearTimeout(timer);
    if (!visible || reduceMotion) return;
    timer = window.setTimeout(playNext, delay);
  }

  function playNext() {
    if (!visible || reduceMotion) return;
    if (performance.now() < manualHoldUntil) return schedule(1500);
    const next = order[(index + 1) % order.length];
    const target = switches.find((button) => button.dataset.siteTarget === next);
    cursorTo(target);
    timer = window.setTimeout(() => {
      clickCursor();
      timer = window.setTimeout(() => {
        show(next);
        schedule(next === "date" ? 3100 : 2800);
      }, 320);
    }, 620);
  }

  switches.forEach((button) => button.addEventListener("click", () => {
    show(button.dataset.siteTarget, true);
    schedule(7000);
  }));

  close.addEventListener("click", () => {
    show("stories", true);
    schedule(7000);
  });

  const observer = new IntersectionObserver((entries) => {
    visible = Boolean(entries[0]?.isIntersecting);
    clearTimeout(timer);
    if (visible) schedule(1900);
    else cursor.classList.remove("is-visible");
  }, { threshold: .25 });
  observer.observe(demo);
})();