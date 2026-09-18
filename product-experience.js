(() => {
  const section = document.getElementById("product");
  if (!section) return;

  section.classList.remove("is-pending");
  section.classList.add("product-experience");

  section.innerHTML = [
    '<div class="section-label">',
      '<div class="section-number">05</div>',
      '<h2>ЦИФРОВОЙ ПРОДУКТ</h2>',
      '<p>DIRECT AI</p>',
      '<span class="label-rule"></span>',
    '</div>',
    '<div class="section-content product-x-wrap">',
      '<div class="product-x-intro">',
        '<div><span class="product-x-kicker">DIRECT AI / DEMO MODE</span><h3>РАБОТА ИДЁТ.</h3></div>',
        '<div class="product-x-legend"><span><i></i> DEMO DATA</span><b>Яндекс Директ</b></div>',
      '</div>',
      '<div class="product-x-story"><span id="px-step">01 / OVERVIEW</span><strong id="px-title">КАБИНЕТ ВИДЕН СРАЗУ: РАСХОД, ТРАФИК, КОНВЕРСИИ.</strong></div>',
      '<div class="product-x-stage">',
        '<div class="px-browser">',
          '<div class="px-top">',
            '<div class="px-brand"><strong>Direct AI</strong><span><i></i> DEMO DATA</span></div>',
            '<nav class="px-nav"><button data-scene="overview" class="is-active">Сводка</button><button data-scene="campaigns">Кампании</button><button data-scene="analysis">AI-анализ</button></nav>',
            '<span class="px-status">Агент активен</span>',
          '</div>',
          '<div class="px-viewport">',
            '<section class="px-scene is-active" data-scene-panel="overview">',
              '<div class="px-head"><div><span>СВОДКА · ПОСЛЕДНИЕ 7 ДНЕЙ</span><h4>Реклама под контролем</h4><p>Агент сверяет динамику, ищет отклонения и формирует действия.</p></div><div class="px-live"><i></i> Анализ обновлён 2 мин назад</div></div>',
              '<div class="px-kpis">',
                '<article><span>Расход</span><strong>86 420 ₽</strong><em>+4.8%</em></article>',
                '<article><span>Клики</span><strong>1 284</strong><em>+9.2%</em></article>',
                '<article><span>Конверсии</span><strong>67</strong><em>+14.6%</em></article>',
                '<article><span>CPA</span><strong>1 290 ₽</strong><em class="good">−8.5%</em></article>',
              '</div>',
              '<div class="px-grid">',
                '<div class="px-chart-card"><div class="px-card-head"><span>ДИНАМИКА РАСХОДА И КОНВЕРСИЙ</span><b>7 дней</b></div><div class="px-chart" aria-hidden="true"><span style="--h:38%"></span><span style="--h:52%"></span><span style="--h:45%"></span><span style="--h:69%"></span><span style="--h:58%"></span><span style="--h:78%"></span><span style="--h:72%"></span></div></div>',
                '<div class="px-agent-card"><span>AI STATUS</span><strong>7 действий готовы</strong><p>18 проблемных сигналов проверены. 7 рекомендаций имеют достаточную доказательную базу.</p><div class="px-agent-feed"><b>04:21</b><span>1 248 запросов проанализировано</span><b>04:22</b><span>18 отклонений найдено</span><b>04:22</b><span>7 действий сформировано</span></div></div>',
              '</div>',
            '</section>',
            '<section class="px-scene" data-scene-panel="campaigns">',
              '<div class="px-head"><div><span>АКТИВНЫЕ КАМПАНИИ</span><h4>Кампании</h4><p>Фактическое состояние и эффективность по каждой группе.</p></div><div class="px-live"><i></i> 3 работают</div></div>',
              '<div class="px-campaigns">',
                '<article><div><span>Поиск | Основная</span><small>SEARCH · ACTIVE</small></div><strong>48 320 ₽</strong><b>37 конв.</b><em>CPA 1 306 ₽</em></article>',
                '<article><div><span>Поиск | Горячий спрос</span><small>SEARCH · ACTIVE</small></div><strong>26 780 ₽</strong><b>24 конв.</b><em>CPA 1 116 ₽</em></article>',
                '<article><div><span>Ретаргетинг</span><small>RETARGET · ACTIVE</small></div><strong>11 320 ₽</strong><b>6 конв.</b><em>CPA 1 887 ₽</em></article>',
              '</div>',
              '<div class="px-summary-strip"><span>ЛУЧШАЯ ДИНАМИКА</span><strong>Горячий спрос</strong><b>CPA −12.4% за период</b></div>',
            '</section>',
            '<section class="px-scene" data-scene-panel="analysis">',
              '<div class="px-head"><div><span>AI ANALYSIS</span><h4>18 сигналов → 7 действий</h4><p>Агент не предлагает изменение без конкретной причины и источника.</p></div><div class="px-live"><i></i> Проверка завершена</div></div>',
              '<div class="px-analysis-grid">',
                '<article class="px-problem"><span>ВЫСОКИЙ РАСХОД БЕЗ КОНВЕРСИЙ</span><h5>«фотограф недорого»</h5><div><b>31 клик</b><b>4 870 ₽ расхода</b><b>0 конверсий</b></div><p>Запрос стабильно расходует бюджет и не даёт бизнес-результата в двух сравниваемых периодах.</p></article>',
                '<article class="px-action"><span>РЕКОМЕНДАЦИЯ</span><h5>Добавить в минус-слова</h5><p>Исключить запрос из показов после подтверждения.</p><div class="px-impact"><small>POTENTIAL MONTHLY SAVING</small><strong>≈ 6 200 ₽</strong></div><button type="button">Подтвердить действие</button></article>',
              '</div>',
              '<div class="px-final-line"><span>DATA</span><i>→</i><span>ANALYSIS</span><i>→</i><span>DECISION</span><i>→</i><strong>ACTION</strong></div>',
            '</section>',
          '</div>',
        '</div>',
      '</div>',
      '<div class="product-x-caption"><strong>DIRECT AI</strong><span>PRODUCT / UX / FRONTEND / BACKEND / AI / YANDEX DIRECT API</span></div>',
    '</div>'
  ].join("");

  const scenes = ["overview","campaigns","analysis"];
  const nav = [...section.querySelectorAll("[data-scene]")];
  const panels = [...section.querySelectorAll("[data-scene-panel]")];
  const step = section.querySelector("#px-step");
  const title = section.querySelector("#px-title");
  const stage = section.querySelector(".product-x-stage");
  const copy = {
    overview:["01 / OVERVIEW","КАБИНЕТ ВИДЕН СРАЗУ: РАСХОД, ТРАФИК, КОНВЕРСИИ."],
    campaigns:["02 / CAMPAIGNS","НЕ ПУСТЫЕ ЭКРАНЫ — ЖИВОЕ СОСТОЯНИЕ КАМПАНИЙ."],
    analysis:["03 / AI ANALYSIS","АГЕНТ НАХОДИТ ПРОБЛЕМУ И ДОВОДИТ ЕЁ ДО КОНКРЕТНОГО ДЕЙСТВИЯ."]
  };

  function show(name) {
    nav.forEach((x) => x.classList.toggle("is-active", x.dataset.scene === name));
    panels.forEach((x) => x.classList.toggle("is-active", x.dataset.scenePanel === name));
    step.textContent = copy[name][0];
    title.textContent = copy[name][1];
  }
  nav.forEach((x) => x.addEventListener("click", () => show(x.dataset.scene)));

  let ticking = false;
  function sync() {
    ticking = false;
    const r = stage.getBoundingClientRect();
    const vh = window.innerHeight || 800;
    const p = Math.max(0, Math.min(1, (vh * .78 - r.top) / Math.max(vh * 1.25, r.height)));
    const idx = p < .34 ? 0 : p < .69 ? 1 : 2;
    show(scenes[idx]);
    const scale = .94 + Math.min(1, p * 1.35) * .06;
    stage.style.setProperty("--px-scale", scale.toFixed(4));
  }
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(sync); } }, {passive:true});
  window.addEventListener("resize", sync, {passive:true});
  sync();
})();