(() => {
  const SVGNS = 'http://www.w3.org/2000/svg';
  const hero = document.querySelector('.hero');
  const svg = hero && hero.querySelector('.hero__sail');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Menu mobile ---------- */
  const toggle = document.querySelector('.mast__toggle');
  const menu = document.getElementById('menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
    });
    menu.addEventListener('click', (e) => {
      if (e.target.closest('a')) { toggle.setAttribute('aria-expanded', 'false'); menu.classList.remove('is-open'); }
    });
  }

  /* ---------- Ligne de départ : choix du profil ---------- */
  const flags = [...document.querySelectorAll('.flag')];
  flags.forEach((flag) => {
    flag.addEventListener('click', () => {
      flags.forEach((f) => {
        const on = f === flag;
        f.setAttribute('aria-pressed', String(on));
        document.getElementById(f.dataset.panel).hidden = !on;
      });
      const panel = document.getElementById(flag.dataset.panel);
      const r = panel.getBoundingClientRect();
      if (r.bottom > innerHeight) panel.scrollIntoView({ behavior: reduce.matches ? 'auto' : 'smooth', block: 'nearest' });
    });
  });

  if (!svg) return;

  /* ---------- La grand-voile ---------- */
  const q = (s) => svg.querySelectorAll(s);
  const sailPaths = q('.js-sail-path');
  const seams = svg.querySelector('.js-seams');
  const battens = svg.querySelector('.js-battens');
  const tape = svg.querySelector('.js-leech-tape');
  const head = svg.querySelector('.js-head');
  const tack = svg.querySelector('.js-tack');
  const mast = svg.querySelector('.js-mast');
  const tells = svg.querySelector('.js-telltales');

  let W = 0, H = 0, G = null, progress = 0, raf = 0, t0 = performance.now();

  function geometry() {
    const narrow = W < 980;
    if (narrow) {
      const mastX = W * 0.035;
      return {
        narrow, mastX,
        head: [W * 0.2, H * 0.015],
        clew: [W * 1.35, H * 0.74],
        tackY: H + 2,
        roach: W * 0.11,
      };
    }
    const mastX = W * 0.032;
    return {
      narrow, mastX,
      head: [mastX + W * 0.055, H * 0.03],
      clew: [W * 0.665, H * 0.985],
      tackY: H * 0.985,
      roach: W * 0.075,
    };
  }

  // Point sur la chute à t∈[0,1] : interpolation tête→point d'écoute + rond de chute
  function leechPoint(t, fill, flutter, time) {
    const [hx, hy] = G.head, [cx, cy] = G.clew;
    const dx = cx - hx, dy = cy - hy, len = Math.hypot(dx, dy);
    const nx = dy / len, ny = -dx / len; // normale extérieure (vers la droite, vers le haut)
    const bulge = Math.sin(Math.PI * t) * G.roach * fill;
    const wave = flutter * Math.sin(t * Math.PI * 7 - time * 6) * Math.sin(Math.PI * t) * W * 0.014;
    const o = bulge + wave;
    return [hx + dx * t + nx * o, hy + dy * t + ny * o, nx, ny];
  }

  function sailD(fill, flutter, time) {
    const N = 48;
    let d = `M${G.mastX},${G.head[1]} L${G.head[0]},${G.head[1]}`;
    for (let i = 1; i <= N; i++) {
      const [x, y] = leechPoint(i / N, fill, flutter, time);
      d += ` L${x.toFixed(1)},${y.toFixed(1)}`;
    }
    if (G.narrow) d += ` L${G.clew[0]},${H + 2}`;
    d += ` L${G.mastX},${G.tackY} Z`;
    return d;
  }

  function leechD(fill, flutter, time) {
    let d = '';
    for (let i = 0; i <= 48; i++) {
      const [x, y] = leechPoint(i / 48, fill, flutter, time);
      d += `${i ? ' L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`;
    }
    return d;
  }

  function el(name, attrs, parent) {
    const n = document.createElementNS(SVGNS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    parent.appendChild(n);
    return n;
  }

  function buildStatic() {
    seams.replaceChildren(); battens.replaceChildren(); tells.replaceChildren();
    const L = Math.hypot(W, H) * 1.4;
    // Laizes coupées perpendiculairement à la chute
    for (let k = 1; k <= 11; k++) {
      const t = k / 12;
      const [x, y, nx, ny] = leechPoint(t, 1, 0, 0);
      el('line', { x1: x + nx * 40, y1: y + ny * 40, x2: x - nx * L, y2: y - ny * L }, seams);
      el('line', { class: 'stitch', x1: x + nx * 40 + 0, y1: y + ny * 40 + 5, x2: x - nx * L, y2: y - ny * L + 5 }, seams);
    }
    // Lattes
    const bl = Math.min(W, 1400) * (G.narrow ? 0.16 : 0.085);
    [0.2, 0.4, 0.6, 0.8].forEach((t) => {
      const [x, y, nx, ny] = leechPoint(t, 1, 0, 0);
      el('line', { x1: x - nx * 4, y1: y - ny * 4, x2: x - nx * bl, y2: y - ny * bl }, battens);
      el('line', { class: 'inner', x1: x - nx * 10, y1: y - ny * 10, x2: x - nx * (bl - 6), y2: y - ny * (bl - 6) }, battens);
    });
    // Renforts de têtière et d'amure
    const [hx, hy] = G.head;
    head.setAttribute('d', `M${G.mastX},${hy} L${hx + 10},${hy} L${G.mastX},${hy + H * 0.13} Z`);
    tack.setAttribute('d', `M${G.mastX},${G.tackY} L${G.mastX + W * (G.narrow ? 0.2 : 0.09)},${G.tackY} L${G.mastX},${G.tackY - H * 0.12} Z`);
    // Mât
    mast.setAttribute('x', G.mastX - 5); mast.setAttribute('y', -10);
    mast.setAttribute('width', G.narrow ? 6 : 9); mast.setAttribute('height', H + 20);
    // Penons sur la chute
    const ts = G.narrow ? [0.12, 0.22, 0.32] : [0.3, 0.5, 0.7];
    ts.forEach((t, i) => {
      const g = el('g', { 'data-t': t }, tells);
      el('path', { class: `telltale ${i % 2 ? 'telltale--g' : 'telltale--r'}`, d: 'M0 0 q10 4 20 0 t20 1', style: `animation-delay:${-i * 0.7}s` }, g);
    });
  }

  function placeTelltales(fill, flutter, time) {
    tells.querySelectorAll('g').forEach((g) => {
      const [x, y] = leechPoint(+g.dataset.t, fill, flutter, time);
      g.setAttribute('transform', `translate(${(x + 2).toFixed(1)},${y.toFixed(1)})`);
    });
  }

  function placeCopy() {
    const s = hero.style;
    const widthAt = (yFrac) => {
      // largeur de toile disponible à une hauteur donnée (approximation sur la corde)
      const t = (yFrac * H - G.head[1]) / (G.clew[1] - G.head[1]);
      const [x] = leechPoint(Math.max(0, Math.min(1, t)), 1, 0, 0);
      return x - G.mastX;
    };
    if (G.narrow) {
      s.setProperty('--ins-x', `${G.mastX + 14}px`);
      s.setProperty('--ins-y', `${H * 0.11}px`);
      s.setProperty('--ins-w', `${Math.min(widthAt(0.16) * 0.55, 120)}px`);
      s.setProperty('--copy-x', `${G.mastX + 16}px`);
      s.setProperty('--copy-y', `${H * 0.4}px`);
      s.setProperty('--copy-w', `${W - G.mastX - 32}px`);
      s.setProperty('--stamp-x', `${W - 210}px`);
    } else {
      s.setProperty('--ins-x', `${G.mastX + 22}px`);
      s.setProperty('--ins-y', `${H * 0.13}px`);
      s.setProperty('--ins-w', `${Math.min(widthAt(0.2) * 0.62, 170)}px`);
      s.setProperty('--copy-x', `${G.mastX + Math.max(32, W * 0.03)}px`);
      s.setProperty('--copy-y', `${H * 0.31}px`);
      s.setProperty('--copy-w', `${widthAt(0.5) - Math.max(32, W * 0.03) - 40}px`);
      s.setProperty('--stamp-x', `${G.mastX + W * 0.11}px`);
    }
  }

  function draw(time) {
    const fill = 1 - progress * 0.75;
    const flutter = reduce.matches ? 0 : Math.min(1, progress * 1.6);
    const d = sailD(fill, flutter, time);
    sailPaths.forEach((p) => p.setAttribute('d', d));
    tape.setAttribute('d', leechD(fill, flutter, time));
    placeTelltales(fill, flutter, time);
  }

  function loop(now) {
    draw((now - t0) / 1000);
    raf = progress > 0.01 && !reduce.matches ? requestAnimationFrame(loop) : 0;
  }

  function onScroll() {
    const r = hero.getBoundingClientRect();
    progress = Math.max(0, Math.min(1, -r.top / (r.height * 0.8)));
    if (reduce.matches) return;
    if (!raf) raf = requestAnimationFrame(loop);
  }

  function layout() {
    const r = hero.getBoundingClientRect();
    W = r.width; H = r.height;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    G = geometry();
    buildStatic();
    placeCopy();
    draw(0);
  }

  layout();
  let rz;
  window.addEventListener('resize', () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(layout); });
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
