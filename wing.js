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
    const list = w.items.map((it) => ({ id: it.id, ...cam([it.x, 1.8, -82.6], [it.x, 3.1, -89]) }));
    list.push({ id: w.end.id, ...cam([w.end.x, 1.8, -82.6], [w.end.x, 3.1, -89]) });
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
    K = [cam(c.eye, c.target), cam([0, 1.8, Z], [side * 20, 2.6, -78]), cam([side * 9.6, 1.8, -76], [side * 24, 2.8, -86]), ...S];
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
    K = [cur, cam([side * 12, 1.8, -78], [0, 2.6, -75]), cam([side * 9.6, 1.8, -76], [0, 2.6, Z]), cam([0, 1.8, Z], back.target), cam(back.eye, back.target)];
    P = ['', '', '', '', '']; t = 0; tt = 4; exiting = true;
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
      const i = Math.round(t);
      return P[i] || '';
    },
    camera(dt) {
      const d = tt - t, sp = Math.max(Math.abs(d) * 1.6, 0.35) * dt;
      t += Math.sign(d) * Math.min(Math.abs(d), sp);
      if (exiting && Math.abs(tt - t) < 0.002) { const c = now(); finish(); return c; }
      return now();
    },
    enter, exit, step,
  };

  // ---- input while inside a wing ----
  let snapTimer = 0;
  addEventListener('wheel', (e) => {
    if (!wing) return;
    e.preventDefault();
    if (exiting) return;
    const d = (e.deltaY + e.deltaX) * (e.deltaMode === 1 ? 0.06 : 0.0022);
    tt = Math.min(K.length - 1, Math.max(first - 0.4, tt + d));
    clearTimeout(snapTimer);
    snapTimer = setTimeout(() => { if (!wing || exiting) return; if (tt < first - 0.3) { exit(); return; } tt = Math.max(first, Math.round(tt)); }, 420);
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
    const go = el.closest('.wing-go, .wing-switch, .wing-link');
    if (go) {
      e.preventDefault(); e.stopImmediatePropagation();
      if (go.classList.contains('from-menu')) {
        $$('dialog').forEach((d) => d.open && d.close());
        if (wing) exit(true);
        const st = state();
        const there = st && st.phase === 'explore' && st.chapter === 'work' && Math.abs(st.current - st.target) < 0.002;
        if (there) enter(go.dataset.wing);
        else { window.WestsideExperience.jump('work'); waitThen(() => enter(go.dataset.wing)); }
        return;
      }
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

  // wait until the camera has arrived in the gallery, then run fn
  function waitThen(fn) {
    const t0 = performance.now();
    const tick = () => {
      const st = state();
      if (st && st.phase === 'explore' && st.chapter === 'work' && Math.abs(st.current - st.target) < 0.002) return fn();
      if (performance.now() - t0 < 8000) requestAnimationFrame(tick);
    };
    setTimeout(tick, 400);
  }


  // ---- the doorways themselves: projected labels + click to enter ----
  const DOORS = { portfolio: -1, services: 1 };
  const tags = {};
  Object.keys(DOORS).forEach((name) => {
    const el = document.createElement('button');
    el.className = 'door-tag'; el.dataset.wing = name;
    el.innerHTML = DOORS[name] < 0 ? '<i>←</i><span><small>Enter</small>Portfolio</span>' : '<span><small>Enter</small>Services</span><i>→</i>';
    el.addEventListener('click', (e) => { e.stopPropagation(); enter(name); });
    document.body.appendChild(el); tags[name] = el;
  });
  function viewProj(p) {
    const c = M.sample(p), a = innerWidth / innerHeight;
    return M.mul(M.perspective(M.fov(a), a), M.lookAt(c.eye, c.target));
  }
  function project(vp, pt) {
    const v = M.transform(vp, [...pt, 1]);
    if (v[3] <= 0.1) return null;
    return [(v[0] / v[3] + 1) / 2 * innerWidth, (1 - v[1] / v[3]) / 2 * innerHeight];
  }
  const doorRects = {};
  function doorLabels(st, show) {
    const vp = show ? viewProj(st.current) : null;
    for (const [name, s] of Object.entries(DOORS)) {
      const el = tags[name];
      let rect = null;
      if (vp) {
        const pts = [[s * 9.3, 0, -70.5], [s * 9.3, 0, -79.5], [s * 9.3, 7.5, -70.5], [s * 9.3, 7.5, -79.5]].map((q) => project(vp, q));
        if (pts.every(Boolean)) {
          const xs = pts.map((q) => q[0]), ys = pts.map((q) => q[1]);
          rect = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
          if (rect[2] < 0 || rect[0] > innerWidth || rect[2] - rect[0] < 24) rect = null;
        }
      }
      doorRects[name] = rect;
      const top = rect && project(vp, [s * 9.3, 6.2, -75]);
      const visible = !!(top && top[0] > 70 && top[0] < innerWidth - 70);
      el.classList.toggle('on', visible);
      if (visible) {
        const x = Math.min(innerWidth - 90, Math.max(90, top[0])), y = Math.min(innerHeight - 160, Math.max(110, top[1]));
        el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%)`;
      }
    }
  }
  const canvas = document.getElementById('world');
  const hitDoor = (x, y) => Object.keys(doorRects).find((k) => { const r = doorRects[k]; return r && x >= r[0] && x <= r[2] && y >= r[1] && y <= r[3]; });
  addEventListener('pointermove', (e) => { if (wing) return; canvas && (canvas.style.cursor = e.target === canvas && hitDoor(e.clientX, e.clientY) ? 'pointer' : ''); }, { passive: true });
  addEventListener('click', (e) => { if (wing || e.target !== canvas) return; const d = hitDoor(e.clientX, e.clientY); if (d) enter(d); });

  // ---- HUD: gallery doors, wing label ----
  function hud() {
    requestAnimationFrame(hud);
    const st = state();
    if (!st) return;
    const inGallery = !wing && st.phase === 'explore' && st.current > 0.375 && st.current < 0.6 && !$$('dialog').some((d) => d.open) && !root.classList.contains('peek');
    doorLabels(st, inGallery);
    root.classList.toggle('in-gallery', inGallery);
    if (wing) {
      const lab = $('#chapter-label');
      if (lab && lab.textContent !== LABEL[wing]) lab.textContent = LABEL[wing];
      const i = Math.max(0, Math.round(t) - first), n = K.length - first;
      const txt = exiting ? 'Returning to the gallery' : i >= n - 1 ? 'End of the wing' : `${wing === 'portfolio' ? 'Project' : 'Service'} ${String(i + 1).padStart(2, '0')} / ${String(n - 1).padStart(2, '0')}`;
      const h = $('.wing-hud-label');
      if (h.textContent !== txt) h.textContent = txt;
    }
  }
  requestAnimationFrame(hud);
})();
