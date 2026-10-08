// CDPA Bassin-Rond — le fond de page change progressivement d'une section à l'autre.
(() => {
  const root = document.documentElement;
  const header = document.querySelector('.top');
  const rail = document.querySelector('.rail');
  const railLinks = [...document.querySelectorAll('.rail a')];
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
  const mix = (a, b, t) => {
    const A = hex(a), B = hex(b);
    return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(' ')})`;
  };

  let tops = [];
  let dots = [];
  const sun = document.querySelector('.rail__sun');
  const railLinks2 = [...document.querySelectorAll('.rail a')];
  const measure = () => {
    // Les ancres s'arrêtent pile sous l'en-tête : les photos pleine largeur le touchent
    root.style.setProperty('--header-real', `${header.offsetHeight}px`);
    // Sections sans photo pleine largeur en tête : l'ancre saute l'espace du haut,
    // pour que le premier titre ou la première photo arrive à 2 rem sous l'en-tête
    sections.forEach((sec) => {
      if (!sec || sec.firstElementChild?.matches('.plein')) return;
      sec.style.scrollMarginTop = '';
      const debut = sec.getBoundingClientRect().top;
      const reperes = [...sec.querySelectorAll('h2, figure')].slice(0, 3).map((el) => el.getBoundingClientRect().top - debut);
      if (!reperes.length) return;
      const avance = Math.max(0, Math.min(...reperes) - 32);
      sec.style.scrollMarginTop = `${-avance}px`;
    });
    tops = sections.map((el) => el.getBoundingClientRect().top + scrollY);
    // Centre de chaque point du rail, relatif au rail
    const box = rail.getBoundingClientRect();
    dots = railLinks2.map((a) => {
      const r = a.getBoundingClientRect();
      const d = parseFloat(getComputedStyle(a, '::after').width) || 16;
      const vertical = box.height > box.width;
      return vertical
        ? { x: r.right - box.left - d / 2, y: r.top - box.top + r.height / 2 }
        : { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
    });
  };
  // Le soleil se pose sur le point de la section courante et glisse vers le suivant
  const placeSun = (f) => {
    if (!dots.length) return;
    const i = Math.min(Math.floor(f), dots.length - 1);
    const t = reduce.matches || i >= dots.length - 1 ? 0 : f - i;
    const a = dots[i], b = dots[Math.min(i + 1, dots.length - 1)];
    sun.style.setProperty('--sun-x', `${(a.x + (b.x - a.x) * t).toFixed(1)}px`);
    sun.style.setProperty('--sun-y', `${(a.y + (b.y - a.y) * t).toFixed(1)}px`);
    if (!reduce.matches) sun.style.setProperty('--sun-turn', `${(scrollY / 6) % 360}deg`);
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
  const paint = () => {
    ticking = false;
    // Même repère que l'ancrage des liens (en-tête + marge de défilement)
    // +2 px de tolérance : un ancrage tombe parfois une fraction de pixel avant le début de section
    const y = scrollY + header.offsetHeight + 2;
    let f = progress(y);
    if (scrollY + innerHeight >= document.documentElement.scrollHeight - 2) f = ORDER.length - 1;
    if (reduce.matches) f = Math.floor(f);
    const i = Math.min(Math.floor(f), ORDER.length - 2);
    const t = Math.min(Math.max(f - i, 0), 1);
    // La couleur glisse pendant la seconde moitié de chaque section
    const eased = t < 0.5 ? 0 : (t - 0.5) * 2;
    root.style.setProperty('--ground', mix(GROUND[ORDER[i]], GROUND[ORDER[i + 1]], eased));
    root.style.setProperty('--progress', (f / (ORDER.length - 1)).toFixed(4));
    placeSun(f);

    // L'étiquette suit le point le plus proche du soleil, pour qu'ils ne se contredisent jamais
    const current = Math.min(Math.round(f), ORDER.length - 1);
    railLinks.forEach((a, k) => a.setAttribute('aria-current', k === current && y >= tops[0] ? 'true' : 'false'));
    rail.classList.toggle('is-on', scrollY > innerHeight * 0.6);
    header.classList.toggle('is-scrolled', scrollY > 24);
  };
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } };

  measure();
  paint();
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', () => { measure(); request(); });
  rail.addEventListener('transitionend', () => { measure(); request(); });
  addEventListener('load', () => { measure(); request(); });
  reduce.addEventListener?.('change', request);
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => img.addEventListener('load', () => { measure(); request(); }, { once: true }));

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
})();

// Listes de vidéos : 3 éléments visibles, « Voir plus » déplie le reste sans faire bouger la page
(() => {
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
    bouton.addEventListener('click', () => {
      // Déplier ne touche pas au défilement : la suite apparaît là où était le bouton.
      // Replier compense la hauteur retirée, pour que le bouton reste sous les yeux.
      const ouvrir = bouton.getAttribute('aria-expanded') !== 'true';
      const avant = bouton.getBoundingClientRect().top;
      regler(ouvrir);
      if (!ouvrir) {
        const ecart = bouton.getBoundingClientRect().top - avant;
        if (ecart) window.scrollTo({ top: window.scrollY + ecart, behavior: 'instant' });
      }
      // Les hauteurs de section changent : le rail et le soleil se recalent
      window.dispatchEvent(new Event('resize'));
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
    charger('data/adhesion.json').then(({ intro, licencies, formules }) => {
      const zoneIntro = document.querySelector('[data-adhesion-intro]');
      if (zoneIntro && intro) {
        // {licencies} dans le texte est remplacé par le nombre de licenciés.
        zoneIntro.innerHTML = esc(intro).replaceAll('{licencies}', `<strong class="num">${esc(licencies)}</strong>`);
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
