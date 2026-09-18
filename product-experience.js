(() => {
  const section = document.getElementById("product");
  if (!section) return;

  section.classList.remove("is-pending");
  section.classList.add("product-showcase");
  section.innerHTML = `
    <div class="section-label">
      <div class="section-number">05</div>
      <h2>ЦИФРОВОЙ ПРОДУКТ</h2>
      <p>DIRECT AI</p>
      <span class="label-rule"></span>
    </div>

    <div class="section-content product-showcase-content">
      <div class="dai-shell" aria-label="Демонстрация Direct AI">
        <header class="dai-bar">
          <div class="dai-logo">Direct AI</div>
          <nav class="dai-tabs" aria-label="Разделы Direct AI">
            <button type="button" data-dai-target="overview" class="is-active">Сводка</button>
            <button type="button" data-dai-target="campaigns">Кампании</button>
            <button type="button" data-dai-target="agent">Агент</button>
            <button type="button" data-dai-target="action">Решения</button>
          </nav>
          <span class="dai-demo-mark"><i></i>DEMO DATA</span>
        </header>

        <div class="dai-screen">
          <section class="dai-view is-active" data-dai-view="overview">
            <div class="dai-view-head">
              <div><span>Последние 7 дней</span><h3>Сводка</h3></div>
              <span class="dai-update"><i></i>обновлено сейчас</span>
            </div>
            <div class="dai-kpi-grid">
              <article><span>Расход</span><strong>86 420 ₽</strong><em>+4.8%</em></article>
              <article><span>Клики</span><strong>1 284</strong><em>+9.2%</em></article>
              <article><span>Конверсии</span><strong>67</strong><em>+14.6%</em></article>
              <article><span>CPA</span><strong>1 290 ₽</strong><em class="is-good">−8.5%</em></article>
            </div>
            <div class="dai-overview-grid">
              <article class="dai-card dai-chart-card">
                <div class="dai-card-title"><span>Расход / конверсии</span><b>7 дней</b></div>
                <div class="dai-chart" aria-hidden="true">
                  <i style="--v:42%"></i><i style="--v:55%"></i><i style="--v:48%"></i><i style="--v:67%"></i><i style="--v:61%"></i><i style="--v:79%"></i><i style="--v:72%"></i>
                </div>
              </article>
              <article class="dai-card dai-feed-card">
                <span class="dai-blue-label">AI работает</span>
                <strong>7 действий готовы</strong>
                <div class="dai-feed">
                  <span><b>01</b>1 248 запросов проверено</span>
                  <span><b>02</b>18 отклонений найдено</span>
                  <span><b>03</b>7 действий сформировано</span>
                </div>
              </article>
            </div>
          </section>

          <section class="dai-view" data-dai-view="campaigns">
            <div class="dai-view-head">
              <div><span>Рекламный кабинет</span><h3>Кампании</h3></div>
              <span class="dai-update"><i></i>3 активны</span>
            </div>
            <div class="dai-campaign-table">
              <div class="dai-campaign-row dai-campaign-row--head"><span>Кампания</span><span>Расход</span><span>Конв.</span><span>CPA</span><span>Динамика</span></div>
              <div class="dai-campaign-row"><span><strong>Поиск | Основная</strong><small>SEARCH · ACTIVE</small></span><span>48 320 ₽</span><span>37</span><span>1 306 ₽</span><span class="dai-positive">−6.4%</span></div>
              <div class="dai-campaign-row"><span><strong>Поиск | Горячий спрос</strong><small>SEARCH · ACTIVE</small></span><span>26 780 ₽</span><span>24</span><span>1 116 ₽</span><span class="dai-positive">−12.4%</span></div>
              <div class="dai-campaign-row"><span><strong>Ретаргетинг</strong><small>RETARGET · ACTIVE</small></span><span>11 320 ₽</span><span>6</span><span>1 887 ₽</span><span class="dai-negative">+9.8%</span></div>
            </div>
            <div class="dai-insight-strip"><span>AI заметил</span><strong>В ретаргетинге CPA растёт второй период подряд</strong><button type="button" data-dai-target="agent">Разобрать →</button></div>
          </section>

          <section class="dai-view" data-dai-view="agent">
            <div class="dai-agent-layout">
              <aside class="dai-agent-side">
                <span>AI AGENT</span>
                <strong>Анализ кабинета</strong>
                <p>Данные, причины и конкретные действия в одном диалоге.</p>
              </aside>
              <div class="dai-chat">
                <div class="dai-message dai-message--user">Почему растёт CPA в ретаргетинге?</div>
                <div class="dai-thinking"><i></i><span>Проверяю кампанию, запросы и два периода…</span></div>
                <div class="dai-message dai-message--ai">
                  <span>Нашёл причину</span>
                  <strong>31 клик ушёл в запрос без конверсий</strong>
                  <p>Запрос «фотограф недорого» потратил 4 870 ₽ и не дал ни одной конверсии. Картина повторяется второй период.</p>
                  <button type="button" data-dai-target="action">Показать решение</button>
                </div>
              </div>
            </div>
          </section>

          <section class="dai-view" data-dai-view="action">
            <div class="dai-action-layout">
              <article class="dai-action-card dai-action-problem">
                <span>Проблема</span>
                <h3>«фотограф недорого»</h3>
                <div><b>31 клик</b><b>4 870 ₽</b><b>0 конверсий</b></div>
                <p>Запрос стабильно расходует бюджет без результата.</p>
              </article>
              <article class="dai-action-card dai-action-solution">
                <span>Решение</span>
                <h3>Добавить в минус-слова</h3>
                <p>Изменение будет применено только после подтверждения.</p>
                <div class="dai-saving"><small>Потенциальная экономия / месяц</small><strong>≈ 6 200 ₽</strong></div>
                <button type="button" class="dai-confirm">Подтвердить действие</button>
                <div class="dai-confirmed"><i>✓</i><span>Действие подготовлено</span></div>
              </article>
            </div>
          </section>

          <span class="dai-demo-cursor" aria-hidden="true"></span>
        </div>
      </div>
    </div>`;

  const views = [...section.querySelectorAll("[data-dai-view]")];
  const buttons = [...section.querySelectorAll("[data-dai-target]")];
  const tabs = [...section.querySelectorAll(".dai-tabs [data-dai-target]")];
  const shell = section.querySelector(".dai-shell");
  const screen = section.querySelector(".dai-screen");
  const cursor = section.querySelector(".dai-demo-cursor");
  const confirm = section.querySelector(".dai-confirm");
  const confirmed = section.querySelector(".dai-confirmed");
  if (!shell || !screen || !cursor || !confirm || !confirmed) return;

  const order = ["overview", "campaigns", "agent", "action"];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let index = 0;
  let timer = 0;
  let visible = false;
  let manualHoldUntil = 0;

  function setView(name, manual = false) {
    const nextIndex = order.indexOf(name);
    if (nextIndex < 0) return;
    index = nextIndex;
    views.forEach((view) => view.classList.toggle("is-active", view.dataset.daiView === name));
    tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.daiTarget === name));
    confirmed.classList.remove("is-visible");
    confirm.classList.remove("is-pressed");
    if (manual) manualHoldUntil = performance.now() + 7000;
  }

  function cursorTo(target) {
    if (!target || reduceMotion) return;
    const a = screen.getBoundingClientRect();
    const b = target.getBoundingClientRect();
    const x = b.left - a.left + Math.min(b.width * .72, b.width - 8);
    const y = b.top - a.top + b.height * .62;
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
    timer = window.setTimeout(playStep, delay);
  }

  function playStep() {
    if (!visible || reduceMotion) return;
    if (performance.now() < manualHoldUntil) return schedule(1500);

    const next = order[(index + 1) % order.length];
    const target = tabs.find((tab) => tab.dataset.daiTarget === next) || confirm;
    cursorTo(target);
    timer = window.setTimeout(() => {
      clickCursor();
      timer = window.setTimeout(() => {
        setView(next);
        if (next === "action") {
          timer = window.setTimeout(() => {
            cursorTo(confirm);
            timer = window.setTimeout(() => {
              clickCursor();
              confirm.classList.add("is-pressed");
              confirmed.classList.add("is-visible");
              schedule(2600);
            }, 700);
          }, 1700);
        } else {
          schedule(next === "agent" ? 3800 : 3200);
        }
      }, 340);
    }, 620);
  }

  buttons.forEach((button) => button.addEventListener("click", () => {
    const target = button.dataset.daiTarget;
    if (target) setView(target, true);
    schedule(7000);
  }));

  confirm.addEventListener("click", () => {
    confirm.classList.add("is-pressed");
    confirmed.classList.add("is-visible");
    manualHoldUntil = performance.now() + 6000;
  });

  const observer = new IntersectionObserver((entries) => {
    visible = Boolean(entries[0]?.isIntersecting);
    clearTimeout(timer);
    if (visible) schedule(2200);
    else cursor.classList.remove("is-visible");
  }, { threshold: .28 });
  observer.observe(shell);
})();