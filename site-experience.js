(() => {
  const section = document.getElementById("site");
  if (!section) return;

  section.classList.remove("is-pending", "site-showcase");
  section.classList.add("site-client-demo");

  section.innerHTML = [
    '<div class="section-label">',
      '<div class="section-number">06</div>',
      '<h2>ВЕБ-РАЗРАБОТКА</h2>',
      '<p>DENISOV PHOTO</p>',
      '<span class="label-rule"></span>',
    '</div>',

    '<div class="section-content site-client-content">',
      '<div class="site-browser">',
        '<div class="site-browser-bar">',
          '<span class="site-browser-dots"><i></i><i></i><i></i></span>',
          '<span class="site-browser-address">denisovphoto.ru</span>',
          '<a href="https://denisovphoto.ru/" target="_blank" rel="noreferrer">↗</a>',
        '</div>',

        '<div class="site-stage">',
          '<div class="site-canvas">',
            '<div class="site-live-viewport">',
              '<img class="site-long-page" src="/assets/site-case/denisovphoto-desktop.png?v=1" alt="Denisov Photo desktop website" decoding="async">',

              '<div class="site-photo-viewer" aria-hidden="true">',
                '<button type="button" class="site-photo-close">×</button>',
                '<img src="https://static.tildacdn.com/tild6366-3163-4233-b331-396366363230/5.jpg" alt="Свадебный кадр Denisov Photo">',
                '<div class="site-photo-meta"><span>СВАДЕБНАЯ ИСТОРИЯ</span><strong>DENISOV PHOTO</strong></div>',
              '</div>',

              '<div class="site-form-overlay" aria-hidden="true">',
                '<div class="site-form-card">',
                  '<button type="button" class="site-form-close">×</button>',
                  '<small>СВОБОДНЫЕ ДАТЫ</small>',
                  '<h3>Проверить дату</h3>',
                  '<p>Оставьте дату свадьбы — я быстро отвечу, свободен ли день, и подскажу подходящий формат съёмки.</p>',
                  '<label><span>Ваше Имя</span><input data-demo-field="name" readonly></label>',
                  '<label><span>Телефон</span><input data-demo-field="phone" readonly></label>',
                  '<label><span>Telegram</span><input data-demo-field="telegram" readonly></label>',
                  '<label><span>Дата свадьбы</span><input data-demo-field="date" readonly></label>',
                  '<label class="site-consent"><i></i><span>Я даю согласие на обработку персональных данных</span></label>',
                  '<button type="button" class="site-submit-demo">ПРОВЕРИТЬ ДАТУ</button>',
                  '<div class="site-form-success"><i>✓</i><div><strong>Заявка отправлена</strong><span>Спасибо. Дата отправлена на проверку.</span></div></div>',
                '</div>',
              '</div>',

              '<span class="site-cursor" aria-hidden="true"></span>',
            '</div>',
          '</div>',
        '</div>',
      '</div>',
    '</div>'
  ].join("");

  const BASE_W = 1440;
  const BASE_H = 900;

  const browser = section.querySelector(".site-browser");
  const stage = section.querySelector(".site-stage");
  const canvas = section.querySelector(".site-canvas");
  const page = section.querySelector(".site-long-page");
  const cursor = section.querySelector(".site-cursor");
  const viewer = section.querySelector(".site-photo-viewer");
  const viewerClose = section.querySelector(".site-photo-close");
  const form = section.querySelector(".site-form-overlay");
  const formClose = section.querySelector(".site-form-close");
  const consent = section.querySelector(".site-consent");
  const submit = section.querySelector(".site-submit-demo");
  const formSuccess = section.querySelector(".site-form-success");

  const fields = {
    name: section.querySelector('[data-demo-field="name"]'),
    phone: section.querySelector('[data-demo-field="phone"]'),
    telegram: section.querySelector('[data-demo-field="telegram"]'),
    date: section.querySelector('[data-demo-field="date"]')
  };

  if (!browser || !stage || !canvas || !page || !cursor || !viewer || !form || !submit || !formSuccess) return;

  let scale = 1;
  let visible = false;
  let run = 0;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    scale = (stage.clientWidth || 1) / BASE_W;
    canvas.style.transform = "scale(" + scale + ")";
    canvas.style.left = "0px";
    stage.style.height = (BASE_H * scale) + "px";
  }

  new ResizeObserver(resize).observe(stage);
  resize();

  function sleep(ms, token) {
    return new Promise(resolve => setTimeout(() => resolve(token === run && visible), ms));
  }

  function maxTravel() {
    return Math.max(0, page.offsetHeight - BASE_H);
  }

  function scrollToFraction(fraction, duration) {
    const y = -maxTravel() * Math.max(0, Math.min(1, fraction));
    page.style.transitionDuration = duration + "ms";
    page.style.transform = "translate3d(0," + y + "px,0)";
  }

  function moveCursor(x, y) {
    if (reduced) return;
    cursor.style.transform = "translate3d(" + x + "px," + y + "px,0)";
    cursor.classList.add("is-visible");
  }

  function clickCursor() {
    cursor.classList.remove("is-clicking");
    void cursor.offsetWidth;
    cursor.classList.add("is-clicking");
  }

  function openViewer() {
    viewer.classList.add("is-open");
    viewer.setAttribute("aria-hidden", "false");
  }

  function closeViewer() {
    viewer.classList.remove("is-open");
    viewer.setAttribute("aria-hidden", "true");
  }

  function openForm() {
    form.classList.add("is-open");
    form.setAttribute("aria-hidden", "false");
  }

  function closeForm() {
    form.classList.remove("is-open");
    form.setAttribute("aria-hidden", "true");
  }

  async function typeField(input, value, token) {
    if (!input) return false;

    input.classList.add("is-active");
    input.value = "";

    for (let i = 0; i <= value.length; i += 1) {
      if (!visible || token !== run) return false;
      input.value = value.slice(0, i);
      await new Promise(resolve => setTimeout(resolve, 125));
    }

    input.classList.remove("is-active");
    return sleep(650, token);
  }

  function reset() {
    page.style.transitionDuration = "0ms";
    page.style.transform = "translate3d(0,0,0)";

    closeViewer();
    closeForm();

    consent.classList.remove("is-checked");
    submit.classList.remove("is-pressed");
    formSuccess.classList.remove("is-visible");

    Object.values(fields).forEach(input => {
      if (input) {
        input.value = "";
        input.classList.remove("is-active");
      }
    });

    cursor.classList.remove("is-visible");
  }

  async function fillForm(token) {
    if (!(await sleep(1500, token))) return false;

    moveCursor(800, 350);
    if (!(await sleep(1000, token))) return false;
    if (!(await typeField(fields.name, "Анна", token))) return false;

    moveCursor(800, 455);
    if (!(await sleep(1000, token))) return false;
    if (!(await typeField(fields.phone, "+7 999 123-45-67", token))) return false;

    moveCursor(800, 560);
    if (!(await sleep(1000, token))) return false;
    if (!(await typeField(fields.telegram, "@anna", token))) return false;

    moveCursor(800, 665);
    if (!(await sleep(1000, token))) return false;
    if (!(await typeField(fields.date, "12-09-2027", token))) return false;

    moveCursor(530, 742);
    if (!(await sleep(1100, token))) return false;
    clickCursor();
    consent.classList.add("is-checked");

    if (!(await sleep(1300, token))) return false;

    moveCursor(760, 812);
    if (!(await sleep(1100, token))) return false;
    clickCursor();
    submit.classList.add("is-pressed");
    formSuccess.classList.add("is-visible");

    return sleep(4200, token);
  }

  async function sequence(token) {
    reset();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

    if (!(await sleep(2400, token))) return;

    moveCursor(1090, 610);
    if (!(await sleep(1200, token))) return;

    // Пакеты / преимущества
    scrollToFraction(.20, 4800);
    if (!(await sleep(5900, token))) return;

    moveCursor(1040, 605);
    if (!(await sleep(1100, token))) return;

    // Editorial mood / Смотреть кадры
    scrollToFraction(.47, 5600);
    if (!(await sleep(6700, token))) return;

    // Клик по реальному CTA "Смотреть кадры"
    moveCursor(360, 690);
    if (!(await sleep(1300, token))) return;
    clickCursor();
    openViewer();

    if (!(await sleep(3600, token))) return;

    moveCursor(1364, 58);
    if (!(await sleep(1200, token))) return;
    clickCursor();
    closeViewer();

    if (!(await sleep(1100, token))) return;

    // Реальный блок "Свадебные истории"
    scrollToFraction(.78, 6200);
    if (!(await sleep(7400, token))) return;

    moveCursor(980, 590);
    if (!(await sleep(1300, token))) return;

    // Небольшой дополнительный проход по реальному портфолио
    scrollToFraction(.88, 4200);
    if (!(await sleep(5200, token))) return;

    // Реальный финальный CTA проверки даты
    scrollToFraction(1, 4500);
    if (!(await sleep(5600, token))) return;

    moveCursor(1010, 675);
    if (!(await sleep(1400, token))) return;
    clickCursor();
    openForm();

    if (!(await fillForm(token))) return;

    if (visible && token === run) sequence(token);
  }

  viewerClose.addEventListener("click", closeViewer);
  formClose.addEventListener("click", closeForm);

  consent.addEventListener("click", () => {
    consent.classList.toggle("is-checked");
  });

  submit.addEventListener("click", () => {
    submit.classList.add("is-pressed");
    formSuccess.classList.add("is-visible");
  });

  const observer = new IntersectionObserver(entries => {
    visible = Boolean(entries[0]?.isIntersecting);
    run += 1;
    reset();

    if (visible && !reduced && page.complete) {
      sequence(run);
    }
  }, { threshold: .28 });

  observer.observe(browser);

  page.addEventListener("load", () => {
    if (visible && !reduced) {
      run += 1;
      sequence(run);
    }
  });
})();