(() => {
  const section = document.getElementById("product");
  if (!section) return;

  section.classList.remove("is-pending", "product-showcase");
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
                '<button type="button" data-dai-nav="overview" class="is-active">Сводка</button>',
                '<button type="button" data-dai-nav="campaigns">Кампании</button>',
                '<button type="button" data-dai-nav="agent">Агент</button>',
                '<button type="button" data-dai-nav="decisions">Решения</button>',
              '</nav>',
              '<div class="dai-appstatus"><i></i>Яндекс Директ подключен</div>',
            '</header>',
            '<main class="dai-workspace">',
              '<section class="dai-page is-active" data-dai-page="overview">',
                '<div class="dai-page-head"><div><span>ПОСЛЕДНИЕ 7 ДНЕЙ</span><h3>Сводка</h3><p>Ключевые показатели и состояние рекламы.</p></div><div class="dai-live"><i></i>обновлено сейчас</div></div>',
                '<div class="dai-kpis">',
                  '<article><span>Расход</span><strong>86 420 ₽</strong><em>+4.8%</em></article>',
                  '<article><span>Клики</span><strong>1 284</strong><em>+9.2%</em></article>',
                  '<article><span>Конверсии</span><strong>67</strong><em>+14.6%</em></article>',
                  '<article><span>CPA</span><strong>1 290 ₽</strong><em class="good">−8.5%</em></article>',
                '</div>',
                '<div class="dai-overview">',
                  '<article class="dai-panel dai-chart-panel"><div class="dai-panel-head"><span>Расход и конверсии</span><b>7 дней</b></div><div class="dai-chart" aria-hidden="true"><i style="--h:42%"></i><i style="--h:55%"></i><i style="--h:48%"></i><i style="--h:68%"></i><i style="--h:61%"></i><i style="--h:80%"></i><i style="--h:73%"></i></div></article>',
                  '<article class="dai-panel dai-ai-panel"><span>AI РАБОТАЕТ</span><strong>7 действий готовы</strong><div><b>1 248</b><small>запросов проверено</small></div><div><b>18</b><small>отклонений найдено</small></div><div><b>7</b><small>решений сформировано</small></div></article>',
                '</div>',
              '</section>',
              '<section class="dai-page" data-dai-page="campaigns">',
                '<div class="dai-page-head"><div><span>РЕКЛАМНЫЙ КАБИНЕТ</span><h3>Кампании</h3><p>Фактическое состояние и эффективность.</p></div><div class="dai-live"><i></i>3 активны</div></div>',
                '<div class="dai-table">',
                  '<div class="dai-row dai-row-head"><span>Кампания</span><span>Расход</span><span>Конверсии</span><span>CPA</span><span>Динамика</span></div>',
                  '<div class="dai-row"><span><strong>Поиск | Основная</strong><small>SEARCH · ACTIVE</small></span><span>48 320 ₽</span><span>37</span><span>1 306 ₽</span><span class="positive">−6.4%</span></div>',
                  '<div class="dai-row"><span><strong>Поиск | Горячий спрос</strong><small>SEARCH · ACTIVE</small></span><span>26 780 ₽</span><span>24</span><span>1 116 ₽</span><span class="positive">−12.4%</span></div>',
                  '<div class="dai-row is-alert"><span><strong>Ретаргетинг</strong><small>RETARGET · ACTIVE</small></span><span>11 320 ₽</span><span>6</span><span>1 887 ₽</span><span class="negative">+9.8%</span></div>',
                '</div>',
                '<div class="dai-alert"><span>AI ЗАМЕТИЛ</span><strong>В ретаргетинге CPA растёт второй период подряд</strong><button type="button" data-dai-nav="agent">Разобрать →</button></div>',
              '</section>',
              '<section class="dai-page" data-dai-page="agent">',
                '<div class="dai-agent">',
                  '<aside><span>AI AGENT</span><h3>Разбор рекламы</h3><p>Задача ставится обычным языком. Агент сам поднимает данные и проверяет причины.</p><div class="dai-agent-pills"><i>Кампании</i><i>Запросы</i><i>Периоды</i><i>Конверсии</i></div></aside>',
                  '<div class="dai-chat"><div class="dai-chat-history"><div class="dai-user-bubble"><span class="dai-prompt-text"></span><i class="dai-typing-caret"></i></div><div class="dai-analysis-line"><i></i><span>Проверяю кампанию, поисковые запросы и два периода…</span></div><div class="dai-agent-answer"><small>НАШЁЛ ПРИЧИНУ</small><strong>31 клик ушёл в запрос без конверсий</strong><p>Запрос «фотограф недорого» потратил 4 870 ₽ и не дал ни одной конверсии. Картина повторяется второй период.</p><button type="button" data-dai-nav="decisions">Показать решение</button></div></div><div class="dai-composer"><span>Спросить агента…</span><b>↑</b></div></div>',
                '</div>',
              '</section>',
              '<section class="dai-page" data-dai-page="decisions">',
                '<div class="dai-page-head"><div><span>РЕШЕНИЯ</span><h3>Действие готово</h3><p>Изменение применяется только после подтверждения.</p></div></div>',
                '<div class="dai-decision-grid">',
                  '<article class="dai-decision-problem"><span>ПРОБЛЕМА</span><h4>«фотограф недорого»</h4><div class="dai-facts"><b>31 клик</b><b>4 870 ₽ расхода</b><b>0 конверсий</b></div><p>Запрос стабильно расходует бюджет без результата.</p></article>',
                  '<article class="dai-decision-action"><span>РЕКОМЕНДАЦИЯ</span><h4>Добавить в минус-слова</h4><p>Исключить запрос из показов.</p><div class="dai-saving"><small>Потенциальная экономия / месяц</small><strong>≈ 6 200 ₽</strong></div><button class="dai-confirm" type="button">Подтвердить действие</button><div class="dai-success"><i>✓</i><span>Действие подготовлено</span></div></article>',
                '</div>',
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
  const prompt = section.querySelector(".dai-prompt-text");
  const caret = section.querySelector(".dai-typing-caret");
  const analysis = section.querySelector(".dai-analysis-line");
  const answer = section.querySelector(".dai-agent-answer");
  const confirm = section.querySelector(".dai-confirm");
  const success = section.querySelector(".dai-success");
  if (!browser || !stage || !canvas || !cursor || !prompt || !analysis || !answer || !confirm || !success) return;

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

  function resetAgent() {
    prompt.textContent = "";
    caret.classList.remove("is-visible");
    analysis.classList.remove("is-visible");
    answer.classList.remove("is-visible");
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
    const x = (r.left - c.left + r.width * .68) / scale;
    const y = (r.top - c.top + r.height * .62) / scale;
    cursor.style.transform = "translate3d(" + x + "px," + y + "px,0)";
    cursor.classList.add("is-visible");
  }

  function clickCursor() {
    cursor.classList.remove("is-clicking");
    void cursor.offsetWidth;
    cursor.classList.add("is-clicking");
  }

  async function clickTarget(name, token) {
    const el = allTargets.find(x => x.dataset.daiNav === name);
    moveCursorTo(el);
    if (!(await sleep(650, token))) return false;
    clickCursor();
    if (!(await sleep(260, token))) return false;
    show(name);
    return true;
  }

  async function typePrompt(token) {
    const text = "Почему растёт CPA в ретаргетинге?";
    caret.classList.add("is-visible");
    for (let i = 0; i <= text.length; i += 1) {
      if (!visible || token !== run) return false;
      prompt.textContent = text.slice(0, i);
      await new Promise(r => setTimeout(r, 32));
    }
    caret.classList.remove("is-visible");
    return true;
  }

  async function sequence(token) {
    show("overview");
    cursor.classList.remove("is-visible");
    if (!(await sleep(1800, token))) return;
    if (!(await clickTarget("campaigns", token))) return;
    if (!(await sleep(2100, token))) return;

    const alertButton = section.querySelector('.dai-alert [data-dai-nav="agent"]');
    moveCursorTo(alertButton);
    if (!(await sleep(550, token))) return;
    clickCursor();
    if (!(await sleep(240, token))) return;
    show("agent");
    if (!(await sleep(600, token))) return;

    if (!(await typePrompt(token))) return;
    if (!(await sleep(400, token))) return;
    analysis.classList.add("is-visible");
    if (!(await sleep(1100, token))) return;
    answer.classList.add("is-visible");
    if (!(await sleep(1900, token))) return;

    const solutionButton = section.querySelector('.dai-agent-answer [data-dai-nav="decisions"]');
    moveCursorTo(solutionButton);
    if (!(await sleep(550, token))) return;
    clickCursor();
    if (!(await sleep(240, token))) return;
    show("decisions");
    if (!(await sleep(1300, token))) return;

    moveCursorTo(confirm);
    if (!(await sleep(550, token))) return;
    clickCursor();
    confirm.classList.add("is-pressed");
    success.classList.add("is-visible");
    if (!(await sleep(2200, token))) return;

    if (visible && token === run) sequence(token);
  }

  allTargets.forEach(button => button.addEventListener("click", () => {
    run += 1;
    show(button.dataset.daiNav);
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
    if (visible && reduced) show("overview");
  }, { threshold: .35 });

  observer.observe(browser);
})();