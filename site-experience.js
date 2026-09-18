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
              '<div class="site-portfolio-overlay">',
                '<div class="site-portfolio-head"><strong>Свадебные истории</strong><button type="button" class="site-gallery-close">×</button></div>',
                '<div class="site-gallery">',
                  '<figure><img src="https://static.tildacdn.com/tild3137-6338-4162-b735-363931303032/30.jpg" alt="" loading="lazy"><span>01</span></figure>',
                  '<figure><img src="https://static.tildacdn.com/tild3964-6332-4262-b330-643766626433/20.jpg" alt="" loading="lazy"><span>02</span></figure>',
                  '<figure><img src="https://res.cloudinary.com/dxqtfevzq/image/upload/q_auto/f_auto/v1780311356/13_cq9rxf.png" alt="" loading="lazy"><span>03</span></figure>',
                  '<figure><img src="https://static.tildacdn.com/tild3031-6266-4234-a435-633534616639/11.jpg" alt="" loading="lazy"><span>04</span></figure>',
                '</div>',
              '</div>',
              '<div class="site-form-overlay">',
                '<div class="site-form-card">',
                  '<button type="button" class="site-form-close">×</button>',
                  '<small>СВОБОДНЫЕ ДАТЫ</small>',
                  '<h3>Проверить дату</h3>',
                  '<p>Оставьте дату свадьбы — я быстро отвечу, свободен ли день, и подскажу подходящий формат съёмки.</p>',
                  '<label><span>Ваше Имя</span><input data-demo-field="name" readonly></label>',
                  '<label><span>Телефон</span><input data-demo-field="phone" readonly></label>',
                  '<label><span>Telegram</span><input data-demo-field="telegram" readonly></label>',
                  '<label><span>Дата свадьбы</span><input data-demo-field="date" readonly></label>',
                  '<label class="site-consent"><i></i><span>Согласие на обработку персональных данных</span></label>',
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
  const gallery = section.querySelector(".site-portfolio-overlay");
  const galleryClose = section.querySelector(".site-gallery-close");
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
  if (!browser || !stage || !canvas || !page || !cursor || !gallery || !form || !submit || !formSuccess) return;

  let scale = 1;
  let visible = false;
  let run = 0;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    scale = (stage.clientWidth || 1) / BASE_W;
    canvas.style.transform = "scale(" + scale + ")";
    stage.style.height = (BASE_H * scale) + "px";
  }
  new ResizeObserver(resize).observe(stage);
  resize();

  function maxTravel() {
    return Math.max(0, page.offsetHeight - BASE_H);
  }

  function scrollPage(fraction, duration) {
    const y = -maxTravel() * Math.max(0, Math.min(1, fraction));
    page.style.transitionDuration = (duration || 1800) + "ms";
    page.style.transform = "translate3d(0," + y + "px,0)";
  }

  function sleep(ms, token) {
    return new Promise(resolve => setTimeout(() => resolve(token === run && visible), ms));
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

  async function typeField(input, value, token) {
    input.classList.add("is-active");
    input.value = "";
    for (let i = 0; i <= value.length; i += 1) {
      if (!visible || token !== run) return false;
      input.value = value.slice(0, i);
      await new Promise(r => setTimeout(r, 42));
    }
    input.classList.remove("is-active");
    return true;
  }

  function reset() {
    page.style.transitionDuration = "0ms";
    page.style.transform = "translate3d(0,0,0)";
    gallery.classList.remove("is-open");
    form.classList.remove("is-open");
    consent.classList.remove("is-checked");
    submit.classList.remove("is-pressed");
    formSuccess.classList.remove("is-visible");
    Object.values(fields).forEach(input => { if (input) input.value = ""; });
    cursor.classList.remove("is-visible");
  }

  async function sequence(token) {
    reset();
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    if (!(await sleep(1200, token))) return;

    moveCursor(1110, 590);
    scrollPage(.18, 1800);
    if (!(await sleep(2200, token))) return;

    moveCursor(1090, 600);
    scrollPage(.72, 2500);
    if (!(await sleep(3000, token))) return;

    moveCursor(1000, 590);
    if (!(await sleep(550, token))) return;
    clickCursor();
    gallery.classList.add("is-open");
    if (!(await sleep(2200, token))) return;

    moveCursor(1350, 70);
    if (!(await sleep(450, token))) return;
    clickCursor();
    gallery.classList.remove("is-open");
    if (!(await sleep(450, token))) return;

    scrollPage(1, 2200);
    moveCursor(1060, 620);
    if (!(await sleep(2600, token))) return;

    clickCursor();
    form.classList.add("is-open");
    if (!(await sleep(750, token))) return;

    moveCursor(770, 350);
    if (!(await typeField(fields.name, "Анна", token))) return;
    moveCursor(770, 455);
    if (!(await typeField(fields.phone, "+7 999 123-45-67", token))) return;
    moveCursor(770, 558);
    if (!(await typeField(fields.telegram, "@anna", token))) return;
    moveCursor(770, 662);
    if (!(await typeField(fields.date, "12-09-2027", token))) return;

    moveCursor(533, 739);
    if (!(await sleep(350, token))) return;
    clickCursor();
    consent.classList.add("is-checked");
    if (!(await sleep(400, token))) return;

    moveCursor(760, 810);
    if (!(await sleep(450, token))) return;
    clickCursor();
    submit.classList.add("is-pressed");
    formSuccess.classList.add("is-visible");
    if (!(await sleep(2400, token))) return;

    if (visible && token === run) sequence(token);
  }

  galleryClose.addEventListener("click", () => gallery.classList.remove("is-open"));
  formClose.addEventListener("click", () => form.classList.remove("is-open"));
  consent.addEventListener("click", () => consent.classList.toggle("is-checked"));
  submit.addEventListener("click", () => {
    submit.classList.add("is-pressed");
    formSuccess.classList.add("is-visible");
  });

  page.addEventListener("load", () => {
    if (visible && !reduced) {
      run += 1;
      sequence(run);
    }
  });

  const observer = new IntersectionObserver(entries => {
    visible = Boolean(entries[0]?.isIntersecting);
    run += 1;
    reset();
    if (visible && !reduced && page.complete) sequence(run);
  }, { threshold: .35 });

  observer.observe(browser);
})();