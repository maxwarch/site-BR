// CDPA Bassin-Rond — le fond de page change progressivement d'une section à l'autre.
(() => {
  // Listes de vidéos : replier avant la première mesure pour éviter une double passe de mise en page
  const toggles = [];
  document.querySelectorAll('[data-plie]').forEach((liste) => {
    const max = Number(liste.dataset.plie);
    const extra = [...liste.children].slice(max);
    const bouton = document.querySelector(`.voir-plus[aria-controls="${liste.id}"]`);
    if (!extra.length || !bouton) return;
    const plus = bouton.textContent;
    const moins = plus.replace('Voir plus', 'Voir moins');
    const regler = (ouvert) => {
      extra.forEach((li) => { li.hidden = !ouvert; });
      bouton.setAttribute('aria-expanded', String(ouvert));
      bouton.textContent = ouvert ? moins : plus;
    };
    regler(false);
    bouton.hidden = false;
    toggles.push({ bouton, regler });
  });

  const root = document.documentElement;
  const header = document.querySelector('.top');
  const rail = document.querySelector('.rail');
  const railLinks = [...document.querySelectorAll('.rail a')];
  const sun = document.querySelector('.rail__sun');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');

  // Teinte de fond propre à chaque section (jamais crème, jamais nuit)
  const GROUND = {
    lieu: '#dbe7ef',
    stages: '#e6f2f8',
    groupes: '#e1efe3',
    location: '#d6ecf6',
    adhesion: '#ffe6a0',
    'les-24-heures-du-bassin-rond': '#cfe8f7',
    videos: '#e4eef8',
    infos: '#e9f1f4',
  };
  const ORDER = Object.keys(GROUND);
  const sections = ORDER.map((id) => document.getElementById(id));

  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const GROUND_RGB = ORDER.map((k) => hex(GROUND[k]));
  const mix = (a, b, t) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(' ')})`;

  let tops = [];
  let dots = [];
  let headerH = 0;
  let scrollBottomThreshold = 0;
  let prevHeaderReal = '';
  const prevMargins = new Array(sections.length).fill('');

  const measure = () => {
    // Phase de lecture groupée (zéro reflow forcé entre lectures et écritures)
    const sy = scrollY;
    const nextHeaderH = header.offsetHeight;
    const nextScrollBottom = document.documentElement.scrollHeight - 2;
    const marginPlans = sections.map((sec) => {
      if (!sec || sec.firstElementChild?.matches('.plein')) return null;
      const debut = sec.getBoundingClientRect().top;
      const reperes = [...sec.querySelectorAll('h2, figure')].slice(0, 3).map((el) => el.getBoundingClientRect().top - debut);
      if (!reperes.length) return null;
      return `${-Math.max(0, Math.min(...reperes) - 32)}px`;
    });
    const nextTops = sections.map((el) => el.getBoundingClientRect().top + sy);
    const box = rail.getBoundingClientRect();
    const dotWidth = railLinks[0] ? (parseFloat(getComputedStyle(railLinks[0], '::after').width) || 16) : 16;
    const vertical = box.height > box.width;
    const nextDots = railLinks.map((a) => {
      const r = a.getBoundingClientRect();
      return vertical
        ? { x: r.right - box.left - dotWidth / 2, y: r.top - box.top + r.height / 2 }
        : { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
    });

    // Phase d'écriture groupée (uniquement si la valeur a changé)
    headerH = nextHeaderH;
    scrollBottomThreshold = nextScrollBottom;
    tops = nextTops;
    dots = nextDots;

    const nextHeaderReal = `${nextHeaderH}px`;
    if (nextHeaderReal !== prevHeaderReal) {
      prevHeaderReal = nextHeaderReal;
      root.style.setProperty('--header-real', nextHeaderReal);
    }
    sections.forEach((sec, idx) => {
      const val = marginPlans[idx];
      if (val !== null && val !== prevMargins[idx]) {
        prevMargins[idx] = val;
        sec.style.scrollMarginTop = val;
      }
    });
  };

  let prevSunX = '';
  let prevSunY = '';
  let prevSunTurn = '';
  // Le soleil se pose sur le point de la section courante et glisse vers le suivant
  const placeSun = (f, sy) => {
    if (!dots.length) return;
    const i = Math.min(Math.floor(f), dots.length - 1);
    const t = reduce.matches || i >= dots.length - 1 ? 0 : f - i;
    const a = dots[i], b = dots[Math.min(i + 1, dots.length - 1)];
    const x = `${(a.x + (b.x - a.x) * t).toFixed(1)}px`;
    const y = `${(a.y + (b.y - a.y) * t).toFixed(1)}px`;
    if (x !== prevSunX) { prevSunX = x; sun.style.setProperty('--sun-x', x); }
    if (y !== prevSunY) { prevSunY = y; sun.style.setProperty('--sun-y', y); }
    if (!reduce.matches) {
      const turn = `${(sy / 6) % 360}deg`;
      if (turn !== prevSunTurn) { prevSunTurn = turn; sun.style.setProperty('--sun-turn', turn); }
    }
  };

  // Indice fractionnaire de y dans la liste croissante des débuts de section
  const progress = (y) => {
    if (y <= tops[0]) return 0;
    for (let i = 0; i < tops.length - 1; i++) {
      if (y < tops[i + 1]) return i + (y - tops[i]) / (tops[i + 1] - tops[i]);
    }
    return tops.length - 1;
  };

  let ticking = false;
  let prevGround = '';
  let prevProgress = '';
  let prevCurrent = -1;
  let prevRailOn = null;
  let prevHeaderScrolled = null;

  const paint = () => {
    ticking = false;
    const sy = scrollY;
    // Même repère que l'ancrage des liens (en-tête + marge de défilement)
    // +2 px de tolérance : un ancrage tombe parfois une fraction de pixel avant le début de section
    const y = sy + headerH + 2;
    let f = progress(y);
    if (sy + innerHeight >= scrollBottomThreshold) f = ORDER.length - 1;
    if (reduce.matches) f = Math.floor(f);
    const i = Math.min(Math.floor(f), ORDER.length - 2);
    const t = Math.min(Math.max(f - i, 0), 1);
    // La couleur glisse pendant la seconde moitié de chaque section
    const eased = t < 0.5 ? 0 : (t - 0.5) * 2;
    const nextGround = mix(GROUND_RGB[i], GROUND_RGB[i + 1], eased);
    if (nextGround !== prevGround) {
      prevGround = nextGround;
      root.style.setProperty('--ground', nextGround);
    }
    const nextProgress = (f / (ORDER.length - 1)).toFixed(2);
    if (nextProgress !== prevProgress) {
      prevProgress = nextProgress;
      root.style.setProperty('--progress', nextProgress);
    }
    placeSun(f, sy);

    // L'étiquette suit le point le plus proche du soleil, pour qu'ils ne se contredisent jamais
    const current = y >= tops[0] ? Math.min(Math.round(f), ORDER.length - 1) : -1;
    if (current !== prevCurrent) {
      prevCurrent = current;
      railLinks.forEach((a, k) => a.setAttribute('aria-current', k === current ? 'true' : 'false'));
    }
    const railOn = sy > innerHeight * 0.6;
    if (railOn !== prevRailOn) {
      prevRailOn = railOn;
      rail.classList.toggle('is-on', railOn);
    }
    const headerScrolled = sy > 24;
    if (headerScrolled !== prevHeaderScrolled) {
      prevHeaderScrolled = headerScrolled;
      header.classList.toggle('is-scrolled', headerScrolled);
    }
  };
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } };

  measure();
  paint();
  addEventListener('scroll', request, { passive: true });
  const remeasure = () => { measure(); request(); };
  addEventListener('resize', remeasure);
  rail.addEventListener('transitionend', remeasure);
  addEventListener('load', remeasure);
  reduce.addEventListener?.('change', request);
  if ('ResizeObserver' in window) {
    let roSkip = true;
    new ResizeObserver(() => {
      if (roSkip) { roSkip = false; return; }
      remeasure();
    }).observe(document.body);
  }

  // Menu mobile
  const menu = document.querySelector('.menu');
  const nav = document.querySelector('.nav');
  const close = () => { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); };
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });
  nav?.addEventListener('click', (e) => { if (e.target.closest('a')) close(); });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { close(); menu.focus(); }
  });

  // Clic sur « Voir plus » : déplie sans faire bouger la page
  toggles.forEach(({ bouton, regler }) => {
    bouton.addEventListener('click', () => {
      const ouvrir = bouton.getAttribute('aria-expanded') !== 'true';
      const avant = bouton.getBoundingClientRect().top;
      regler(ouvrir);
      if (!ouvrir) {
        const ecart = bouton.getBoundingClientRect().top - avant;
        if (ecart) window.scrollTo({ top: window.scrollY + ecart, behavior: 'instant' });
      }
      remeasure();
    });
  });
})();

// Ancres internes : défilement doux pour un saut court, saut direct quand la cible est loin
(() => {
  document.addEventListener('click', (e) => {
    const lien = e.target.closest('a[href^="#"]');
    if (!lien || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const id = decodeURIComponent(lien.getAttribute('href').slice(1));
    const cible = id ? document.getElementById(id) : null;
    if (!cible) return;
    const depart = window.scrollY;
    // Position d'arrivée exacte (marges d'ancrage comprises), mesurée sans peindre
    if (id === 'top') window.scrollTo({ top: 0, behavior: 'instant' });
    else cible.scrollIntoView({ behavior: 'instant', block: 'start' });
    const arrivee = window.scrollY;
    window.scrollTo({ top: depart, behavior: 'instant' });
    const elan = window.innerHeight * 0.9;
    if (Math.abs(arrivee - depart) <= elan * 1.5) return; // court : le défilement doux natif suffit
    e.preventDefault();
    // L'entrée d'historique est créée AVANT de bouger : le navigateur y mémorise la position
    // de départ, et le bouton « Retour » ramène bien à la section d'où l'on vient
    history.pushState(null, '', `#${id}`);
    // Long : saut direct jusqu'à un écran de la cible, puis la fin du trajet en douceur
    const sens = arrivee > depart ? 1 : -1;
    window.scrollTo({ top: arrivee - sens * elan, behavior: 'instant' });
    window.scrollTo({ top: arrivee, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });
})();

// Tarifs pilotés par les fichiers JSON (data/). Le HTML garde une copie de secours :
// sans JavaScript, ou si un fichier ne se charge pas, la page affiche ces valeurs.
(() => {
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const euros = (n) => `${new Intl.NumberFormat('fr-FR', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 }).format(n)} €`;
  const prix = (n) => `<span class="num">${euros(n)}</span>`;
  const charger = (fichier) => fetch(fichier, { cache: 'no-cache' }).then((r) => { if (!r.ok) throw new Error(fichier); return r.json(); });
  const remesurer = () => window.dispatchEvent(new Event('resize'));

  const zoneAdhesion = document.querySelector('[data-tarifs="adhesion"]');
  if (zoneAdhesion) {
    charger('data/adhesion.json').then(({ intro, licencies, labelsFederaux, formules }) => {
      const zoneIntro = document.querySelector('[data-adhesion-intro]');
      if (zoneIntro && intro) {
        const chiffres = [
          licencies ? `<strong class="num">${licencies}</strong> ${licencies > 1 ? 'licenciés' : 'licencié'}` : '',
          labelsFederaux ? `<strong class="num">${labelsFederaux}</strong> ${labelsFederaux > 1 ? 'labels fédéraux' : 'label fédéral'}` : '',
        ].filter(Boolean);
        zoneIntro.innerHTML = `${esc(intro.replace(/[\s.:]+$/, ''))}${chiffres.length ? ` : ${chiffres.join(' et ')}` : ''}.`;
      }
      zoneAdhesion.innerHTML = formules.map((f) => {
        const total = f.cotisation + f.licence + f.forfaitSeances;
        return `<div class="formule">
          <h3>${esc(f.nom)}</h3>
          <p class="formule__prix">${prix(total)} <span>l'année</span></p>
          ${f.prixSeance ? `<p class="formule__seance">soit ${prix(f.prixSeance)} la séance</p>` : ''}
          <dl>
            <div><dt>Cotisation</dt><dd class="num">${euros(f.cotisation)}</dd></div>
            <div><dt>Licence</dt><dd class="num">${euros(f.licence)}</dd></div>
            <div><dt>Forfait séances</dt><dd class="num">${euros(f.forfaitSeances)}</dd></div>
          </dl>
          <p class="formule__supports">${f.supports.map(esc).join(', ')}</p>
        </div>`;
      }).join('');
      remesurer();
    }).catch(() => {});
  }

  if (document.querySelector('[data-formules]')) {
    charger('data/centres-aeres.json').then((d) => {
      d.durees.forEach((duree) => {
        const liste = document.querySelector(`[data-formules="${duree.id}"]`);
        const titre = document.querySelector(`[data-duree-titre="${duree.id}"]`);
        if (titre) titre.textContent = duree.libelle;
        if (!liste) return;
        liste.innerHTML = duree.formules.map((f) => `<li class="formule-g${f.plusDemande ? ' formule-g--phare' : ''}">
              <h4>${esc(f.nom)}${f.plusDemande ? ' <span class="formule-g__badge">Le plus demandé</span>' : ''}</h4>
              <p class="formule-g__prix">${prix(f.prix)} ${esc(d.unite)}</p>
              <p>${esc(f.description)}</p>
            </li>`).join('');
      });
      const annexes = document.querySelector('[data-annexes]');
      if (annexes) {
        const ligne = (l) => `<tr><th scope="row">${esc(l.libelle)}${l.precision ? `<br><small>${esc(l.precision)}</small>` : ''}</th><td>${prix(l.prix)} ${esc(l.unite)}</td></tr>`;
        annexes.innerHTML = [d.cotisationGroupe, ...d.camping, d.forfaitEnergie].map(ligne).join('');
      }
      const texte = document.querySelector('[data-livret-texte]');
      const livret = document.querySelector('[data-livret]');
      if (texte) {
        const contenu = d.livret.contenu;
        texte.textContent = `${d.livret.description.replace(/\.$/, '')} : ${contenu.slice(0, -1).join(', ')} et ${contenu.at(-1)}.`;
      }
      if (livret) {
        const part = Math.round((d.livret.priseEnChargeClub / d.livret.prix) * 100);
        livret.innerHTML = `${prix(d.livret.prix)} le livret, dont <strong>${prix(d.livret.priseEnChargeClub)} pris en charge par le club</strong> (${part} %). Il reste ${prix(d.livret.resteACharge)} par livret à votre charge, si vous choisissez ce mode de validation.`;
      }
      remesurer();
    }).catch(() => {});
  }
})();
