/* Journey rail: replaces the native scrollbar with a chapter-aware progress rail. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const STOPS = [['home', .18, 'Arrival'], ['services', .34, 'Who we are'], ['work', .455, 'Gallery'], ['numbers', .625, 'Client stories'], ['about', .77, 'FAQ'], ['team', .885, 'Founders'], ['contact', .985, 'Contact']];
  const rail = document.createElement('nav');
  rail.className = 'rail'; rail.setAttribute('aria-label', 'Journey progress');
  rail.innerHTML = `<div class="rail-track"><i class="rail-fill"></i>${STOPS.map(([k, p, n], i) => `<button class="rail-stop" data-k="${k}" style="--p:${p}" aria-label="Go to ${n}"><b>${String(i + 1).padStart(2, '0')}</b><span>${n}</span></button>`).join('')}<span class="rail-thumb"><img src="assets/originals/Westside%20(2).png" alt=""></span></div><span class="rail-pct">00%</span>`;
  document.body.appendChild(rail);
  const track = $('.rail-track', rail), fill = $('.rail-fill', rail), thumb = $('.rail-thumb', rail), pct = $('.rail-pct', rail), stops = [...rail.querySelectorAll('.rail-stop')];

  const range = () => Math.max(1, document.documentElement.scrollHeight - innerHeight);
  const progressAt = (y) => { const r = track.getBoundingClientRect(); return Math.min(1, Math.max(0, (y - r.top) / r.height)); };

  stops.forEach((b) => b.addEventListener('click', (e) => {
    e.stopPropagation();
    if (window.WestsideWing && WestsideWing.active()) WestsideWing.exit(true);
    window.WestsideExperience && WestsideExperience.jump(b.dataset.k);
  }));
  let drag = false;
  const seek = (y) => window.scrollTo({ top: progressAt(y) * range(), behavior: 'instant' });
  track.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.rail-stop')) return;
    if (window.WestsideWing && WestsideWing.active()) return;
    drag = true; rail.classList.add('dragging'); track.setPointerCapture(e.pointerId); seek(e.clientY);
  });
  track.addEventListener('pointermove', (e) => { if (drag) seek(e.clientY); });
  const end = () => { drag = false; rail.classList.remove('dragging'); };
  track.addEventListener('pointerup', end); track.addEventListener('pointercancel', end);

  let shown = -1;
  function tick() {
    requestAnimationFrame(tick);
    const st = window.WestsideExperience && WestsideExperience.getState();
    if (!st) return;
    const on = st.phase === 'explore';
    rail.classList.toggle('on', on);
    if (!on) return;
    const p = Math.min(1, Math.max(0, st.current));
    thumb.style.top = (p * 100).toFixed(3) + '%';
    fill.style.transform = `scaleY(${p.toFixed(4)})`;
    const v = Math.round(p * 100);
    if (v !== shown) { shown = v; pct.textContent = String(v).padStart(2, '0') + '%'; }
    let act = 0; STOPS.forEach((s, i) => { if (st.current >= s[1] - .06) act = i; });
    stops.forEach((b, i) => { b.classList.toggle('active', i === act); b.classList.toggle('passed', i < act); });
  }
  requestAnimationFrame(tick);
})();
