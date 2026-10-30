(() => {
  const field = document.querySelector('.petal-field');
  const button = document.querySelector('#motion-toggle');
  if (!field || !button) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let userPaused = null;

  // Place petals mostly along the margins. No timers, canvas, or pointer tracking.
  const positions = [3, 94, 88, 7, 97, 12, 83, 1, 91, 46];
  const fragment = document.createDocumentFragment();
  positions.forEach((left, index) => {
    const petal = document.createElement('span');
    petal.className = 'falling-petal';
    const values = {
      '--left': `${left}%`, '--size': `${12 + index % 4 * 3}px`,
      '--duration': `${25 + index % 5 * 3}s`, '--delay': `${-index * 4.7 - 2}s`,
      '--sway': `${index % 2 === 0 ? 18 : -24}px`,
      '--opacity': `${index === 9 ? .09 : .16 + index % 3 * .035}`,
      '--rotation': `${index * 37 - 70}deg`, '--sway-duration': `${5 + index % 4}s`,
    };
    Object.entries(values).forEach(([name, value]) => petal.style.setProperty(name, value));
    const shape = document.createElement('span');
    shape.className = 'petal-shape';
    petal.append(shape);
    fragment.append(petal);
  });
  field.replaceChildren(fragment);

  function applyMotion() {
    const paused = reduceMotion.matches || userPaused === true;
    document.body.classList.toggle('motion-paused', paused);
    document.body.classList.toggle('tab-hidden', document.hidden);
    button.setAttribute('aria-pressed', String(paused));
    button.disabled = reduceMotion.matches;
    const icon = document.createElement('span');
    icon.setAttribute('aria-hidden', 'true');
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 16 16');
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('fill','currentColor');
    path.setAttribute('d',paused ? 'M4 2v12l9-6Z' : 'M4 2h3v12H4Zm5 0h3v12H9Z');
    svg.append(path); icon.append(svg);
    const label = document.createElement('span');
    label.textContent = reduceMotion.matches ? 'Giảm chuyển động' : paused ? 'Đã tạm dừng' : 'Chuyển động';
    button.setAttribute('aria-label', reduceMotion.matches ? 'Chuyển động đã tắt theo cài đặt thiết bị' : paused ? 'Tiếp tục chuyển động hoa và cánh hoa rơi' : 'Tạm dừng chuyển động hoa và cánh hoa rơi');
    button.replaceChildren(icon, label);
  }
  button.addEventListener('click', () => {
    userPaused = !document.body.classList.contains('motion-paused');
    applyMotion();
  });
  reduceMotion.addEventListener('change', applyMotion);
  document.addEventListener('visibilitychange', applyMotion);
  applyMotion();
})();
