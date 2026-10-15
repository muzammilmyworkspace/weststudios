/* "View space": hide every panel so the visitor can look at the 3D architecture. */
(function () {
  const root = document.documentElement, btn = document.getElementById('peek');
  if (!btn) return;
  const set = (on) => { root.classList.toggle('peek', on); btn.setAttribute('aria-pressed', String(on)); btn.querySelector('span').textContent = on ? 'Show panels' : 'View space'; };
  btn.addEventListener('click', () => set(!root.classList.contains('peek')));
  addEventListener('keydown', (e) => {
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName || '') || [...document.querySelectorAll('dialog')].some((d) => d.open)) return;
    if (e.key === 'h' || e.key === 'H') set(!root.classList.contains('peek'));
  });
  // any navigation brings the panels back
  ['#next-chapter', '#previous-chapter', '.rail-stop', '[data-jump]', '.wing-go', '.wing-link'].forEach((s) => document.addEventListener('click', (e) => { if (e.target.closest && e.target.closest(s)) set(false); }, true));
})();
