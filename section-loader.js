(() => {
  const loaded = new Set();

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

  near("photo", 600, () => import("/photo-gallery.js?v=7"));
})();