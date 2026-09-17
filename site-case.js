(() => {
  const product = document.getElementById("product");
  if (product) {
    if (!document.querySelector('link[href^="/product-case.css"]')) {
      const stylesheet = document.createElement("link");
      stylesheet.rel = "stylesheet";
      stylesheet.href = "/product-case.css?v=1";
      document.head.appendChild(stylesheet);
    }

    product.classList.remove("is-pending");
    product.classList.add("product-case-section");
    product.innerHTML = `
      <div class="section-label">
        <div class="section-number">05</div>
        <h2>РАЗРАБОТКА ПРОДУКТА</h2>
        <p>ДИРЕКТ ИИ</p>
        <span class="label-rule"></span>
      </div>

      <div class="section-content product-case">
        <div class="product-case-intro">
          <div class="product-case-copy">
            <span>DIRECT AI</span>
            <h3>AI-АГЕНТ ДЛЯ СОЗДАНИЯ, ПРОВЕРКИ И УПРАВЛЕНИЯ РЕКЛАМОЙ В ЯНДЕКС ДИРЕКТЕ.</h3>
          </div>
          <div class="product-case-nav" aria-label="Основные разделы Direct AI">
            <span>АГЕНТ</span><span>КАМПАНИИ</span><span>СВОДКА</span>
          </div>
        </div>

        <article class="direct-screen direct-screen--hero" aria-label="Интерфейс Direct AI — Сводка">
          <div class="direct-appbar">
            <div class="direct-identity">
              <strong class="direct-wordmark">Direct AI</strong>
              <span class="direct-connection"><i></i>Яндекс Директ подключен</span>
            </div>
            <div class="direct-main-nav" aria-hidden="true">
              <span>Агент</span><span>Кампании</span><span class="is-active">Сводка</span>
            </div>
            <div class="direct-app-actions" aria-hidden="true">
              <span class="direct-create">＋ Создать</span><span class="direct-menu-dot">•••</span>
            </div>
          </div>

          <div class="direct-workspace">
            <header class="direct-briefing-head">
              <div>
                <p class="direct-kicker">Сводка</p>
                <h4>Срочных решений сейчас нет</h4>
                <p>Агент отделяет рекламные сигналы от бизнес-результата и не предлагает действие без проверяемой причины.</p>
              </div>
              <span class="direct-primary-button">Запустить проверку</span>
            </header>

            <div class="direct-system-line">
              <strong>Данные Яндекс Директа</strong>
              <span>Любое изменение только после подтверждения</span>
              <span>Подключения</span>
            </div>

            <div class="direct-kpis" aria-label="KPI из интерфейса Direct AI">
              <article><span>Цена клика</span><strong>Нет данных</strong><p>нет базы сравнения · активные · 7 дней</p></article>
              <article><span>Расход за 7 дней</span><strong>Нет данных</strong><p>нет базы сравнения</p></article>
              <article><span>Лиды в работе</span><strong>Нет данных</strong><p>Бизнес-результат пока не подтверждён</p></article>
              <article><span>Выручка</span><strong>Нет данных</strong><p>Бизнес-результат пока не подтверждён</p></article>
            </div>

            <div class="direct-focus">
              <section class="direct-panel">
                <div class="direct-panel-head"><span>Агент нашёл</span><h4>Что стоит проверить</h4></div>
                <div class="direct-empty"><strong>Пока проверять нечего</strong><p>Запусти проверку. Агент покажет только выводы, для которых есть источник и достаточные данные.</p></div>
              </section>
              <section class="direct-panel direct-review-block">
                <span>Проверка кабинета</span>
                <strong>Проверить активные кампании</strong>
                <p>Сравню два полных периода и покажу источник каждого вывода.</p>
                <span class="direct-primary-button">Проверить кампании сейчас</span>
              </section>
            </div>
          </div>
        </article>

        <div class="direct-screen-grid">
          <article class="direct-screen direct-screen--compact" aria-label="Интерфейс Direct AI — Агент">
            <div class="direct-appbar">
              <div class="direct-identity">
                <strong class="direct-wordmark">Direct AI</strong>
                <span class="direct-connection"><i></i>Яндекс Директ подключен</span>
              </div>
              <div class="direct-main-nav" aria-hidden="true">
                <span class="is-active">Агент</span><span>Кампании</span><span>Сводка</span>
              </div>
              <div class="direct-app-actions" aria-hidden="true"><span class="direct-menu-dot">•••</span></div>
            </div>
            <div class="direct-screen-body direct-agent-start">
              <span class="direct-agent-label">Рабочее поле</span>
              <h4>Агент</h4>
              <div class="direct-composer"><span>Проверь рекламный кабинет</span></div>
              <div class="direct-prompts">
                <span>Проверь рекламный кабинет</span>
                <span>Почему выросла цена заявки?</span>
                <span>Где сейчас теряется рекламный бюджет?</span>
                <span>Создай новую кампанию</span>
                <span>Покажи лиды и продажи</span>
              </div>
            </div>
          </article>

          <article class="direct-screen direct-screen--compact" aria-label="Интерфейс Direct AI — Кампании">
            <div class="direct-appbar">
              <div class="direct-identity">
                <strong class="direct-wordmark">Direct AI</strong>
                <span class="direct-connection"><i></i>Яндекс Директ подключен</span>
              </div>
              <div class="direct-main-nav" aria-hidden="true">
                <span>Агент</span><span class="is-active">Кампании</span><span>Сводка</span>
              </div>
              <div class="direct-app-actions" aria-hidden="true"><span class="direct-menu-dot">•••</span></div>
            </div>
            <div class="direct-screen-body">
              <header class="direct-campaign-head">
                <div>
                  <p class="direct-kicker">АКТИВНЫЕ КАМПАНИИ</p>
                  <h4>Кампании</h4>
                  <p>Просмотр фактического состояния кабинета и ручной анализ агентом. Кнопка проверки ниже запускает полный цикл по работающим кампаниям прямо сейчас.</p>
                </div>
                <span class="direct-campaign-action">Создать кампанию</span>
              </header>

              <div class="direct-metrics-mini">
                <article><span>Всего</span><strong>Нет данных</strong><small>кампаний в кабинете</small></article>
                <article><span>Работают</span><strong>Нет данных</strong><small>участвуют в оперативном анализе</small></article>
                <article><span>Приостановлены</span><strong>Нет данных</strong><small>не влияют на оперативные KPI</small></article>
                <article><span>Режим анализа</span><strong>7 дней</strong><small>против предыдущих 7 дней</small></article>
              </div>

              <div class="direct-campaign-table">
                <div class="direct-campaign-table-head"><div><strong>Рекламный кабинет</strong><br><span>Данные напрямую из Яндекс Директа</span></div><span>0</span></div>
                <div class="direct-table-labels"><span>Кампания</span><span>Показы</span><span>Статус</span><span>Тип</span><span>Старт</span><span>Бюджет, если доступен</span></div>
              </div>
            </div>
          </article>
        </div>

        <div class="direct-tools" aria-label="Разделы Direct AI">
          <div class="direct-tool"><strong>Решения</strong><span>Гипотезы, доказательства и подтверждения</span></div>
          <div class="direct-tool"><strong>Новая кампания</strong><span>Диалог с агентом и безопасный проект</span></div>
          <div class="direct-tool"><strong>Поисковые запросы</strong><span>Фактические запросы, качество трафика и семантика</span></div>
          <div class="direct-tool"><strong>История анализов</strong><span>Сохранённые выводы и сравнения</span></div>
          <div class="direct-tool"><strong>Лиды и продажи</strong><span>Фактический бизнес-результат</span></div>
          <div class="direct-tool"><strong>Настройки</strong><span>Аккаунт, оформление и данные</span></div>
        </div>
      </div>
    `;
  }

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
        <p class="site-case-kicker">DESKTOP · REAL SITE</p>
      </div>

      <div class="site-browser" aria-label="Автоматический просмотр реальной desktop-версии Denisov Photo">
        <div class="site-browser-bar" aria-hidden="true">
          <span class="site-browser-dots"><i></i><i></i><i></i></span>
          <span class="site-browser-address">denisovphoto.ru</span>
          <span></span>
        </div>
        <a class="site-case-screen" href="https://denisovphoto.ru/" target="_blank" rel="noreferrer" aria-label="Открыть Denisov Photo">
          <img class="site-case-capture" src="/assets/site-case/denisovphoto-desktop.png?v=1" alt="Desktop-версия сайта Denisov Photo" decoding="async">
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
