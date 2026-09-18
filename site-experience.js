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

              '<div class="site-home-page is-active" data-site-scene="home">',
                '<img class="site-long-page" src="/assets/site-case/denisovphoto-desktop.png?v=1" alt="Denisov Photo desktop website" decoding="async">',
              '</div>',

              '<div class="site-portfolio-page" data-site-scene="portfolio">',
                '<div class="site-portfolio-scroll">',
                  '<header class="site-real-nav">',
                    '<strong>DENISOV PHOTO</strong>',
                    '<span>ГЛАВНАЯ</span><span>ПАКЕТЫ</span><span>PHOTO &amp; FILM</span><span class="is-current">СВАДЕБНЫЕ ИСТОРИИ</span>',
                    '<button type="button" class="site-date-trigger">ПРОВЕРИТЬ ДАТУ</button>',
                  '</header>',

                  '<section class="site-portfolio-hero">',
                    '<div class="site-portfolio-hero-copy">',
                      '<small>СВАДЕБНЫЕ ИСТОРИИ</small>',
                      '<h3>Свадьбы<br>в кадре</h3>',
                      '<p>Атмосфера, эмоции и стиль — в реальных свадебных историях.</p>',
                    '</div>',
                    '<img src="https://res.cloudinary.com/dxqtfevzq/image/upload/q_auto/f_auto/v1780311378/23_ptrusy.png" alt="">',
                  '</section>',

                  '<section class="site-portfolio-grid-section">',
                    '<div class="site-portfolio-title"><small>ПОРТФОЛИО</small><h4>Портреты, детали и моменты</h4></div>',
                    '<div class="site-web-gallery">',
                      '<figure class="wide"><img src="https://res.cloudinary.com/dxqtfevzq/image/upload/q_auto/f_auto/v1780311386/29_u5qbma.png" alt=""></figure>',
                      '<figure><img src="https://res.cloudinary.com/dxqtfevzq/image/upload/q_auto/f_auto/v1780311340/4_%D1%82%D0%B5%D1%81%D1%82_xuw8jq.png" alt=""></figure>',
                      '<figure><img src="https://res.cloudinary.com/dxqtfevzq/image/upload/q_auto/f_auto/v1780311356/13_cq9rxf.png" alt=""></figure>',
                      '<figure class="wide"><img src="https://res.cloudinary.com/dxqtfevzq/image/upload/q_auto/f_auto/v1780311389/30_ct4kt7.png" alt=""></figure>',
                      '<figure><img src="https://res.cloudinary.com/dxqtfevzq/image/upload/q_auto/f_auto/v1780311348/9_gszahn.png" alt=""></figure>',
                      '<figure><img src="https://res.cloudinary.com/dxqtfevzq/image/upload/q_auto/f_auto/v1780311366/17_oig08y.png" alt=""></figure>',
                      '<figure class="wide"><img src="https://res.cloudinary.com/dxqtfevzq/image/upload/q_auto/f_auto/v1780311350/10_z9txch.png" alt=""></figure>',
                      '<figure class="wide"><img src="https://res.cloudinary.com/dxqtfevzq/image/upload/q_auto/f_auto/v1780311399/35_spasha.png" alt=""></figure>',
                    '</div>',
                  '</section>',

                  '<section class="site-portfolio-footer-cta">',
                    '<small>ПРОВЕРКА ДАТЫ</small>',
                    '<h4>Такая съёмка возможна и на вашей свадьбе</h4>',
                    '<p>Проверьте дату — я быстро отвечу, свободен ли день, и подскажу подходящий формат.</p>',
                    '<button type="button" class="site-date-trigger">ПРОВЕРИТЬ ДАТУ</button>',
                  '</section>',
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
  const homeScene = section.querySelector('[data-site-scene="home"]');
  const portfolioScene = section.querySelector('[data-site-scene="portfolio"]');
  const homePage = section.querySelector(".site-long-page");
  const portfolioScroll = section.querySelector(".site-portfolio-scroll");
  const cursor = section.querySelector(".site-cursor");
  const form = section.querySelector(".site-form-overlay");
  const formClose = section.querySelector(".site-form-close");
  const dateTriggers = [...section.querySelectorAll(".site-date-trigger")];
  const consent = section.querySelector(".site-consent");
  const submit = section.querySelector(".site-submit-demo");
  const formSuccess = section.querySelector(".site-form-success");

  const fields = {
    name: section.querySelector('[data-demo-field="name"]'),
    phone: section.querySelector('[data-demo-field="phone"]'),
    telegram: section.querySelector('[data-demo-field="telegram"]'),
    date: section.querySelector('[data-demo-field="date"]')
  };

  if (!browser || !stage || !canvas || !homeScene || !portfolioScene || !homePage || !portfolioScroll || !cursor || !form || !submit || !formSuccess) return;

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

  function homeTravel() {
    return Math.max(0, homePage.offsetHeight - BASE_H);
  }

  function portfolioTravel() {
    return Math.max(0, portfolioScroll.offsetHeight - BASE_H);
  }

  function moveHome(fraction, duration) {
    const y = -homeTravel() * Math.max(0, Math.min(1, fraction));
    homePage.style.transitionDuration = duration + "ms";
    homePage.style.transform = "translate3d(0," + y + "px,0)";
  }

  function movePortfolio(fraction, duration) {
    const y = -portfolioTravel() * Math.max(0, Math.min(1, fraction));
    portfolioScroll.style.transitionDuration = duration + "ms";
    portfolioScroll.style.transform = "translate3d(0," + y + "px,0)";
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

  function showScene(name) {
    const isHome = name === "home";
    homeScene.classList.toggle("is-active", isHome);
    portfolioScene.classList.toggle("is-active", !isHome);
  }

  async function typeField(input, value, token) {
    if (!input) return false;
    input.classList.add("is-active");
    input.value = "";

    for (let i = 0; i <= value.length; i += 1) {
      if (!visible || token !== run) return false;
      input.value = value.slice(0, i);
      await new Promise(r => setTimeout(r, 115));
    }

    input.classList.remove("is-active");
    if (!(await sleep(420, token))) return false;
    return true;
  }

  function reset() {
    showScene("home");

    homePage.style.transitionDuration = "0ms";
    homePage.style.transform = "translate3d(0,0,0)";

    portfolioScroll.style.transitionDuration = "0ms";
    portfolioScroll.style.transform = "translate3d(0,0,0)";

    form.classList.remove("is-open");
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

  async function openForm(token) {
    form.classList.add("is-open");
    if (!(await sleep(1500, token))) return false;

    moveCursor(805, 338);
    if (!(await sleep(850, token))) return false;
    if (!(await typeField(fields.name, "Анна", token))) return false;

    moveCursor(805, 445);
    if (!(await sleep(850, token))) return false;
    if (!(await typeField(fields.phone, "+7 999 123-45-67", token))) return false;

    moveCursor(805, 552);
    if (!(await sleep(850, token))) return false;
    if (!(await typeField(fields.telegram, "@anna", token))) return false;

    moveCursor(805, 659);
    if (!(await sleep(850, token))) return false;
    if (!(await typeField(fields.date, "12-09-2027", token))) return false;

    moveCursor(535, 742);
    if (!(await sleep(900, token))) return false;
    clickCursor();
    consent.classList.add("is-checked");

    if (!(await sleep(1100, token))) return false;

    moveCursor(760, 812);
    if (!(await sleep(900, token))) return false;
    clickCursor();
    submit.classList.add("is-pressed");
    formSuccess.classList.add("is-visible");

    if (!(await sleep(3600, token))) return false;
    return true;
  }

  async function sequence(token) {
    reset();
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

    if (!(await sleep(2200, token))) return;

    moveCursor(1080, 605);
    if (!(await sleep(1100, token))) return;
    moveHome(.16, 3600);

    if (!(await sleep(4500, token))) return;

    moveCursor(1030, 610);
    if (!(await sleep(1000, token))) return;
    moveHome(.58, 5200);

    if (!(await sleep(6100, token))) return;

    moveCursor(1040, 620);
    if (!(await sleep(1100, token))) return;
    clickCursor();

    if (!(await sleep(700, token))) return;
    showScene("portfolio");

    if (!(await sleep(2600, token))) return;

    moveCursor(1110, 620);
    if (!(await sleep(1000, token))) return;
    movePortfolio(.44, 4700);

    if (!(await sleep(5600, token))) return;

    moveCursor(1080, 610);
    if (!(await sleep(900, token))) return;
    movePortfolio(.82, 4200);

    if (!(await sleep(5000, token))) return;

    const finalTrigger = section.querySelector(".site-portfolio-footer-cta .site-date-trigger");
    if (finalTrigger) {
      const c = canvas.getBoundingClientRect();
      const r = finalTrigger.getBoundingClientRect();
      moveCursor(
        (r.left - c.left + r.width * .66) / scale,
        (r.top - c.top + r.height * .62) / scale
      );
    } else {
      moveCursor(980, 690);
    }

    if (!(await sleep(1300, token))) return;
    clickCursor();

    if (!(await sleep(650, token))) return;
    if (!(await openForm(token))) return;

    if (visible && token === run) sequence(token);
  }

  dateTriggers.forEach(button => button.addEventListener("click", () => {
    run += 1;
    form.classList.add("is-open");
  }));

  formClose.addEventListener("click", () => form.classList.remove("is-open"));
  consent.addEventListener("click", () => consent.classList.toggle("is-checked"));

  submit.addEventListener("click", () => {
    submit.classList.add("is-pressed");
    formSuccess.classList.add("is-visible");
  });

  const observer = new IntersectionObserver(entries => {
    visible = Boolean(entries[0]?.isIntersecting);
    run += 1;
    reset();

    if (visible && !reduced && homePage.complete) sequence(run);
  }, { threshold: .28 });

  observer.observe(browser);

  homePage.addEventListener("load", () => {
    if (visible && !reduced) {
      run += 1;
      sequence(run);
    }
  });
})();