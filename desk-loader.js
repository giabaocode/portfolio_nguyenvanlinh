(() => {
  const stage = document.querySelector('.desk-stage');
  if (!stage) return;
  let started = false;
  async function load() {
    if (started) return;
    started = true;
    stage.dataset.scene = 'loading';
    try {
      const { initDesk } = await import('./desk3d.js?v=studio-1');
      await initDesk(stage);
    } catch {
      stage.dataset.scene = 'fallback';
      stage.classList.remove('is-3d');
      stage.querySelector('.desk-canvas-host')?.replaceChildren();
      stage.querySelectorAll('.desk-item').forEach(el=>el.style.removeProperty('display'));
      const controls=stage.querySelector('.scene-controls');
      if(controls)controls.hidden=true;
    }
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); load(); }
    }, {rootMargin:'300px'});
    observer.observe(stage);
  } else load();
})();
