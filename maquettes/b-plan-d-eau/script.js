(() => {
  document.documentElement.classList.add('js');

  const plan = document.querySelector('.plan');
  const reperes = [...document.querySelectorAll('.repere')];
  const lieux = [...document.querySelectorAll('.fiche .lieu')];
  const trajets = [...document.querySelectorAll('[data-trajet]')];
  const boutons = [...document.querySelectorAll('.choix button[data-cible]')];
  const large = matchMedia('(min-width: 1000px)');
  const calme = matchMedia('(prefers-reduced-motion: reduce)');
  let actif = 'ponton';

  // Le trajet tracé suit le repère survolé, sinon le lieu choisi.
  const tracer = (survole) => {
    const cible = survole || actif;
    trajets.forEach((t) => t.classList.toggle('is-trace', t.dataset.trajet === cible));
    reperes.forEach((r) => r.classList.toggle('is-survol', r.dataset.lieu === survole));
  };

  const choisir = (id, { defiler = false } = {}) => {
    actif = id;
    reperes.forEach((r) => {
      const on = r.dataset.lieu === id;
      r.classList.toggle('is-actif', on);
      r.setAttribute('aria-pressed', String(on));
    });
    lieux.forEach((l) => {
      l.classList.toggle('is-courant', l.dataset.lieu === id);
      l.classList.remove('is-verso');
      const r = l.querySelector('.retourner');
      if (r) r.setAttribute('aria-expanded', 'false');
    });
    boutons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cible === id)));
    tracer();
    if (defiler && !large.matches) {
      document.getElementById('lieu-' + id).scrollIntoView({ behavior: calme.matches ? 'auto' : 'smooth', block: 'start' });
    }
  };

  reperes.forEach((r) => {
    const id = r.dataset.lieu;
    r.addEventListener('click', () => choisir(id, { defiler: true }));
    r.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choisir(id, { defiler: true }); }
    });
    r.addEventListener('pointerenter', () => tracer(id));
    r.addEventListener('pointerleave', () => tracer());
    r.addEventListener('focus', () => tracer(id));
    r.addEventListener('blur', () => tracer());
  });

  boutons.forEach((b) => b.addEventListener('click', () => choisir(b.dataset.cible, { defiler: true })));

  document.querySelectorAll('.retourner').forEach((b) => {
    b.addEventListener('click', () => {
      const lieu = b.closest('.lieu');
      const verso = lieu.classList.toggle('is-verso');
      b.setAttribute('aria-expanded', String(verso));
    });
  });

  // Sur petit écran, la carte se recadre sur le bassin et les installations du club.
  const cadrer = () => {
    plan.setAttribute('viewBox', large.matches ? '0 0 1440 900' : '430 170 630 730');
    plan.setAttribute('preserveAspectRatio', large.matches ? 'xMidYMid slice' : 'xMidYMid meet');
  };
  cadrer();
  large.addEventListener('change', cadrer);

  // Premier trajet tracé une fois la page peinte : l'entrée mène au ponton.
  requestAnimationFrame(() => requestAnimationFrame(() => choisir(actif)));
})();
