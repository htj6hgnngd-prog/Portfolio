(() => {
  const section = document.getElementById("product");
  if (!section) return;

  section.classList.add("product-web-demo");

  section.innerHTML = [
    '<div class="section-label">',
      '<div class="section-number">05</div>',
      '<h2>ЦИФРОВОЙ ПРОДУКТ</h2>',
      '<p>DIRECT AI</p>',
      '<span class="label-rule"></span>',
    '</div>',
    '<div class="section-content product-web-content">',
      '<div class="dai-browser">',
        '<div class="dai-browser-bar">',
          '<span class="dai-browser-dots"><i></i><i></i><i></i></span>',
          '<span class="dai-browser-address">direct-ai.app</span>',
          '<span class="dai-browser-demo"><i></i> DEMO DATA</span>',
        '</div>',
        '<div class="dai-stage">',
          '<div class="dai-canvas">',
            '<header class="dai-appbar">',
              '<div class="dai-wordmark">Direct AI</div>',
              '<nav class="dai-appnav">',
                '<button type="button" data-dai-nav="agent" class="is-active">Агент</button>',
                '<button type="button" data-dai-nav="overview">Сводка</button>',
                '<button type="button" data-dai-nav="campaigns">Кампании</button>',
                '<button type="button" data-dai-nav="decisions">Решения</button>',
              '</nav>',
              '<div class="dai-appstatus"><i></i>Яндекс Директ подключен</div>',
            '</header>',
            '<main class="dai-workspace">',
              '<section class="dai-page dai-agent-page is-active" data-dai-page="agent">',
                '<div class="dai-agent-start">',
                  '<span class="dai-agent-eyebrow">АГЕНТ ГОТОВ</span>',
                  '<h3>Что нужно сделать<br>с рекламой?</h3>',
                  '<p>Опиши задачу обычным языком. Агент сам поднимет данные рекламного кабинета и нужный контекст.</p>',
                  '<div class="dai-agent-composer"><span class="dai-agent-input"></span><i class="dai-agent-caret"></i><b>↑</b></div>',
                  '<div class="dai-quick-prompts">',
                    '<button type="button" data-demo-prompt="Проверь рекламный кабинет">Проверь рекламный кабинет</button>',
                    '<button type="button" data-demo-prompt="Почему выросла цена заявки?">Почему выросла цена заявки?</button>',
                    '<button type="button" data-demo-prompt="Где теряется рекламный бюджет?">Где теряется рекламный бюджет?</button>',
                    '<button type="button" data-demo-prompt="Покажи лиды и продажи">Покажи лиды и продажи</button>',
                  '</div>',
                '</div>',
                '<div class="dai-agent-review">',
                  '<div class="dai-review-state"><div><span>ПРОВЕРКА КАБИНЕТА</span><strong>Анализирую 3 активные кампании</strong><p>Сравниваю два периода, поисковые запросы и конверсии.</p></div><em><i></i>Работаю</em></div>',
                  '<div class="dai-review-progress"><i></i></div>',
                  '<div class="dai-review-result"><span>АНАЛИЗ ЗАВЕРШЁН</span><strong>18 сигналов найдено · 7 действий готовы</strong><button type="button" data-dai-nav="overview">Открыть сводку →</button></div>',
                '</div>',
              '</section>',

              '<section class="dai-page" data-dai-page="overview">',
                '<div class="dai-page-head"><div><span>ПОСЛЕДНИЕ 7 ДНЕЙ</span><h3>Сводка</h3><p>Ключевые показатели и состояние рекламы.</p></div><div class="dai-live"><i></i>обновлено сейчас</div></div>',
                '<div class="dai-kpis"><article><span>Расход</span><strong>86 420 ₽</strong><em>+4.8%</em></article><article><span>Клики</span><strong>1 284</strong><em>+9.2%</em></article><article><span>Конверсии</span><strong>67</strong><em>+14.6%</em></article><article><span>CPA</span><strong>1 290 ₽</strong><em class="good">−8.5%</em></article></div>',
                '<div class="dai-overview"><article class="dai-panel dai-chart-panel"><div class="dai-panel-head"><span>Расход и конверсии</span><b>7 дней</b></div><div class="dai-chart"><i style="--h:42%"></i><i style="--h:55%"></i><i style="--h:48%"></i><i style="--h:68%"></i><i style="--h:61%"></i><i style="--h:80%"></i><i style="--h:73%"></i></div></article><article class="dai-panel dai-ai-panel"><span>AI РАБОТАЕТ</span><strong>7 действий готовы</strong><div><b>1 248</b><small>запросов проверено</small></div><div><b>18</b><small>отклонений найдено</small></div><div><b>7</b><small>решений сформировано</small></div></article></div>',
              '</section>',

              '<section class="dai-page" data-dai-page="campaigns">',
                '<div class="dai-page-head"><div><span>РЕКЛАМНЫЙ КАБИНЕТ</span><h3>Кампании</h3><p>Фактическое состояние и эффективность.</p></div><div class="dai-live"><i></i>3 активны</div></div>',
                '<div class="dai-table"><div class="dai-row dai-row-head"><span>Кампания</span><span>Расход</span><span>Конверсии</span><span>CPA</span><span>Динамика</span></div><div class="dai-row"><span><strong>Поиск | Основная</strong><small>SEARCH · ACTIVE</small></span><span>48 320 ₽</span><span>37</span><span>1 306 ₽</span><span class="positive">−6.4%</span></div><div class="dai-row"><span><strong>Поиск | Горячий спрос</strong><small>SEARCH · ACTIVE</small></span><span>26 780 ₽</span><span>24</span><span>1 116 ₽</span><span class="positive">−12.4%</span></div><div class="dai-row is-alert"><span><strong>Ретаргетинг</strong><small>RETARGET · ACTIVE</small></span><span>11 320 ₽</span><span>6</span><span>1 887 ₽</span><span class="negative">+9.8%</span></div></div>',
                '<div class="dai-alert"><span>AI ЗАМЕТИЛ</span><strong>В ретаргетинге CPA растёт второй период подряд</strong><button type="button" data-dai-nav="decisions">Показать решение →</button></div>',
              '</section>',

              '<section class="dai-page" data-dai-page="decisions">',
                '<div class="dai-page-head"><div><span>РЕШЕНИЯ</span><h3>Действие готово</h3><p>Изменение применяется только после подтверждения.</p></div></div>',
                '<div class="dai-decision-grid"><article class="dai-decision-problem"><span>ПРОБЛЕМА</span><h4>«фотограф недорого»</h4><div class="dai-facts"><b>31 клик</b><b>4 870 ₽ расхода</b><b>0 конверсий</b></div><p>Запрос стабильно расходует бюджет без результата.</p></article><article class="dai-decision-action"><span>РЕКОМЕНДАЦИЯ</span><h4>Добавить в минус-слова</h4><p>Исключить запрос из показов.</p><div class="dai-saving"><small>Потенциальная экономия / месяц</small><strong>≈ 6 200 ₽</strong></div><button class="dai-confirm" type="button">Подтвердить действие</button><div class="dai-success"><i>✓</i><span>Действие подготовлено</span></div></article></div>',
              '</section>',
            '</main>',
            '<span class="dai-cursor" aria-hidden="true"></span>',
          '</div>',
        '</div>',
      '</div>',
    '</div>'
  ].join("");

  const BASE_W = 1440;
  const BASE_H = 900;
  const browser = section.querySelector(".dai-browser");
  const stage = section.querySelector(".dai-stage");
  const canvas = section.querySelector(".dai-canvas");
  const cursor = section.querySelector(".dai-cursor");
  const pages = [...section.querySelectorAll("[data-dai-page]")];
  const nav = [...section.querySelectorAll(".dai-appnav [data-dai-nav]")];
  const allTargets = [...section.querySelectorAll("[data-dai-nav]")];
  const input = section.querySelector(".dai-agent-input");
  const caret = section.querySelector(".dai-agent-caret");
  const composer = section.querySelector(".dai-agent-composer");
  const review = section.querySelector(".dai-agent-review");
  const result = section.querySelector(".dai-review-result");
  const confirm = section.querySelector(".dai-confirm");
  const success = section.querySelector(".dai-success");
  if (!browser || !stage || !canvas || !cursor || !input || !composer || !review || !result || !confirm || !success) return;

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

  function resetAgent() {
    input.textContent = "";
    caret.classList.remove("is-visible");
    composer.classList.remove("is-active");
    review.classList.remove("is-visible", "is-complete");
    result.classList.remove("is-visible");
  }

  function resetDecision() {
    confirm.classList.remove("is-pressed");
    success.classList.remove("is-visible");
  }

  function show(name) {
    pages.forEach(p => p.classList.toggle("is-active", p.dataset.daiPage === name));
    nav.forEach(b => b.classList.toggle("is-active", b.dataset.daiNav === name));
    if (name !== "agent") resetAgent();
    if (name !== "decisions") resetDecision();
  }

  function sleep(ms, token) {
    return new Promise(resolve => setTimeout(() => resolve(token === run && visible), ms));
  }

  function moveCursorTo(el) {
    if (!el || reduced) return;
    const c = canvas.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const x = (r.left - c.left + r.width * .7) / scale;
    const y = (r.top - c.top + r.height * .62) / scale;
    cursor.style.transform = "translate3d(" + x + "px," + y + "px,0)";
    cursor.classList.add("is-visible");
  }

  function clickCursor() {
    cursor.classList.remove("is-clicking");
    void cursor.offsetWidth;
    cursor.classList.add("is-clicking");
  }

  async function typeText(text, token) {
    composer.classList.add("is-active");
    caret.classList.add("is-visible");
    input.textContent = "";
    for (let i = 0; i <= text.length; i += 1) {
      if (!visible || token !== run) return false;
      input.textContent = text.slice(0, i);
      await new Promise(r => setTimeout(r, 82));
    }
    caret.classList.remove("is-visible");
    return true;
  }

  async function clickNav(name, token) {
    const el = allTargets.find(x => x.dataset.daiNav === name && x.closest(".dai-appnav"));
    moveCursorTo(el);
    if (!(await sleep(900, token))) return false;
    clickCursor();
    if (!(await sleep(230, token))) return false;
    show(name);
    return true;
  }

  async function sequence(token) {
    show("agent");
    resetAgent();
    cursor.classList.remove("is-visible");
    if (!(await sleep(2600, token))) return;

    moveCursorTo(composer);
    if (!(await sleep(850, token))) return;
    clickCursor();
    if (!(await typeText("Проверь рекламный кабинет", token))) return;

    moveCursorTo(composer.querySelector("b"));
    if (!(await sleep(760, token))) return;
    clickCursor();
    review.classList.add("is-visible");
    if (!(await sleep(3000, token))) return;
    review.classList.add("is-complete");
    result.classList.add("is-visible");
    if (!(await sleep(2400, token))) return;

    if (!(await clickNav("overview", token))) return;
    if (!(await sleep(1900, token))) return;

    if (!(await clickNav("campaigns", token))) return;
    if (!(await sleep(2900, token))) return;

    const solution = section.querySelector('.dai-alert [data-dai-nav="decisions"]');
    moveCursorTo(solution);
    if (!(await sleep(900, token))) return;
    clickCursor();
    if (!(await sleep(230, token))) return;
    show("decisions");
    if (!(await sleep(2100, token))) return;

    moveCursorTo(confirm);
    if (!(await sleep(500, token))) return;
    clickCursor();
    confirm.classList.add("is-pressed");
    success.classList.add("is-visible");
    if (!(await sleep(3200, token))) return;

    if (visible && token === run) sequence(token);
  }

  allTargets.forEach(button => button.addEventListener("click", () => {
    run += 1;
    show(button.dataset.daiNav);
  }));

  section.querySelectorAll("[data-demo-prompt]").forEach(button => button.addEventListener("click", () => {
    input.textContent = button.dataset.demoPrompt || "";
    composer.classList.add("is-active");
  }));

  confirm.addEventListener("click", () => {
    confirm.classList.add("is-pressed");
    success.classList.add("is-visible");
  });

  const observer = new IntersectionObserver(entries => {
    visible = Boolean(entries[0]?.isIntersecting);
    run += 1;
    cursor.classList.remove("is-visible");
    if (visible && !reduced) sequence(run);
    if (visible && reduced) show("agent");
  }, { threshold: .3 });

  observer.observe(browser);
})();