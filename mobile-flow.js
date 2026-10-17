/* Phones: the same 3D walk as desktop, driven by scroll.
   At each stop its card rises from the bottom and moves 1:1 with the finger until all of it has been read;
   once it has left the screen the camera walks on to the next stop and the next card rises.
   In the gallery the visitor picks the left (portfolio) or right (services) wing and walks it in 3D. */
(function () {
  const html = document.documentElement, body = document.body;
  const $ = (s, r = document) => r.querySelector(s);
  // card id -> camera progress while that card is on screen (matches the desktop holds in math.js)
  const STOPS = [['hero', .18], ['who', .34], ['hub-services', .46], ['hub-portfolio', .50], ['testimonials', .62], ['numbers-b', .675], ['faq', .77], ['team', .885], ['contact', .975]];
  const START = 0.45;   // at scroll 0 the hero card's top sits at 55% of the screen
  const GAP = 0.85;     // walking distance between cards, in screen heights
  let segs = [], total = 0, V = innerHeight, built = false;

  const smooth = (t) => t * t * (3 - 2 * t);
  const cards = () => STOPS.map(([id, p]) => ({ el: document.getElementById(id), p })).filter((c) => c.el);

  function layout() {
    if (!html.classList.contains('m-flow')) return;
    const keep = segs.length ? where(scrollY) : null;
    V = innerHeight;
    let at = 0;
    segs = cards().map((c) => {
      const h = c.el.offsetHeight, s = { ...c, h, start: at };
      at += V + h + GAP * V;
      return s;
    });
    const last = segs[segs.length - 1];
    total = last.start + last.h + 40 - START * V;
    body.style.height = Math.ceil(total + V) + 'px';
    if (keep) scrollTo(0, segs[keep.i].start + keep.s * (V + segs[keep.i].h) - START * V);
    render();
  }
  function where(y) { // which card segment the scroll position is in, and how far through it
    const abs = y + START * V;
    let i = 0;
    while (i < segs.length - 1 && abs >= segs[i + 1].start) i++;
    return { i, s: (abs - segs[i].start) / (V + segs[i].h), abs };
  }

  // scroll position -> camera progress (used by app.js instead of scrollY / pageRange)
  function progress(y) {
    if (!segs.length) return .18;
    const abs = y + START * V;
    for (let i = 0; i < segs.length; i++) {
      const a = segs[i], pass = a.start + V + a.h, b = segs[i + 1];
      if (abs < pass || !b) return a.p;
      const walkEnd = pass + GAP * V;
      if (abs < walkEnd) return a.p + (b.p - a.p) * smooth((abs - pass) / (GAP * V));
    }
    return segs[segs.length - 1].p;
  }

  function render() {
    if (!segs.length) return;
    const abs = scrollY + START * V;
    for (const c of segs) {
      const y = V - (abs - c.start);              // card top, moves 1:1 with the scroll
      const on = y < V && y > -c.h;
      c.el.style.setProperty('--y', (on ? y : (y >= V ? V + 40 : -c.h - 40)).toFixed(1) + 'px');
      c.el.classList.toggle('m-on', on);
      if (on && !c.el.classList.contains('is-active')) c.el.classList.add('is-active');
      if (!on && c.el.classList.contains('is-active') && Math.abs(y) > 2 * V) c.el.classList.remove('is-active');
    }
    html.classList.toggle('m-start', scrollY < 30);
  }

  window.WestsideMobile = {
    progress,
    go(id) { const s = segs.find((c) => c.el.id === id); if (s) scrollTo({ top: s.start, behavior: 'smooth' }); },
  };

  function build() {
    if (built) return; built = true;
    const ro = new ResizeObserver(() => { clearTimeout(build.t); build.t = setTimeout(layout, 120); });
    cards().forEach((c) => ro.observe(c.el));
    addEventListener('scroll', render, { passive: true });
    addEventListener('resize', () => { clearTimeout(build.t); build.t = setTimeout(layout, 150); });
    if (document.fonts) document.fonts.ready.then(layout);
    const hint = document.createElement('p');
    hint.className = 'm-scroll-hint'; hint.innerHTML = 'Scroll to walk <i>↓</i>';
    body.appendChild(hint);
    gallery();
    layout();
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
  new MutationObserver(() => { placeSpeaker(); if (!body.classList.contains('at-entry')) layout(); }).observe(body, { attributes: true, attributeFilter: ['class'] });

  function apply() {
    const on = body.classList.contains('mobile');
    html.classList.toggle('m-flow', on);
    if (on) build(); else body.style.height = '';
    placeSpeaker();
  }
  apply();
  addEventListener('resize', apply);
})();
