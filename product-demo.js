(() => {
  const section = document.getElementById("product");
  if (!section) return;

  if (!document.querySelector('link[href^="/product-demo.css"]')) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = "/product-demo.css?v=3";
    document.head.appendChild(stylesheet);
  }

  section.classList.remove("is-pending", "product-case-section");
  section.classList.add("product-demo-section");
  section.innerHTML = `
    <div class="section-label">
      <div class="section-number">05</div>
      <h2>РАЗРАБОТКА ПРОДУКТА</h2>
      <p>ДИРЕКТ ИИ</p>
      <span class="label-rule"></span>
    </div>

    <div class="section-content product-demo-wrap">
      <div class="product-demo-head">
        <div class="product-demo-head-copy">
          <span>DIRECT AI / PRODUCT CASE</span>
          <h3>НЕ ЕЩЁ ОДИН ДАШБОРД.</h3>
          <p>Рекламный кабинет показывает, что произошло.<br><strong>Direct AI помогает понять, что делать дальше.</strong></p>
        </div>
        <div class="product-demo-sequence" aria-label="Логика продукта">
          <span data-step="agent" class="is-active"><b>01</b><em>ЗАДАЧА</em></span>
          <span data-step="review"><b>02</b><em>АНАЛИЗ</em></span>
          <span data-step="dashboard"><b>03</b><em>ВЫВОД</em></span>
          <span data-step="campaigns"><b>04</b><em>КОНТРОЛЬ</em></span>
          <span data-step="menu"><b>05</b><em>СИСТЕМА</em></span>
        </div>
      </div>

      <div class="product-demo-story" aria-live="polite">
        <span class="product-demo-story-kicker">01 / ЗАДАЧА</span>
        <strong class="product-demo-story-title">СТАВИШЬ ЗАДАЧУ ОБЫЧНЫМ ЯЗЫКОМ.</strong>
      </div>

      <div class="dai-demo-frame" aria-label="Автоматическая демонстрация реального интерфейса Direct AI">
        <div class="dai-demo-canvas">
          <header class="dai-topbar">
            <div class="dai-identity">
              <strong class="dai-wordmark">Direct AI</strong>
              <span class="dai-account"><i></i>Яндекс Директ подключен</span>
            </div>

            <nav class="dai-main-nav" aria-label="Основная навигация Direct AI">
              <button class="dai-nav-item is-active" type="button" data-demo-nav="agent"><span class="dai-nav-icon">◉</span><span>Агент</span></button>
              <button class="dai-nav-item" type="button" data-demo-nav="campaigns"><span class="dai-nav-icon">▣</span><span>Кампании</span></button>
              <button class="dai-nav-item" type="button" data-demo-nav="dashboard"><span class="dai-nav-icon">◫</span><span>Сводка</span></button>
            </nav>

            <div class="dai-top-actions">
              <button class="dai-create" type="button">＋ Создать</button>
              <button class="dai-menu-button" type="button" data-demo-menu aria-label="Открыть меню">☰</button>
            </div>
          </header>

          <div class="dai-viewport">
            <section class="dai-scene dai-agent-scene is-active" data-scene="agent">
              <div class="dai-agent-start">
                <span class="dai-agent-eyebrow">Агент готов</span>
                <h4 class="dai-agent-title">Что нужно сделать с рекламой?</h4>
                <p class="dai-agent-subtitle">Опиши задачу обычным языком или передай готовый бриф файлом. Агент сам поднимет доступные данные и нужный контекст.</p>

                <div class="dai-composer">
                  <span class="dai-composer-text">Например: создай кампанию или проверь, почему выросла цена заявки</span>
                  <span class="dai-send">↑</span>
                </div>

                <div class="dai-quick-prompts">
                  <span class="dai-quick-prompt" data-demo-review>Проверь рекламный кабинет</span>
                  <span class="dai-quick-prompt">Почему выросла цена заявки?</span>
                  <span class="dai-quick-prompt">Где сейчас теряется рекламный бюджет?</span>
                  <span class="dai-quick-prompt">Создай новую кампанию</span>
                  <span class="dai-quick-prompt">Покажи лиды и продажи</span>
                </div>
              </div>

              <div class="dai-agent-review" data-demo-review-state>
                <div class="dai-review-card">
                  <div class="dai-review-card-head">
                    <div class="dai-review-copy">
                      <span>Проверка кабинета</span>
                      <strong>Проверить активные кампании</strong>
                      <p>Сравню два полных периода и покажу источник каждого вывода.</p>
                    </div>
                    <span class="dai-review-action"><i class="dai-scan-dot"></i>Проверка продолжается</span>
                  </div>
                  <div class="dai-review-progress"><i></i></div>
                </div>
              </div>
            </section>

            <section class="dai-scene" data-scene="dashboard">
              <div class="dai-workspace">
                <header class="dai-dashboard-head">
                  <div>
                    <p class="dai-kicker"><i></i>Сводка</p>
                    <h4>Срочных решений сейчас нет</h4>
                    <p>Агент отделяет рекламные сигналы от бизнес-результата и не предлагает действие без проверяемой причины.</p>
                  </div>
                  <span class="dai-primary-action">Запустить проверку</span>
                </header>

                <div class="dai-system-line">
                  <strong>Данные Яндекс Директа</strong>
                  <span>Любое изменение только после подтверждения</span>
                  <em>Подключения</em>
                </div>

                <div class="dai-kpis">
                  <article><span>Цена клика</span><strong>Нет данных</strong><p>нет базы сравнения · активные · 7 дней</p></article>
                  <article><span>Расход за 7 дней</span><strong>Нет данных</strong><p>нет базы сравнения</p></article>
                  <article><span>Лиды в работе</span><strong>Нет данных</strong><p>Бизнес-результат пока не подтверждён</p></article>
                  <article><span>Выручка</span><strong>Нет данных</strong><p>Бизнес-результат пока не подтверждён</p></article>
                </div>

                <div class="dai-dashboard-grid">
                  <section class="dai-panel">
                    <span class="dai-panel-eyebrow">Агент нашёл</span>
                    <h5>Что стоит проверить</h5>
                    <div class="dai-empty"><strong>Пока проверять нечего</strong><p>Запусти проверку. Агент покажет только выводы, для которых есть источник и достаточные данные.</p></div>
                  </section>
                  <section class="dai-panel dai-check-card">
                    <span class="dai-panel-eyebrow">Проверка кабинета</span>
                    <h5>Проверить активные кампании</h5>
                    <p>Сравню два полных периода и покажу источник каждого вывода.</p>
                    <span class="dai-primary-action">Проверить кампании сейчас</span>
                  </section>
                </div>
              </div>
            </section>

            <section class="dai-scene" data-scene="campaigns">
              <div class="dai-workspace">
                <header class="dai-campaign-head">
                  <div>
                    <p class="dai-kicker"><i></i>АКТИВНЫЕ КАМПАНИИ</p>
                    <h4>Кампании</h4>
                    <p>Просмотр фактического состояния кабинета и ручной анализ агентом. Кнопка проверки ниже запускает полный цикл по работающим кампаниям прямо сейчас.</p>
                  </div>
                  <div class="dai-campaign-meta"><span>Работают: 0</span><span>Создать кампанию</span></div>
                </header>

                <div class="dai-review-strip">
                  <div><strong>Проверить активные кампании</strong><p>Сравню два полных периода и покажу источник каждого вывода.</p></div>
                  <span class="dai-primary-action">Проверить кампании сейчас</span>
                </div>

                <div class="dai-metric-grid">
                  <article class="dai-metric-card"><span>Всего</span><strong>Нет данных</strong><small>кампаний в кабинете</small></article>
                  <article class="dai-metric-card"><span>Работают</span><strong>Нет данных</strong><small>участвуют в оперативном анализе</small></article>
                  <article class="dai-metric-card"><span>Приостановлены</span><strong>Нет данных</strong><small>не влияют на оперативные KPI</small></article>
                  <article class="dai-metric-card"><span>Режим анализа</span><strong>7 дней</strong><small>против предыдущих 7 дней</small></article>
                </div>

                <section class="dai-table">
                  <div class="dai-table-head"><div><strong>Рекламный кабинет</strong><p>Данные напрямую из Яндекс Директа</p></div><span>0</span></div>
                  <div class="dai-table-columns"><span>Кампания</span><span>Показы</span><span>Статус</span><span>Тип</span><span>Старт</span><span>Бюджет, если доступен</span></div>
                </section>
              </div>
            </section>
          </div>

          <div class="dai-menu-layer" data-menu-layer>
            <aside class="dai-menu-panel">
              <div class="dai-menu-head">
                <div><small>Direct AI</small><h4>Все инструменты</h4></div>
                <span class="dai-menu-close">×</span>
              </div>
              <div class="dai-menu-links">
                <div class="dai-menu-link"><span class="dai-menu-icon">✓</span><span><b>Решения</b><small>Гипотезы, доказательства и подтверждения</small></span></div>
                <div class="dai-menu-link"><span class="dai-menu-icon">＋</span><span><b>Новая кампания</b><small>Диалог с агентом и безопасный проект</small></span></div>
                <div class="dai-menu-link"><span class="dai-menu-icon">⌕</span><span><b>Поисковые запросы</b><small>Фактические запросы, качество трафика и семантика</small></span></div>
                <div class="dai-menu-link"><span class="dai-menu-icon">↶</span><span><b>История анализов</b><small>Сохранённые выводы и сравнения</small></span></div>
                <div class="dai-menu-link"><span class="dai-menu-icon">◎</span><span><b>Лиды и продажи</b><small>Фактический бизнес-результат</small></span></div>
                <div class="dai-menu-link"><span class="dai-menu-icon">⚙</span><span><b>Настройки</b><small>Аккаунт, оформление и данные</small></span></div>
              </div>
              <div class="dai-menu-safety"><strong>Агент работает в фоне</strong><span>Переход между разделами не останавливает текущую задачу.</span></div>
            </aside>
          </div>

          <span class="dai-cursor" aria-hidden="true"></span>
        </div>

        <div class="product-value-overlay" aria-hidden="true">
          <span>DIRECT AI</span>
          <strong>ДАННЫЕ → АНАЛИЗ → РЕШЕНИЕ → ДЕЙСТВИЕ</strong>
          <p>AI-агент для работы с рекламой в Яндекс Директе.</p>
        </div>
      </div>

      <div class="product-demo-caption">
        <strong>DIRECT AI</strong>
        <span>PRODUCT / UX / FRONTEND / BACKEND / AI / YANDEX DIRECT API</span>
      </div>
    </div>
  `;

  const frame = section.querySelector(".dai-demo-frame");
  const canvas = section.querySelector(".dai-demo-canvas");
  const cursor = section.querySelector(".dai-cursor");
  const reviewState = section.querySelector("[data-demo-review-state]");
  const reviewPrompt = section.querySelector("[data-demo-review]");
  const menuLayer = section.querySelector("[data-menu-layer]");
  const scenes = [...section.querySelectorAll("[data-scene]")];
  const navItems = [...section.querySelectorAll("[data-demo-nav]")];
  const steps = [...section.querySelectorAll("[data-step]")];
  const story = section.querySelector(".product-demo-story");
  const storyKicker = section.querySelector(".product-demo-story-kicker");
  const storyTitle = section.querySelector(".product-demo-story-title");
  const valueOverlay = section.querySelector(".product-value-overlay");
  if (!frame || !canvas || !cursor || !reviewState || !reviewPrompt || !menuLayer || !story || !storyKicker || !storyTitle || !valueOverlay) return;

  const storyCopy = {
    agent: ["01 / ЗАДАЧА", "СТАВИШЬ ЗАДАЧУ ОБЫЧНЫМ ЯЗЫКОМ."],
    review: ["02 / АНАЛИЗ", "АГЕНТ СРАВНИВАЕТ ПЕРИОДЫ, ИЩЕТ ОТКЛОНЕНИЯ И ПРОВЕРЯЕТ ПРИЧИНЫ."],
    dashboard: ["03 / ВЫВОД", "НЕ ПРОСТО МЕТРИКИ — ТОЛЬКО ВЫВОДЫ, КОТОРЫЕ МОЖНО ПРОВЕРИТЬ."],
    campaigns: ["04 / КОНТРОЛЬ", "КАМПАНИИ И СОСТОЯНИЕ КАБИНЕТА — В ОДНОМ РАБОЧЕМ ПРОСТРАНСТВЕ."],
    menu: ["05 / СИСТЕМА", "РЕШЕНИЯ, ПОИСКОВЫЕ ЗАПРОСЫ, ИСТОРИЯ АНАЛИЗОВ, ЛИДЫ И ПРОДАЖИ."],
    summary: ["DIRECT AI", "ДАННЫЕ → АНАЛИЗ → РЕШЕНИЕ → ДЕЙСТВИЕ"]
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let visible = false;
  let runId = 0;
  let scale = 1;

  function resizeDemo() {
    const width = frame.clientWidth || 1200;
    scale = width / 1200;
    canvas.style.transform = `scale(${scale})`;
    frame.style.height = `${Math.round(750 * scale)}px`;
  }

  const resizeObserver = new ResizeObserver(resizeDemo);
  resizeObserver.observe(frame);
  resizeDemo();

  function setStory(name) {
    const copy = storyCopy[name];
    if (!copy) return;
    story.classList.remove("is-changing");
    void story.offsetWidth;
    storyKicker.textContent = copy[0];
    storyTitle.textContent = copy[1];
    story.classList.add("is-changing");
  }

  function setStep(name) {
    steps.forEach((item) => item.classList.toggle("is-active", item.dataset.step === name));
    setStory(name);
  }

  function setScene(name) {
    scenes.forEach((scene) => scene.classList.toggle("is-active", scene.dataset.scene === name));
    navItems.forEach((item) => item.classList.toggle("is-active", item.dataset.demoNav === name));
  }

  function resetState() {
    setScene("agent");
    setStep("agent");
    reviewPrompt.classList.remove("is-targeted");
    reviewState.classList.remove("is-visible");
    menuLayer.classList.remove("is-open");
    valueOverlay.classList.remove("is-visible");
    cursor.classList.remove("is-visible", "is-clicking");
  }

  function wait(ms, token) {
    return new Promise((resolve) => {
      const start = performance.now();
      function tick(now) {
        if (!visible || token !== runId) return resolve(false);
        if (now - start >= ms) return resolve(true);
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  function cursorTo(target) {
    if (!target) return;
    const canvasRect = canvas.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const currentScale = canvasRect.width / 1200 || scale || 1;
    const x = (targetRect.left - canvasRect.left + targetRect.width * .58) / currentScale;
    const y = (targetRect.top - canvasRect.top + targetRect.height * .55) / currentScale;
    cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    cursor.classList.add("is-visible");
  }

  function clickCursor() {
    cursor.classList.remove("is-clicking");
    void cursor.offsetWidth;
    cursor.classList.add("is-clicking");
    window.setTimeout(() => cursor.classList.remove("is-clicking"), 450);
  }

  async function sequence(token) {
    if (reduceMotion) {
      resetState();
      return;
    }

    while (visible && token === runId) {
      resetState();
      if (!(await wait(700, token))) return;

      setStep("agent");
      cursorTo(reviewPrompt);
      reviewPrompt.classList.add("is-targeted");
      if (!(await wait(1100, token))) return;
      clickCursor();
      if (!(await wait(360, token))) return;

      setStep("review");
      reviewState.classList.add("is-visible");
      if (!(await wait(2800, token))) return;

      const dashboardNav = section.querySelector('[data-demo-nav="dashboard"]');
      cursorTo(dashboardNav);
      if (!(await wait(850, token))) return;
      clickCursor();
      if (!(await wait(250, token))) return;
      reviewState.classList.remove("is-visible");
      reviewPrompt.classList.remove("is-targeted");
      setScene("dashboard");
      setStep("dashboard");
      if (!(await wait(3000, token))) return;

      const campaignsNav = section.querySelector('[data-demo-nav="campaigns"]');
      cursorTo(campaignsNav);
      if (!(await wait(850, token))) return;
      clickCursor();
      if (!(await wait(250, token))) return;
      setScene("campaigns");
      setStep("campaigns");
      if (!(await wait(3000, token))) return;

      const menuButton = section.querySelector("[data-demo-menu]");
      cursorTo(menuButton);
      if (!(await wait(850, token))) return;
      clickCursor();
      if (!(await wait(250, token))) return;
      menuLayer.classList.add("is-open");
      setStep("menu");
      if (!(await wait(2700, token))) return;

      menuLayer.classList.remove("is-open");
      cursor.classList.remove("is-visible");
      if (!(await wait(500, token))) return;

      steps.forEach((item) => item.classList.remove("is-active"));
      setStory("summary");
      valueOverlay.classList.add("is-visible");
      if (!(await wait(2600, token))) return;
      valueOverlay.classList.remove("is-visible");
      if (!(await wait(650, token))) return;
    }
  }

  function start() {
    if (!visible) return;
    runId += 1;
    sequence(runId);
  }

  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;
    const shouldRun = entry.isIntersecting && entry.intersectionRatio >= .18;
    if (shouldRun && !visible) {
      visible = true;
      start();
    } else if (!shouldRun && visible) {
      visible = false;
      runId += 1;
      resetState();
    }
  }, { threshold: [0, .18, .35, .6] });

  observer.observe(section);
})();
