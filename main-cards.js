/* Main-journey cards: the hero project deck, word slot and stat count-up. */
(function () {
  const hero = document.querySelector('#hero');
  const deck = hero && hero.querySelector('.deck');
  if (!deck) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wins = [...deck.querySelectorAll('.win')], bars = [...deck.querySelectorAll('.sl-bars i')];
  const stack = deck.querySelector('.dk-stack'), name = deck.querySelector('.dk-name'), num = deck.querySelector('.dk-num b');
  const N = wins.length, DUR = 4200;
  let i = 0, t0 = performance.now(), paused = false, busy = false;

  const layout = (skip) => wins.forEach((w, k) => { if (w !== skip) w.dataset.pos = String((k - i + N) % N); });
  const caption = () => {
    const w = wins[i];
    name.innerHTML = `<b>${w.dataset.name}</b><small>${w.dataset.cat}</small>`;
    name.classList.remove('swap'); void name.offsetWidth; name.classList.add('swap');
    num.textContent = String(i + 1).padStart(2, '0');
    bars.forEach((b, k) => { b.classList.toggle('on', k === i); b.classList.toggle('done', k < i); b.style.removeProperty('--p'); });
    t0 = performance.now();
  };
  const snap = (w, pos) => { w.classList.add('snap'); w.dataset.pos = pos; void w.offsetWidth; w.classList.remove('snap'); };

  function go(n) {
    if (busy || n === i) return;
    busy = true;
    const fwd = n === (i + 1) % N || (n > i && n !== (i - 1 + N) % N);
    const old = wins[i];
    if (fwd) {
      old.dataset.pos = 'out';
      i = (n + N) % N; layout(old); caption();
      setTimeout(() => { snap(old, String((wins.indexOf(old) - i + N) % N)); busy = false; }, 850);
    } else {
      i = (n + N) % N;
      snap(wins[i], 'out');
      layout(); caption();
      setTimeout(() => (busy = false), 850);
    }
  }

  deck.querySelector('.dk-next').addEventListener('click', () => go((i + 1) % N));
  deck.querySelector('.dk-prev').addEventListener('click', () => go((i - 1 + N) % N));
  bars.forEach((b, n) => b.addEventListener('click', () => go(n)));
  wins.forEach((w) => w.addEventListener('click', () => { if (w.dataset.pos !== '0') go(wins.indexOf(w)); }));

  stack.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = stack.getBoundingClientRect();
    stack.style.setProperty('--ry', ((e.clientX - r.left) / r.width - 0.5) * 8 + 'deg');
    stack.style.setProperty('--rx', -((e.clientY - r.top) / r.height - 0.5) * 6 + 'deg');
  });
  deck.addEventListener('pointerenter', () => (paused = true));
  deck.addEventListener('pointerleave', () => {
    paused = false; stack.style.setProperty('--rx', '0deg'); stack.style.setProperty('--ry', '0deg');
    t0 = performance.now() - (parseFloat(bars[i].style.getPropertyValue('--p')) || 0) * DUR;
  });

  function tick(now) {
    requestAnimationFrame(tick);
    if (paused || reduced || !hero.classList.contains('is-active')) { if (!paused) t0 = now - (parseFloat(bars[i].style.getPropertyValue('--p')) || 0) * DUR; return; }
    const p = Math.min(1, (now - t0) / DUR);
    bars[i].style.setProperty('--p', p.toFixed(3));
    if (p >= 1) go((i + 1) % N);
  }
  layout();
  requestAnimationFrame(tick);

  /* word slot: brands. → campaigns. → growth. → experiences. (last row repeats the first for a seamless loop) */
  const track = hero.querySelector('.wtrack');
  if (track && !reduced) {
    const rows = track.children.length; let w = 0;
    setInterval(() => {
      if (!hero.classList.contains('is-active') || document.hidden) return;
      w++;
      track.style.transform = `translateY(${-w}em)`;
      if (w === rows - 1) setTimeout(() => { track.classList.add('snap'); track.style.transform = 'translateY(0)'; void track.offsetWidth; track.classList.remove('snap'); w = 0; }, 850);
    }, 2600);
  }

  /* stats count up each time the arrival card becomes active */
  const counts = [...hero.querySelectorAll('.hero-stats b')];
  let was = false;
  const countUp = () => counts.forEach((b) => {
    const to = +b.dataset.count, s = performance.now();
    const step = (now) => { const q = Math.min(1, (now - s) / 1400); b.textContent = Math.round(to * (1 - Math.pow(1 - q, 3))); if (q < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });
  new MutationObserver(() => {
    const on = hero.classList.contains('is-active');
    if (on && !was && !reduced) countUp();
    was = on;
  }).observe(hero, { attributes: true, attributeFilter: ['class'] });
})();

/* Wall-mounted cards fill the exact frame world.js builds from their data-size. */
document.querySelectorAll('.world-panel[data-mount],.wing-panel').forEach((el) => {
  const s = el.dataset.size.split(',').map(Number);
  el.style.setProperty('--fit-r', String(s[1] / s[0]));
});

/* Portfolio exhibits: show the whole landscape screenshot in a browser window instead of a centre crop. */
document.querySelectorAll('.wing-panel[id^="pf-"] .ex-frame').forEach((f) => {
  const art = f.querySelector('.gallery-art'), name = f.closest('.ex').querySelector('h2');
  if (!art) return;
  const shot = document.createElement('div');
  shot.className = 'ex-shot';
  shot.setAttribute('aria-hidden', 'true');
  shot.innerHTML = '<div class="win-bar"><i></i><i></i><i></i><span></span></div><div class="ex-shot-img"></div>';
  shot.querySelector('span').textContent = name ? name.textContent : '';
  shot.querySelector('.ex-shot-img').style.backgroundImage = art.style.backgroundImage;
  art.after(shot);
  f.classList.add('has-shot');
});
