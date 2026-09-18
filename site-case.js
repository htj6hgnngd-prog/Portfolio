(() => {
  if (!document.querySelector('link[href^="/site-case.css"]')) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "/site-case.css?v=5";
    document.head.appendChild(stylesheet);
  }

  const section = document.getElementById("site");
  if (!section) return;

  section.classList.remove("is-pending");
  section.classList.add("site-case-section");
  section.innerHTML = `
    <div class="section-label">
      <div class="section-number">06</div>
      <h2>ВЕБ-РАЗРАБОТКА</h2>
      <p>WEB / UX / BUILD</p>
      <span class="label-rule"></span>
    </div>

    <div class="section-content site-case-content">
      <div class="site-case-head">
        <h3 class="site-case-title">DENISOV PHOTO</h3>
        <p class="site-case-kicker">DESKTOP · REAL SITE</p>
      </div>

      <div class="site-browser" aria-label="Автоматический просмотр реальной desktop-версии Denisov Photo">
        <div class="site-browser-bar" aria-hidden="true">
          <span class="site-browser-dots"><i></i><i></i><i></i></span>
          <span class="site-browser-address">denisovphoto.ru</span>
          <span></span>
        </div>
        <a class="site-case-screen" href="https://denisovphoto.ru/" target="_blank" rel="noreferrer" aria-label="Открыть Denisov Photo">
          <img class="site-case-capture" src="/assets/site-case/denisovphoto-desktop.png?v=1" alt="Desktop-версия сайта Denisov Photo" loading="lazy" fetchpriority="low" decoding="async">
          <span class="site-case-overlay" aria-hidden="true"></span>
          <span class="site-case-progress" aria-hidden="true"><span></span></span>
        </a>
      </div>

      <div class="site-case-bottom">
        <div class="site-case-meta" aria-label="О проекте">
          <span>DESKTOP 1440</span><span>STRUCTURE</span><span>UX</span><span>VISUAL</span><span>BUILD</span>
        </div>
        <a class="site-case-live" href="https://denisovphoto.ru/" target="_blank" rel="noreferrer">ОТКРЫТЬ САЙТ ↗</a>
      </div>
    </div>
  `;

  const screen = section.querySelector(".site-case-screen");
  const image = section.querySelector(".site-case-capture");
  const progress = section.querySelector(".site-case-progress span");
  if (!screen || !image || !progress) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let visible = false;
  let cycle = 0;

  const wait = (ms, token) => new Promise((resolve) => {
    const started = performance.now();
    const tick = () => {
      if (!visible || token !== cycle) return resolve(false);
      if (performance.now() - started >= ms) return resolve(true);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  function maxTravel() {
    return Math.max(0, image.getBoundingClientRect().height - screen.clientHeight);
  }

  function setPosition(fraction) {
    const clamped = Math.max(0, Math.min(1, fraction));
    image.style.transform = `translate3d(0, ${-maxTravel() * clamped}px, 0)`;
    progress.style.transform = `scaleY(${clamped})`;
  }

  function animate(from, to, duration, token) {
    return new Promise((resolve) => {
      if (reducedMotion) {
        setPosition(to);
        return resolve(true);
      }
      const started = performance.now();
      const frame = (now) => {
        if (!visible || token !== cycle) return resolve(false);
        const raw = Math.min(1, (now - started) / duration);
        const eased = raw < .5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;
        setPosition(from + (to - from) * eased);
        if (raw < 1) requestAnimationFrame(frame);
        else resolve(true);
      };
      requestAnimationFrame(frame);
    });
  }

  async function run(token) {
    if (reducedMotion) {
      setPosition(0);
      return;
    }

    while (visible && token === cycle) {
      setPosition(0);
      if (!(await wait(1200, token))) return;
      if (!(await animate(0, .33, 4300, token))) return;
      if (!(await wait(650, token))) return;
      if (!(await animate(.33, .66, 4300, token))) return;
      if (!(await wait(650, token))) return;
      if (!(await animate(.66, 1, 4300, token))) return;
      if (!(await wait(1200, token))) return;
      if (!(await animate(1, 0, 1200, token))) return;
      if (!(await wait(900, token))) return;
    }
  }

  const start = () => {
    if (!visible || !image.complete || image.naturalWidth === 0) return;
    cycle += 1;
    setPosition(0);
    run(cycle);
  };

  image.addEventListener("load", start, { once: true });

  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;
    if (entry.isIntersecting && entry.intersectionRect.height >= 80) {
      if (visible) return;
      visible = true;
      start();
    } else if (!entry.isIntersecting) {
      visible = false;
      cycle += 1;
      setPosition(0);
    }
  }, { threshold: [0, .02, .05, .1] });

  observer.observe(section);

  window.addEventListener("resize", () => {
    if (!visible) return;
    cycle += 1;
    setPosition(0);
    start();
  }, { passive: true });
})();
