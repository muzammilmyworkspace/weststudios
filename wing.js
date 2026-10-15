/* Gallery side wings: a guided walk into the portfolio (left) or services (right) corridor. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const M = window.WorldMath, D = window.WESTSIDE_WINGS || {}, Z = -75;
  const LABEL = { portfolio: 'PORTFOLIO WING', services: 'SERVICES WING' };
  const root = document.documentElement;
  let wing = null, side = 1, K = [], P = [], t = 0, tt = 0, first = 0, exiting = false, mainP = 0, lastStep = 0, wheelAcc = 0;

  const state = () => (window.WestsideExperience ? window.WestsideExperience.getState() : null);
  const cam = (eye, target) => ({ eye: eye.slice(), target: target.slice() });
  const stops = (name) => {
    const w = D[name], s = w.side;
    const list = w.items.map((it, i) => ({ id: it.id, ...cam([s * (15 + 6 * i), 1.8, Z], [s * (15 + 6 * i), 3.0, i % 2 ? -69 : -81]) }));
    list.push({ id: w.end.id, ...cam([s * 57, 1.8, Z], [s * 66, 3.1, Z]) });
    return list;
  };
  const lerp = (a, b, f) => a.map((v, i) => v + (b[i] - v) * f);
  function now() {
    const i = Math.min(K.length - 1, Math.floor(t)), f = Math.min(1, t - i), b = K[Math.min(K.length - 1, i + 1)];
    return { eye: lerp(K[i].eye, b.eye, f), target: lerp(K[i].target, b.target, f) };
  }

  function lockScroll(on) {
    if (on) document.body.style.overflow = 'hidden';
    else if (!$$('dialog').some((d) => d.open)) document.body.style.overflow = '';
  }

  function enter(name) {
    const st = state();
    if (!st || st.phase !== 'explore' || wing || !D[name]) return;
    wing = name; side = D[name].side; mainP = st.current; exiting = false;
    const c = M.sample(mainP);
    const S = stops(name);
    K = [cam(c.eye, c.target), cam([0, 1.8, Z], [side * 20, 2.8, Z]), cam([side * 9.6, 1.8, Z], [side * 30, 2.8, Z]), ...S];
    P = ['', '', '', ...S.map((s) => s.id)];
    first = 3; t = 0; tt = first;
    lockScroll(true);
    root.classList.add('in-wing'); root.dataset.wing = name;
  }

  function exit(instant) {
    if (!wing) return;
    if (instant) { finish(); return; }
    if (exiting) return;
    const back = M.sample(mainP), cur = now();
    K = [cur, cam([side * 9.6, 1.8, Z], [0, 2.6, Z]), cam([0, 1.8, Z], back.target), cam(back.eye, back.target)];
    P = ['', '', '', '']; t = 0; tt = 3; exiting = true;
  }
  function finish() {
    wing = null; exiting = false;
    root.classList.remove('in-wing'); delete root.dataset.wing;
    lockScroll(false);
  }

  function step(d) {
    if (!wing || exiting) return;
    const n = tt + d;
    if (n < first) { exit(); return; }
    tt = Math.min(K.length - 1, n);
    lastStep = performance.now();
  }

  window.WestsideWing = {
    active: () => !!wing,
    moving: () => !!wing && Math.abs(tt - t) > 0.003,
    panel: () => {
      if (exiting) return '';
      const i = Math.abs(tt - t) < 0.5 ? tt : Math.round(t);
      return P[i] || '';
    },
    camera(dt) {
      const d = tt - t, sp = Math.max(Math.abs(d) * 2.3, 0.5) * dt;
      t += Math.sign(d) * Math.min(Math.abs(d), sp);
      if (exiting && Math.abs(tt - t) < 0.002) { const c = now(); finish(); return c; }
      return now();
    },
    enter, exit, step,
  };

  // ---- input while inside a wing ----
  addEventListener('wheel', (e) => {
    if (!wing) return;
    e.preventDefault();
    wheelAcc += e.deltaY + e.deltaX;
    if (Math.abs(wheelAcc) > 70 && performance.now() - lastStep > 700) { step(Math.sign(wheelAcc)); wheelAcc = 0; }
    clearTimeout(window.__wingWheel); window.__wingWheel = setTimeout(() => (wheelAcc = 0), 220);
  }, { passive: false });
  let touchY = null, touchX = null;
  addEventListener('touchstart', (e) => { if (!wing) return; touchY = e.touches[0].clientY; touchX = e.touches[0].clientX; }, { passive: true });
  addEventListener('touchmove', (e) => { if (wing) e.preventDefault(); }, { passive: false });
  addEventListener('touchend', (e) => {
    if (!wing || touchY === null) return;
    const dy = touchY - e.changedTouches[0].clientY, dx = touchX - e.changedTouches[0].clientX;
    const m = Math.abs(dy) > Math.abs(dx) ? dy : dx;
    if (Math.abs(m) > 45) step(Math.sign(m));
    touchY = null;
  }, { passive: true });
  addEventListener('keydown', (e) => {
    if (!wing || $$('dialog').some((d) => d.open)) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName || ''))) return;
    const k = e.key;
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(k)) { e.preventDefault(); e.stopImmediatePropagation(); step(1); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(k)) { e.preventDefault(); e.stopImmediatePropagation(); step(-1); }
    else if (k === 'Escape' || k === 'Home') { e.preventDefault(); e.stopImmediatePropagation(); exit(); }
  }, true);

  // ---- clicks (captured before the main app sees them) ----
  document.addEventListener('click', (e) => {
    const el = e.target.closest ? e.target : null;
    if (!el) return;
    const go = el.closest('.wing-go, .wing-switch');
    if (go) {
      e.preventDefault(); e.stopImmediatePropagation();
      if (wing) { exit(true); setTimeout(() => enter(go.dataset.wing), 30); } else enter(go.dataset.wing);
      return;
    }
    if (!wing) return;
    if (el.closest('.wing-back, .wing-back-btn')) { e.preventDefault(); e.stopImmediatePropagation(); exit(); return; }
    if (el.closest('#next-chapter') || el.closest('.wing-panel .ex-next')) { e.preventDefault(); e.stopImmediatePropagation(); step(1); return; }
    if (el.closest('#previous-chapter')) { e.preventDefault(); e.stopImmediatePropagation(); step(-1); return; }
    const start = el.closest('.wing-start');
    if (start) {
      e.preventDefault(); e.stopImmediatePropagation();
      const radio = $(`#project-form input[name=service][value="${start.dataset.service}"]`);
      if (radio) radio.checked = true;
      exit(true);
      window.WestsideExperience.jump('contact');
      setTimeout(() => { const b = $('#contact-open'); b && b.click(); }, 2600);
      return;
    }
    if (el.closest('[data-jump]')) exit(true);
  }, true);

  // ---- HUD: gallery doors, wing label ----
  function hud() {
    requestAnimationFrame(hud);
    const st = state();
    if (!st) return;
    const inGallery = !wing && st.phase === 'explore' && st.chapter === 'work' && !$$('dialog').some((d) => d.open);
    root.classList.toggle('in-gallery', inGallery);
    if (wing) {
      const lab = $('#chapter-label');
      if (lab && lab.textContent !== LABEL[wing]) lab.textContent = LABEL[wing];
      const i = Math.max(0, Math.round(tt) - first), n = K.length - first;
      const txt = exiting ? 'Returning to the gallery' : i >= n - 1 ? 'End of the wing' : `${wing === 'portfolio' ? 'Project' : 'Service'} ${String(i + 1).padStart(2, '0')} / ${String(n - 1).padStart(2, '0')}`;
      const h = $('.wing-hud-label');
      if (h.textContent !== txt) h.textContent = txt;
    }
  }
  requestAnimationFrame(hud);
})();
