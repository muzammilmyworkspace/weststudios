/* Phones: the journey becomes a normal scrolling page over the moving 3D world.
   The two wings stay real 3D galleries: entering one hides the page and walks the camera through it,
   with a compact info sheet for the exhibit in front of you. */
(function () {
  const html = document.documentElement, body = document.body;
  const $ = (s, r = document) => r.querySelector(s);
  const TOOLS = ['Google Ads', 'Meta', 'Instagram', 'Facebook', 'YouTube', 'Snapchat', 'Claude', 'ChatGPT', 'Make', 'Zapier', 'Shopify', 'TikTok', 'Google Analytics', 'WhatsApp'];
  let built = false, io = null;

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
    tools($('#hub-portfolio'));
    io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-active', 'm-in'); io.unobserve(e.target); } }), { threshold: 0.12 });
    document.querySelectorAll('#content .world-panel, .m-tools').forEach((el) => io.observe(el));
    gallery();
  }

  /* ---------- gallery mode (inside a wing) ---------- */
  function gallery() {
    const g = document.createElement('div');
    g.className = 'm-gal';
    g.innerHTML = '<div class="m-gal-top"><button class="m-gal-back" type="button"><i>←</i> Gallery</button><span class="m-gal-title"></span><span class="m-gal-count"></span></div>'
      + '<p class="m-gal-hint"><i>←</i> Swipe to walk <i>→</i></p>'
      + '<div class="m-gal-sheet"><div class="m-gal-body"></div><div class="m-gal-nav"><button class="m-gal-prev" type="button" aria-label="Previous">←</button><span class="m-gal-dots"></span><button class="m-gal-next" type="button" aria-label="Next">→</button></div></div>';
    body.appendChild(g);
    const W = window.WestsideWing, label = $('.wing-hud-label'), sheet = $('.m-gal-sheet', g), bodyEl = $('.m-gal-body', g), dots = $('.m-gal-dots', g);
    $('.m-gal-back', g).addEventListener('click', () => W && W.exit());
    $('.m-gal-prev', g).addEventListener('click', () => W && W.step(-1));
    $('.m-gal-next', g).addEventListener('click', () => W && W.step(1));
    let key = '', open = false, hintTimer = 0;

    const forward = (src) => { // a sheet button that clicks the original exhibit button
      const b = document.createElement('button');
      b.type = 'button'; b.className = src.className.replace(/\bbtn-xl\b/, ''); b.innerHTML = src.innerHTML;
      b.addEventListener('click', () => src.click());
      return b;
    };
    function fill(id, text) {
      const wingName = html.dataset.wing || 'portfolio';
      $('.m-gal-title', g).textContent = wingName === 'portfolio' ? 'Portfolio wing' : 'Services wing';
      const m = text.match(/(\d+)\s*\/\s*(\d+)/);
      $('.m-gal-count', g).textContent = m ? `${m[1]} / ${m[2]}` : '';
      const total = m ? +m[2] : 7, at = m ? +m[1] : (/tools/i.test(text) ? 0 : total + 1);
      dots.innerHTML = Array.from({ length: total + 2 }, (_, k) => `<i class="${k === at ? 'on' : ''}"></i>`).join('');
      bodyEl.innerHTML = '';
      const el = id && document.getElementById(id);
      if (!el) {
        bodyEl.innerHTML = '<p class="m-gal-kind">Tools we build with</p><h3>The toolkit.</h3><p class="m-gal-pitch">Google Ads, Meta, TikTok, Shopify, Claude, ChatGPT, Make, Zapier and more: the platforms behind every campaign and automation we run.</p>';
        return;
      }
      const kind = $('.ex-kind', el), h = $('h2', el), pitch = $('.ex-pitch', el) || $('.cd-lede', el);
      bodyEl.innerHTML = `<p class="m-gal-kind">${kind ? kind.textContent : (wingName === 'portfolio' ? 'Portfolio' : 'Services')}</p><h3></h3><p class="m-gal-pitch"></p>`;
      $('h3', bodyEl).textContent = h ? h.textContent : '';
      $('.m-gal-pitch', bodyEl).textContent = pitch ? pitch.textContent : '';
      const chips = [...el.querySelectorAll('.ex-chips li')].slice(0, 3);
      if (chips.length) { const ul = document.createElement('ul'); ul.className = 'm-gal-chips'; chips.forEach((c) => { const li = document.createElement('li'); li.textContent = c.textContent; ul.appendChild(li); }); bodyEl.appendChild(ul); }
      const acts = [...el.querySelectorAll('.ex-actions button, .panel-actions button')].filter((b) => !b.classList.contains('ex-next'));
      if (acts.length) { const row = document.createElement('div'); row.className = 'm-gal-actions'; acts.slice(0, 2).forEach((b) => row.appendChild(forward(b))); bodyEl.appendChild(row); }
    }

    function tick() {
      requestAnimationFrame(tick);
      const inGal = html.classList.contains('m-gallery');
      if (inGal !== open) {
        open = inGal; g.classList.toggle('on', open); key = ''; sheet.classList.remove('in');
        if (open) { g.classList.add('hint'); clearTimeout(hintTimer); hintTimer = setTimeout(() => g.classList.remove('hint'), 3600); }
      }
      if (!open || !W) return;
      const moving = W.moving(), text = label ? label.textContent : '', id = W.panel();
      sheet.classList.toggle('moving', moving);
      const k = id + '|' + text;
      if (!moving && k !== key && !/Returning/i.test(text)) { key = k; fill(id, text); sheet.classList.remove('in'); void sheet.offsetWidth; sheet.classList.add('in'); }
    }
    requestAnimationFrame(tick);
  }

  /* On the entrance screen the speaker sits beside "Enter the Westside"; after entering it goes back to the header. */
  const speaker = $('#speaker'), home = speaker && speaker.parentElement, homeNext = speaker && speaker.nextElementSibling, enterBtn = $('#enter-button');
  function placeSpeaker() {
    if (!speaker || !enterBtn) return;
    const atEntry = html.classList.contains('m-flow') && body.classList.contains('at-entry');
    if (atEntry && speaker.parentElement !== enterBtn.parentElement) { enterBtn.after(speaker); speaker.classList.add('at-door'); }
    else if (!atEntry && speaker.parentElement !== home) { home.insertBefore(speaker, homeNext); speaker.classList.remove('at-door'); }
  }
  new MutationObserver(placeSpeaker).observe(body, { attributes: true, attributeFilter: ['class'] });

  function apply() {
    const on = body.classList.contains('mobile');
    html.classList.toggle('m-flow', on);
    if (on) build();
    placeSpeaker();
  }
  apply();
  addEventListener('resize', apply);
})();
