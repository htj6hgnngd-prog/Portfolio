(() => {
  const loaded = new Set();

  function loadStyle(href) {
    const existing = document.querySelector(`link[href^="${href.split("?")[0]}"]`);
    if (existing) return Promise.resolve();
    return new Promise((resolve) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.onload = resolve;
      link.onerror = resolve;
      document.head.appendChild(link);
    });
  }

  function near(id, distance, task) {
    const target = document.getElementById(id);
    if (!target || loaded.has(id)) return;

    const run = async () => {
      if (loaded.has(id)) return;
      loaded.add(id);
      try { await task(); } catch (error) { console.error(`${id} section failed to load`, error); }
    };

    if (!("IntersectionObserver" in window)) {
      run();
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      run();
    }, { rootMargin: `${distance}px 0px`, threshold: 0 });

    observer.observe(target);
  }

  near("photo", 1200, () => import("/photo-gallery.js?v=6"));
  near("product", 1700, async () => {
    await loadStyle("/product-demo.css?v=5");
    await import("/product-demo.js?v=6");
  });
  near("site", 1900, async () => {
    await loadStyle("/site-case.css?v=5");
    await import("/site-case.js?v=5");
  });
})();
