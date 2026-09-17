(() => {
  const viewer = document.getElementById("viewer");
  if (!viewer) return;

  // Replace the fixed-body scroll lock with overflow locking. This keeps the
  // document at exactly the same scroll position on iOS and avoids the jump
  // to the top that previously happened while the backdrop tap was closing.
  lockViewerScroll = function () {
    if (viewerScrollY !== null) return;
    viewerScrollY = window.scrollY;
    document.documentElement.classList.add("modal-open");
    document.body.classList.add("modal-open");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  };

  unlockViewerScroll = function () {
    const y = viewerScrollY;
    viewerScrollY = null;

    document.documentElement.classList.remove("modal-open");
    document.body.classList.remove("modal-open");
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";

    if (y !== null && Math.abs(window.scrollY - y) > 1) {
      requestAnimationFrame(() => window.scrollTo(0, y));
    }
  };

  const isViewerInteractiveTarget = (target) =>
    target instanceof Element &&
    Boolean(target.closest(".viewer-header, .viewer-frame, .viewer-controls"));

  // Important: do NOT close on pointerdown. On iOS that removed the overlay
  // before the following click was dispatched, so the same tap could hit the
  // YouTube card underneath. Block that old pointerdown handler in capture.
  viewer.addEventListener(
    "pointerdown",
    (event) => {
      if (!isViewerInteractiveTarget(event.target)) {
        event.stopImmediatePropagation();
      }
    },
    true
  );

  // Close only on the completed click. The click has already been targeted at
  // the overlay, so removing it here cannot click through to the page below.
  viewer.addEventListener(
    "click",
    (event) => {
      if (isViewerInteractiveTarget(event.target)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      resetViewer();
    },
    true
  );
})();
