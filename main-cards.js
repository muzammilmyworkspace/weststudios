/* Main-journey cards: the hero work slider. */
(function () {
  const slider = document.querySelector('#hero .slider');
  if (!slider) return;
  const slides = [...slider.querySelectorAll('.sl')], bars = [...slider.querySelectorAll('.sl-bars i')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let i = 0, t0 = performance.now(), paused = false;
  const DUR = 3800;
  const show = (n) => {
    slides[i].classList.remove('on'); bars[i].classList.remove('on'); bars[i].classList.add('done');
    i = (n + slides.length) % slides.length;
    if (i === 0) bars.forEach((b) => b.classList.remove('done'));
    slides[i].classList.add('on'); bars[i].classList.add('on'); t0 = performance.now();
  };
  bars.forEach((b, n) => { b.addEventListener('click', () => { bars.forEach((x, k) => x.classList.toggle('done', k < n)); show(n); }); });
  slider.addEventListener('pointerenter', () => (paused = true));
  slider.addEventListener('pointerleave', () => { paused = false; t0 = performance.now() - (parseFloat(bars[i].style.getPropertyValue('--p')) || 0) * DUR; });
  function tick(now) {
    requestAnimationFrame(tick);
    if (paused || reduced) return;
    const p = Math.min(1, (now - t0) / DUR);
    bars[i].style.setProperty('--p', p.toFixed(3));
    if (p >= 1) show(i + 1);
  }
  requestAnimationFrame(tick);
})();
