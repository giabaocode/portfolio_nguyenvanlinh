(() => {
  const art = document.querySelector('.hero-art');
  const stage = art?.querySelector('.flower-stage');
  if (!stage) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let frame = 0;
  function reset() {
    cancelAnimationFrame(frame);
    stage.style.removeProperty('--tilt-x');
    stage.style.removeProperty('--tilt-y');
  }
  art.addEventListener('pointermove', event => {
    if (motion.matches || !pointer.matches || document.hidden || document.body.matches('.motion-paused,.modal-open')) {
      reset();
      return;
    }
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const box = art.getBoundingClientRect();
      const x = Math.max(-.5, Math.min(.5, (event.clientX - box.left) / box.width - .5));
      const y = Math.max(-.5, Math.min(.5, (event.clientY - box.top) / box.height - .5));
      stage.style.setProperty('--tilt-x', `${-y * 8}deg`);
      stage.style.setProperty('--tilt-y', `${x * 8}deg`);
    });
  });
  art.addEventListener('pointerleave', reset);
  motion.addEventListener('change', reset);
  pointer.addEventListener('change', reset);
  document.addEventListener('visibilitychange', reset);
  document.querySelector('#motion-toggle')?.addEventListener('click', reset);
})();
