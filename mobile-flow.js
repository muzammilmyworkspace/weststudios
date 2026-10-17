/* Phones: the journey becomes a normal scrolling page over the moving 3D world.
   Cards flow full-width, both wings become swipe rows, and the tool logos float in a grid. */
(function () {
  const html = document.documentElement, body = document.body;
  const $ = (s) => document.querySelector(s);
  const TOOLS = ['Google Ads', 'Meta', 'Instagram', 'Facebook', 'YouTube', 'Snapchat', 'Claude', 'ChatGPT', 'Make', 'Zapier', 'Shopify', 'TikTok', 'Google Analytics', 'WhatsApp'];
  let built = false, io = null;

  function rail(id, label, ids, after) {
    const sec = document.createElement('section');
    sec.className = 'm-rail-wrap'; sec.id = id;
    sec.innerHTML = `<p class="m-rail-head"><span>${label}</span><small>Swipe <i>→</i></small></p><div class="m-rail"></div><div class="m-dots"></div>`;
    const track = sec.querySelector('.m-rail'), dots = sec.querySelector('.m-dots');
    ids.forEach((pid) => { const el = document.getElementById(pid); if (el) { track.appendChild(el); dots.appendChild(document.createElement('i')); } });
    after.after(sec);
    const sync = () => {
      const cards = [...track.children], mid = track.scrollLeft + track.clientWidth / 2;
      let best = 0, d = Infinity;
      cards.forEach((c, k) => { const m = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (m < d) { d = m; best = k; } });
      [...dots.children].forEach((dot, k) => dot.classList.toggle('on', k === best));
    };
    track.addEventListener('scroll', sync, { passive: true }); sync();
    return sec;
  }

  function tools(after) {
    const sec = document.createElement('section');
    sec.className = 'm-tools'; sec.id = 'm-tools';
    sec.innerHTML = '<p class="m-eyebrow">The toolkit</p><h2>Tools we<br><em>build with.</em></h2><p class="m-lede">The platforms behind the campaigns, stores and automations we run for clients.</p><div class="m-tool-grid"></div>';
    const grid = sec.querySelector('.m-tool-grid');
    TOOLS.forEach((name, k) => {
      const t = document.createElement('span');
      t.className = 'm-tool'; t.title = name; t.setAttribute('aria-label', name); t.setAttribute('role', 'img');
      t.style.backgroundPosition = `${(k % 4) * 100 / 3}% ${Math.floor(k / 4) * 100 / 3}%`;
      t.style.setProperty('--d', (k * 0.37 % 2.6).toFixed(2) + 's');
      t.style.setProperty('--r', ((k % 3) - 1) * 4 + 'deg');
      grid.appendChild(t);
    });
    after.after(sec);
  }

  function build() {
    if (built) return; built = true;
    const faq = $('#faq'), numbers = $('#numbers-b');
    if (faq && numbers) faq.before(numbers);
    const sv = rail('m-services', 'Seven services', ['sv-0', 'sv-1', 'sv-2', 'sv-3', 'sv-4', 'sv-5', 'sv-6'], $('#hub-services'));
    const pf = rail('m-portfolio', 'Seven projects', ['pf-0', 'pf-1', 'pf-2', 'pf-3', 'pf-4', 'pf-5', 'pf-6'], $('#hub-portfolio'));
    tools(pf);
    io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-active', 'm-in'); io.unobserve(e.target); } }), { threshold: 0.12 });
    document.querySelectorAll('#content .world-panel, .m-tools, .m-rail-wrap').forEach((el) => io.observe(el));
    void sv;
  }

  function apply() {
    const on = body.classList.contains('mobile');
    html.classList.toggle('m-flow', on);
    if (on) build();
  }
  apply();
  addEventListener('resize', apply);

  // Buttons inside the swipe rows: "next" slides the row, "start a similar project" goes to the brief.
  addEventListener('click', (e) => {
    if (!html.classList.contains('m-flow') || !e.target.closest) return;
    const next = e.target.closest('.m-rail .ex-next');
    if (next) {
      e.preventDefault(); e.stopImmediatePropagation();
      const card = next.closest('.world-panel'), track = card.parentElement;
      const to = card.nextElementSibling || track.firstElementChild;
      track.scrollTo({ left: to.offsetLeft - (track.clientWidth - to.offsetWidth) / 2, behavior: 'smooth' });
      return;
    }
    const start = e.target.closest('.m-rail .wing-start');
    if (start) {
      e.preventDefault(); e.stopImmediatePropagation();
      const radio = document.querySelector(`#project-form input[name=service][value="${start.dataset.service}"]`);
      if (radio) radio.checked = true;
      const c = $('#contact'); if (c) c.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => { const b = $('#contact-open'); if (b) b.click(); }, 900);
    }
  }, true);
})();
