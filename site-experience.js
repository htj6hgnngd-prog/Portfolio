(() => {
  const section = document.getElementById("site");
  if (!section) return;
  section.classList.remove("is-pending");
  section.classList.add("site-experience");
  section.innerHTML = [
    '<div class="section-label"><div class="section-number">06</div><h2>ВЕБ-РАЗРАБОТКА</h2><p>DENISOV PHOTO</p><span class="label-rule"></span></div>',
    '<div class="section-content site-x-wrap">',
      '<div class="site-x-head"><div><span>REAL WEBSITE / DESKTOP EXPERIENCE</span><h3>DENISOV PHOTO</h3></div><a href="https://denisovphoto.ru/" target="_blank" rel="noreferrer">OPEN LIVE ↗</a></div>',
      '<div class="site-x-story"><span>SCROLL TO EXPLORE</span><strong>САЙТ ПОКАЗАН КАК САЙТ — НЕ КАК СТАТИЧНЫЙ MOCKUP.</strong></div>',
      '<div class="site-x-stage">',
        '<div class="site-x-browser">',
          '<div class="site-x-bar"><span class="site-x-dots"><i></i><i></i><i></i></span><span>denisovphoto.ru</span><b>LIVE SITE</b></div>',
          '<a class="site-x-screen" href="https://denisovphoto.ru/" target="_blank" rel="noreferrer">',
            '<img src="/assets/site-case/denisovphoto-desktop.png?v=1" alt="Denisov Photo website">',
            '<span class="site-x-shade"></span><span class="site-x-progress"><i></i></span>',
          '</a>',
        '</div>',
      '</div>',
      '<div class="site-x-foot"><span>DESKTOP / STRUCTURE / UX / VISUAL / BUILD</span><strong>DENISOVPHOTO.RU ↗</strong></div>',
    '</div>'
  ].join("");

  const stage = section.querySelector(".site-x-stage");
  const browser = section.querySelector(".site-x-browser");
  const screen = section.querySelector(".site-x-screen");
  const img = section.querySelector(".site-x-screen img");
  const progress = section.querySelector(".site-x-progress i");
  let ticking = false;

  function sync() {
    ticking = false;
    if (!img.complete || !img.naturalHeight) return;
    const r = stage.getBoundingClientRect();
    const vh = window.innerHeight || 800;
    const p = Math.max(0, Math.min(1, (vh * .82 - r.top) / Math.max(vh * 1.65, r.height)));
    const travel = Math.max(0, img.getBoundingClientRect().height - screen.clientHeight);
    img.style.transform = "translate3d(0," + (-travel * p) + "px,0)";
    progress.style.transform = "scaleY(" + p + ")";
    const morph = Math.max(0, Math.min(1, (p - .58) / .42));
    browser.style.setProperty("--site-radius", (16 - 16 * morph) + "px");
    browser.style.setProperty("--site-shadow", (1 - morph).toFixed(3));
    browser.style.setProperty("--site-scale", (0.965 + p * .035).toFixed(4));
  }

  window.addEventListener("scroll",()=>{if(!ticking){ticking=true;requestAnimationFrame(sync)}},{passive:true});
  window.addEventListener("resize",sync,{passive:true});
  img.addEventListener("load",sync,{once:true});
  sync();
})();