/* Gallery exhibits: spotlight, glare, loupe, light-up reveal and richer case studies. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  const CASES = [
    { kind: 'Leather e-commerce · United States', accent: '#d0763c', chips: ['5 campaign creatives', '4 tracking codes', 'One-of-one inventory', 'Meta sales system'] },
    { kind: 'Streetwear · Apparel', accent: '#4d7bff', chips: ['Tracking first', 'SABLE10 attribution', 'Autumn creative system', 'Weekly optimisation'] },
    { kind: 'Healthcare · Medical equipment', accent: '#2fc1ad', chips: ['Digital presence', 'Clarity', 'Credibility', 'In preparation'] },
  ];

  // pointer: spotlight + glare + loupe, all driven by CSS variables
  $$('.ex-frame').forEach((frame) => {
    if (!fine || reduced) return;
    const set = (e) => {
      const r = frame.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      const y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      frame.style.setProperty('--mx', (x * 100).toFixed(2) + '%');
      frame.style.setProperty('--my', (y * 100).toFixed(2) + '%');
      frame.style.setProperty('--rx', ((0.5 - y) * 9).toFixed(2) + 'deg');
      frame.style.setProperty('--ry', ((x - 0.5) * 12).toFixed(2) + 'deg');
    };
    frame.addEventListener('pointerenter', (e) => { set(e); frame.classList.add('inspecting'); });
    frame.addEventListener('pointermove', set, { passive: true });
    frame.addEventListener('pointerleave', () => {
      frame.classList.remove('inspecting');
      frame.style.setProperty('--rx', '0deg'); frame.style.setProperty('--ry', '0deg');
    });
  });

  // lights come on each time an exhibit becomes the active installation
  const exhibits = $$('.gallery-panel');
  const watch = new MutationObserver((list) => list.forEach((m) => {
    const el = m.target;
    if (!el.classList.contains('gallery-panel')) return;
    const on = el.classList.contains('is-active');
    // only touch the class when it actually changes: classList.remove() rewrites the
    // attribute even when the token is absent, which would re-trigger this observer
    const lit = el.classList.contains('lit');
    if (on && !lit) el.classList.add('lit');
    else if (!on && lit) el.classList.remove('lit');
  }));
  exhibits.forEach((el) => watch.observe(el, { attributes: true, attributeFilter: ['class'] }));

  // "Next exhibit" walks forward with the existing chapter control
  $$('.ex-next').forEach((b) => b.addEventListener('click', () => { const n = $('#next-chapter'); n && n.click(); }));

  // case dialog: accent, kind line, chips and a sliding tab indicator
  const dialog = $('#case-dialog');
  const ink = $('.cs-ink');
  const moveInk = () => {
    const on = $('.case-tabs [aria-pressed="true"]');
    if (!on || !ink) return;
    ink.style.width = on.offsetWidth + 'px';
    ink.style.transform = `translateX(${on.offsetLeft}px)`;
  };
  $$('[data-case]').forEach((b) => b.addEventListener('click', () => {
    const c = CASES[+b.dataset.case] || CASES[0];
    dialog.style.setProperty('--accent', c.accent);
    $('#case-kind').textContent = c.kind;
    $('#case-chips').innerHTML = c.chips.map((t) => `<li>${t}</li>`).join('');
    dialog.classList.remove('cs-in'); void dialog.offsetWidth; dialog.classList.add('cs-in');
    requestAnimationFrame(() => requestAnimationFrame(moveInk));
  }));
  $$('.case-tabs [data-story]').forEach((b) => b.addEventListener('click', () => {
    requestAnimationFrame(moveInk);
    const p = $('#case-story');
    p.classList.remove('swap'); void p.offsetWidth; p.classList.add('swap');
  }));
  addEventListener('resize', moveInk);
})();
