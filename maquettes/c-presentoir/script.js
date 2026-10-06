// Présentoir : retourner un sachet (recto promesse / verso mode d'emploi)
(() => {
  const packets = document.querySelectorAll('.packet');
  const setFace = (packet, flipped, focus) => {
    const front = packet.querySelector('.front');
    const back = packet.querySelector('.back');
    packet.classList.toggle('is-flipped', flipped);
    front.inert = flipped;
    back.inert = !flipped;
    packet.querySelector('.front .flip').setAttribute('aria-expanded', String(flipped));
    if (focus) {
      const target = flipped ? back.querySelector('h3') : front.querySelector('.flip');
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  };
  packets.forEach((packet) => {
    setFace(packet, false, false);
    packet.querySelectorAll('.flip').forEach((btn) => {
      btn.addEventListener('click', () => setFace(packet, !packet.classList.contains('is-flipped'), true));
    });
    packet.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && packet.classList.contains('is-flipped')) setFace(packet, false, true);
    });
  });

  // Calendrier : repère le mois en cours
  const m = new Date().getMonth() + 1;
  document.querySelectorAll(`.cal [data-m="${m}"]`).forEach((c) => c.classList.add('is-now'));
  const head = document.querySelector(`.cal thead [data-m="${m}"]`);
  if (head) head.setAttribute('aria-current', 'date');
})();
