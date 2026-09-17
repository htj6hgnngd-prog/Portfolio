(() => {
  const section = document.getElementById("site");
  if (!section) return;

  section.classList.remove("is-pending");
  section.classList.add("site-case-section");
  section.innerHTML = `
    <div class="section-label">
      <div class="section-number">06</div>
      <h2>САЙТ</h2>
      <p>WEB / UX / BUILD</p>
      <span class="label-rule"></span>
    </div>

    <div class="section-content site-case-content">
      <div class="site-case-head">
        <h3 class="site-case-title">DENISOV PHOTO</h3>
        <p class="site-case-kicker">COMMERCIAL WEB CASE</p>
      </div>

      <div class="site-case-layout">
        <div class="site-browser" aria-label="Автоматическая демонстрация сайта Denisov Photo">
          <div class="site-browser-bar" aria-hidden="true">
            <span class="site-browser-dots"><i></i><i></i><i></i></span>
            <span class="site-browser-address">denisovphoto.ru</span>
            <span></span>
          </div>

          <div class="site-case-screen" tabindex="-1">
            <div class="site-demo-page">
              <div class="site-demo-nav">
                <span>DENISOV PHOTO · МОСКВА</span>
                <span>ПРОВЕРИТЬ ДАТУ</span>
              </div>

              <section class="site-demo-hero" data-demo-stage="0">
                <div class="site-demo-hero-copy">
                  <span class="site-demo-eyebrow">DENISOV PHOTO · МОСКВА</span>
                  <h3>Свадебная фото и видео съёмка в Москве</h3>
                  <p>Церемония, прогулка или полный свадебный день. Фото или Photo & Film.</p>
                  <span class="site-demo-cta">ПРОВЕРИТЬ ДАТУ</span>
                </div>
                <div class="site-demo-hero-media"><img src="/assets/site-case/hero.jpg" alt="" loading="eager" decoding="async"></div>
              </section>

              <section class="site-demo-section site-demo-packages" data-demo-stage="1">
                <div class="site-demo-section-head"><h4>Пакеты и стоимость</h4><span>01 / STRUCTURE</span></div>
                <div class="site-demo-package-grid">
                  <article class="site-demo-package"><b>КАМЕРНЫЙ ФОРМАТ</b><strong>до 3 часов</strong><em>35 000 ₽</em></article>
                  <article class="site-demo-package"><b>ПОПУЛЯРНЫЙ ВЫБОР</b><strong>до 6 часов</strong><em>55 000 ₽</em></article>
                  <article class="site-demo-package"><b>ПОЛНАЯ ИСТОРИЯ</b><strong>до 10 часов</strong><em>80 000 ₽</em></article>
                  <article class="site-demo-package"><b>ПРЕМИУМ</b><strong>Photo & Film</strong><em>от 150 000 ₽</em></article>
                </div>
              </section>

              <section class="site-demo-editorial" data-demo-stage="2">
                <div class="site-demo-editorial-media"><img src="/assets/site-case/editorial.jpg" alt="" loading="lazy" decoding="async"></div>
                <div class="site-demo-editorial-copy">
                  <span class="site-demo-eyebrow">EDITORIAL MOOD</span>
                  <h4>Та самая свадьба из Pinterest. Только ваша.</h4>
                  <p>Живые кадры, деликатная режиссура и цельная эстетика без перегруза постановкой.</p>
                </div>
              </section>

              <section class="site-demo-section site-demo-process">
                <div class="site-demo-section-head"><h4>Как проходит работа</h4><span>02 / UX</span></div>
                <div class="site-demo-steps">
                  <div class="site-demo-step"><span>01</span><b>Проверяем дату</b></div>
                  <div class="site-demo-step"><span>02</span><b>Подбираем пакет</b></div>
                  <div class="site-demo-step"><span>03</span><b>Уточняем детали</b></div>
                  <div class="site-demo-step"><span>04</span><b>Фиксируем бронь</b></div>
                </div>
              </section>

              <section class="site-demo-film" data-demo-stage="3">
                <div class="site-demo-film-copy">
                  <span class="site-demo-eyebrow">ПРЕМИУМ</span>
                  <h4>Photo & Film</h4>
                  <p>Фото, фильм и teaser одной командой — в едином визуальном стиле свадебного дня.</p>
                  <span class="site-demo-cta">СМОТРЕТЬ ФОРМАТ</span>
                </div>
                <div class="site-demo-film-media"><img src="/assets/site-case/action.jpg" alt="" loading="lazy" decoding="async"></div>
              </section>

              <section class="site-demo-section site-demo-portfolio">
                <div class="site-demo-section-head"><h4>Свадебные истории</h4><span>03 / VISUAL SYSTEM</span></div>
                <div class="site-demo-gallery">
                  <figure><img src="/assets/site-case/portrait.jpg" alt="" loading="lazy" decoding="async"></figure>
                  <figure><img src="/assets/site-case/reportage.jpg" alt="" loading="lazy" decoding="async"></figure>
                  <figure><img src="/assets/site-case/detail.jpg" alt="" loading="lazy" decoding="async"></figure>
                  <figure><img src="/assets/site-case/editorial.jpg" alt="" loading="lazy" decoding="async"></figure>
                  <figure><img src="/assets/site-case/action.jpg" alt="" loading="lazy" decoding="async"></figure>
                  <figure><img src="/assets/site-case/hero.jpg" alt="" loading="lazy" decoding="async"></figure>
                </div>
              </section>

              <section class="site-demo-final" data-demo-stage="4">
                <small>СВОБОДНЫЕ ДАТЫ</small>
                <h4>Дата свадьбы уже выбрана?</h4>
                <span>ПРОВЕРИТЬ ДАТУ</span>
              </section>
            </div>
          </div>
        </div>

        <aside class="site-case-rail" aria-label="Этапы демонстрации">
          <div class="site-stage-list">
            <button class="site-stage is-active" type="button" data-site-step="0"><b>01</b><span>HERO</span></button>
            <button class="site-stage" type="button" data-site-step="1"><b>02</b><span>PACKAGES</span></button>
            <button class="site-stage" type="button" data-site-step="2"><b>03</b><span>EDITORIAL</span></button>
            <button class="site-stage" type="button" data-site-step="3"><b>04</b><span>PHOTO & FILM</span></button>
            <button class="site-stage" type="button" data-site-step="4"><b>05</b><span>CTA</span></button>
          </div>
          <div class="site-case-phone" aria-hidden="true"><div class="site-case-phone-screen"><img src="/assets/site-case/portrait.jpg" alt=""></div></div>
        </aside>
      </div>

      <div class="site-case-bottom">
        <div class="site-case-tags" aria-label="Компетенции"><span>STRUCTURE</span><span>UX</span><span>VISUAL</span><span>BUILD</span></div>
        <a class="site-case-live" href="https://denisovphoto.ru/" target="_blank" rel="noreferrer">ОТКРЫТЬ САЙТ ↗</a>
      </div>
    </div>
  `;

  const screen = section.querySelector(".site-case-screen");
  const targets = Array.from(section.querySelectorAll("[data-demo-stage]"));
  const stageButtons = Array.from(section.querySelectorAll("[data-site-step]"));
  if (!screen || targets.length !== 5) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let visible = false;
  let generation = 0;

  const ease = (t) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const wait = (ms, token) => new Promise((resolve) => {
    const started = performance.now();
    const tick = () => {
      if (token !== generation || !visible) return resolve(false);
      if (performance.now() - started >= ms) return resolve(true);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  function setStage(index) {
    stageButtons.forEach((button, buttonIndex) => button.classList.toggle("is-active", buttonIndex === index));
    section.classList.toggle("show-phone", index >= 3);
  }

  function targetScrollTop(index) {
    const target = targets[index];
    const max = Math.max(0, screen.scrollHeight - screen.clientHeight);
    return Math.max(0, Math.min(target.offsetTop, max));
  }

  function animateTo(index, duration, token) {
    return new Promise((resolve) => {
      const start = screen.scrollTop;
      const end = targetScrollTop(index);
      const delta = end - start;
      if (Math.abs(delta) < 2 || reducedMotion) {
        screen.scrollTop = end;
        return resolve(true);
      }
      const started = performance.now();
      const frame = (now) => {
        if (token !== generation || !visible) return resolve(false);
        const progress = Math.min(1, (now - started) / duration);
        screen.scrollTop = start + delta * ease(progress);
        if (progress < 1) requestAnimationFrame(frame);
        else resolve(true);
      };
      requestAnimationFrame(frame);
    });
  }

  async function runSequence(token) {
    if (reducedMotion) {
      setStage(0);
      screen.scrollTop = 0;
      return;
    }

    while (visible && token === generation) {
      for (let index = 0; index < targets.length; index += 1) {
        if (!visible || token !== generation) return;
        setStage(index);
        if (!(await animateTo(index, index === 0 ? 700 : 1650, token))) return;
        if (!(await wait(index === 0 ? 1300 : 1500, token))) return;
      }
      if (!visible || token !== generation) return;
      if (!(await wait(700, token))) return;
      setStage(0);
      await animateTo(0, 1100, token);
      await wait(900, token);
    }
  }

  stageButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      generation += 1;
      setStage(index);
      const token = generation;
      const start = screen.scrollTop;
      const end = targetScrollTop(index);
      const started = performance.now();
      const duration = 650;
      const frame = (now) => {
        if (token !== generation) return;
        const progress = Math.min(1, (now - started) / duration);
        screen.scrollTop = start + (end - start) * ease(progress);
        if (progress < 1) requestAnimationFrame(frame);
        else if (visible) {
          generation += 1;
          runSequence(generation);
        }
      };
      requestAnimationFrame(frame);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;
    if (entry.isIntersecting && entry.intersectionRatio >= .28) {
      if (visible) return;
      visible = true;
      generation += 1;
      screen.scrollTop = 0;
      setStage(0);
      runSequence(generation);
    } else if (!entry.isIntersecting || entry.intersectionRatio < .12) {
      visible = false;
      generation += 1;
    }
  }, { threshold: [0, .12, .28, .55] });

  observer.observe(section);
})();
