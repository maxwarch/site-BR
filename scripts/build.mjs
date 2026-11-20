// Construit la version publiée dans dist/ sans toucher aux sources :
// photos en WebP (900 et 1800 px) avec srcset, CSS, JS, HTML et JSON minifiés.
// Usage : npm run build
import { readFile, writeFile, mkdir, rm, readdir, copyFile, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { transform } from 'esbuild';
import { minify as minifyHtml } from 'html-minifier-terser';
import { execFileSync } from 'node:child_process';

const RACINE = path.resolve(import.meta.dirname, '..');
const SITE = path.join(RACINE, 'site');
const DATA = path.join(RACINE, 'data');
const IMAGES = path.join(SITE, 'images');
const DIST = path.join(RACINE, 'dist');
const LARGEURS = [480, 780, 1200, 1800];
const QUALITE_WEBP = 72;
// Tant que le site n'est pas officiellement en ligne : ni moteurs de recherche ni robots d'IA.
// Passer à true au moment de la mise en ligne définitive.
const INDEXABLE = false;
const META_ROBOTS = '<meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex, noai, noimageai">';
const ROBOTS_TXT = ['User-agent: *', 'Disallow: /', '',
  ...['GPTBot', 'ChatGPT-User', 'OAI-SearchBot', 'ClaudeBot', 'Claude-Web', 'anthropic-ai', 'Google-Extended', 'PerplexityBot', 'CCBot', 'Bytespider', 'Applebot-Extended', 'Meta-ExternalAgent', 'Amazonbot', 'cohere-ai']
    .flatMap((bot) => [`User-agent: ${bot}`, 'Disallow: /', '']),
].join('\n');

const ko = (n) => `${(n / 1024).toFixed(0)} Ko`;
let avant = 0;
let apres = 0;

async function copierDossier(src, dest, filtre = () => true) {
  await mkdir(dest, { recursive: true });
  for (const nom of await readdir(src)) {
    if (!filtre(nom)) continue;
    await copyFile(path.join(src, nom), path.join(dest, nom));
  }
}

// 1. Photos : une variante WebP par largeur, sans jamais agrandir l'original
async function photos() {
  const dossier = path.join(IMAGES, 'photos');
  const sortie = path.join(DIST, 'images/photos');
  await mkdir(sortie, { recursive: true });
  const variantes = {};
  for (const nom of (await readdir(dossier)).filter((n) => n.endsWith('.jpg'))) {
    const fichier = path.join(dossier, nom);
    avant += (await stat(fichier)).size;
    const { width } = await sharp(fichier).metadata();
    const base = nom.replace(/\.jpg$/, '');
    variantes[base] = [];
    for (const largeur of LARGEURS) {
      const l = Math.min(largeur, width);
      if (variantes[base].some((v) => v.l === l)) continue;
      const out = `${base}-${l}.webp`;
      const info = await sharp(fichier).resize({ width: l }).webp({ quality: QUALITE_WEBP, effort: 6 }).keepMetadata().toFile(path.join(sortie, out));
      apres += info.size;
      variantes[base].push({ l, out });
    }
  }
  return variantes;
}

// Injection statique des JSON (adhesion.json, centres-aeres.json) dans index.html pour le SEO.
const escHtml = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const euros = (n) => `${new Intl.NumberFormat('fr-FR', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 }).format(n)}\u00a0€`;
const prixSpan = (n) => `<span class="num">${euros(n)}</span>`;

function remplacerContenuBalise(htmlSource, attrClause, nouveauContenu) {
  const openRe = new RegExp(`<([a-z0-9]+)\\b[^>]*\\s${attrClause}(?=[\\s>])[^>]*>`, 'i');
  const openMatch = openRe.exec(htmlSource);
  if (!openMatch) return htmlSource;
  const tag = openMatch[1];
  const contentStart = openMatch.index + openMatch[0].length;
  const tagRe = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'gi');
  tagRe.lastIndex = contentStart;
  let depth = 1;
  let m;
  while ((m = tagRe.exec(htmlSource)) !== null) {
    depth += m[1] === '/' ? -1 : 1;
    if (depth === 0) {
      return htmlSource.slice(0, contentStart) + nouveauContenu + htmlSource.slice(m.index);
    }
  }
  return htmlSource;
}

async function injecterDonnees(source) {
  const adhesion = JSON.parse(await readFile(path.join(DATA, 'adhesion.json'), 'utf8'));
  const { intro, licencies, labelsFederaux, formules, famille } = adhesion;
  if (intro) {
    const chiffres = [
      licencies ? `<strong class="num">${licencies}</strong> ${licencies > 1 ? 'licenciés' : 'licencié'}` : '',
      labelsFederaux ? `<strong class="num">${labelsFederaux}</strong> ${labelsFederaux > 1 ? 'labels fédéraux' : 'label fédéral'}` : '',
    ].filter(Boolean);
    const introHtml = `${escHtml(intro.replace(/[\s.:]+$/, ''))}${chiffres.length ? ` : ${chiffres.join(' et ')}` : ''}.`;
    source = remplacerContenuBalise(source, 'data-adhesion-intro', introHtml);
  }
  const cartes = formules.map((f) => {
    const total = f.cotisation + f.licence + f.forfaitSeances;
    return `<div class="formule"><h3>${escHtml(f.nom)}</h3><p class="formule__prix">${prixSpan(total)} <span>l'année</span></p>${f.prixSeance ? `<p class="formule__seance">soit ${prixSpan(f.prixSeance)} la séance</p>` : ''}<dl><div><dt>Cotisation</dt><dd class="num">${euros(f.cotisation)}</dd></div><div><dt>Licence</dt><dd class="num">${euros(f.licence)}</dd></div><div><dt>Forfait séances</dt><dd class="num">${euros(f.forfaitSeances)}</dd></div></dl><p class="formule__supports">${f.supports.map(escHtml).join(', ')}</p></div>`;
  });
  if (famille) {
    cartes.push(`<div class="formule formule--famille"><div class="formule__tete"><h3>${escHtml(famille.nom)}</h3>${famille.totalPrecision ? `<p class="formule__total-variable">${escHtml(famille.totalPrecision)}</p>` : ''}${famille.condition ? `<p class="formule__seance">${escHtml(famille.condition)}</p>` : ''}</div><dl><div><dt>Cotisation famille</dt><dd class="num">${euros(famille.cotisation)}</dd></div><div><dt>Licence adulte</dt><dd class="num">${euros(famille.licenceAdulte)}</dd></div><div><dt>Licence jeune</dt><dd class="num">${euros(famille.licenceJeune)}</dd></div><div><dt>Forfait séances${famille.forfaitSeancesPrecision ? `<br><small>${escHtml(famille.forfaitSeancesPrecision)}</small>` : ''}</dt><dd class="num">${euros(famille.forfaitSeancesBase)}</dd></div><div><dt>Personne supplémentaire</dt><dd class="num">${euros(famille.forfaitSeancesSupplementaire)}</dd></div></dl></div>`);
  }
  source = remplacerContenuBalise(source, 'data-tarifs="adhesion"', cartes.join(''));

  const d = JSON.parse(await readFile(path.join(DATA, 'centres-aeres.json'), 'utf8'));
  for (const duree of d.durees) {
    source = remplacerContenuBalise(source, `data-duree-titre="${duree.id}"`, escHtml(duree.libelle));
    const items = duree.formules.map((f) => `<li class="formule-g${f.plusDemande ? ' formule-g--phare' : ''}"><h4>${escHtml(f.nom)}${f.plusDemande ? ' <span class="formule-g__badge">Le plus demandé</span>' : ''}</h4><p class="formule-g__prix">${prixSpan(f.prix)} ${escHtml(d.unite)}</p><p>${escHtml(f.description)}</p></li>`).join('');
    source = remplacerContenuBalise(source, `data-formules="${duree.id}"`, items);
  }
  const ligneAnnexe = (l) => `<tr><th scope="row">${escHtml(l.libelle)}${l.precision ? `<br><small>${escHtml(l.precision)}</small>` : ''}</th><td>${prixSpan(l.prix)} ${escHtml(l.unite)}</td></tr>`;
  source = remplacerContenuBalise(source, 'data-annexes', [d.cotisationGroupe, ...d.camping, d.forfaitEnergie].map(ligneAnnexe).join(''));
  const contenu = d.livret.contenu;
  const texteLivret = `${d.livret.description.replace(/\.$/, '')} : ${contenu.slice(0, -1).map(escHtml).join(', ')} et ${escHtml(contenu.at(-1))}.`;
  source = remplacerContenuBalise(source, 'data-livret-texte', texteLivret);
  const part = Math.round((d.livret.priseEnChargeClub / d.livret.prix) * 100);
  const livretHtml = `${prixSpan(d.livret.prix)} le livret, dont <strong>${prixSpan(d.livret.priseEnChargeClub)} pris en charge par le club</strong> (${part}\u00a0%). Il reste ${prixSpan(d.livret.resteACharge)} par livret à votre charge, si vous choisissez ce mode de validation.`;
  source = remplacerContenuBalise(source, 'data-livret', livretHtml);
  return source;
}

// 2. HTML : chemins vers dist/, srcset WebP, préchargement de la photo d'accueil, données JSON, minification
async function html(variantes) {
  let source = await readFile(path.join(SITE, 'index.html'), 'utf8');

  const srcset = (base) => variantes[base].map((v) => `images/photos/${v.out} ${v.l}w`).join(', ');
  const grande = (base) => `images/photos/${variantes[base].at(-1).out}`;

  // Les photos pleine largeur (accueil, location, adhésion) occupent tout l'écran ; les petites vignettes de la mosaïque au plus la moitié sur mobile et un quart sur grand écran ; les autres au plus la moitié
  source = source.replace(/(<figure class="([^"]*)">\s*)<img src="images\/photos\/([\w-]+)\.jpg"/g, (m, debut, classes, base) => {
    if (!variantes[base]) return m;
    const plein = /\b(hero__photo|plein)\b/.test(classes);
    const petite = /\bvq__[cd]\b/.test(classes);
    const sizes = plein ? '100vw' : petite ? '(max-width: 760px) 50vw, 25vw' : '(max-width: 760px) 100vw, 50vw';
    return `${debut}<img src="${grande(base)}" srcset="${srcset(base)}" sizes="${sizes}"`;
  });
  // Vignettes « Votre moment » : un quart de la largeur sur grand écran
  source = source.replace(/(<li class="porte">\s*)<img src="images\/photos\/([\w-]+)\.jpg"/g, (m, debut, base) =>
    variantes[base] ? `${debut}<img src="${grande(base)}" srcset="${srcset(base)}" sizes="(max-width: 760px) 80vw, (max-width: 1100px) 50vw, 25vw"` : m);
  // Filet de sécurité : toute photo restante passe aussi en WebP
  source = source.replace(/<img src="images\/photos\/([\w-]+)\.jpg"/g, (m, base) =>
    variantes[base] ? `<img src="${grande(base)}" srcset="${srcset(base)}" sizes="(max-width: 760px) 100vw, 50vw"` : m);
  source = source.replace(/<img ([^>]*loading="lazy"[^>]*?)>/g, (m, attrs) =>
    /\bdecoding=/.test(attrs) ? m : `<img ${attrs} decoding="async">`);

  const hero = source.match(/class="hero__photo">\s*<img src="images\/photos\/([\w-]+)-\d+\.webp"/);
  if (hero) {
    const base = hero[1];
    source = source.replace('</head>', `<link rel="preload" as="image" href="${grande(base)}" imagesrcset="${srcset(base)}" imagesizes="100vw" fetchpriority="high">\n</head>`);
  }

  source = source
    .replace('<link rel="icon" type="image/png" href="images/logo/logo-carre.png">', '<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">\n<link rel="icon" type="image/png" sizes="192x192" href="favicon-192.png">')
    .replace('<link rel="apple-touch-icon" href="images/logo/logo-carre.png">', '<link rel="apple-touch-icon" href="apple-touch-icon.png">');

  if (!INDEXABLE) source = source.replace('<meta charset="utf-8">', `<meta charset="utf-8">\n${META_ROBOTS}`);

  const restantes = source.match(/images\/photos\/[\w-]+\.jpg/g);
  if (restantes) throw new Error(`Photos JPEG encore référencées : ${restantes.join(', ')}`);

  source = await injecterDonnees(source);

  const petit = await minifyHtml(source, {
    collapseWhitespace: true,
    conservativeCollapse: true,
    removeComments: true,
    removeRedundantAttributes: true,
    sortAttributes: false,
  });
  await writeFile(path.join(DIST, 'index.html'), petit);
  return { avant: Buffer.byteLength(source), apres: Buffer.byteLength(petit) };
}

// 3. CSS et JS minifiés par esbuild
async function code(nom, loader) {
  let source = await readFile(path.join(SITE, nom), 'utf8');
  if (loader === 'js') {
    source = source.replace(/\/\/ BUILD:STRIP-START[\s\S]*?\/\/ BUILD:STRIP-END/g, '');
  }
  const { code: sortie } = await transform(source, { loader, minify: true, target: 'es2020', legalComments: 'none' });
  await mkdir(path.dirname(path.join(DIST, nom)), { recursive: true });
  await writeFile(path.join(DIST, nom), sortie);
  return { avant: Buffer.byteLength(source), apres: Buffer.byteLength(sortie) };
}

// 4. JSON compactés (les fichiers source restent lisibles pour l'agent qui les modifie)
async function donnees() {
  await mkdir(path.join(DIST, 'data'), { recursive: true });
  for (const nom of (await readdir(DATA)).filter((n) => n.endsWith('.json'))) {
    const json = JSON.parse(await readFile(path.join(DATA, nom), 'utf8'));
    await writeFile(path.join(DIST, 'data', nom), JSON.stringify(json));
  }
}

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

const variantes = await photos();
const h = await html(variantes);
const c = await code('css/style.css', 'css');
const j = await code('js/main.js', 'js');
await donnees();
await copierDossier(path.join(SITE, 'fonts'), path.join(DIST, 'fonts'), (n) => n.endsWith('.woff2'));
await copierDossier(path.join(IMAGES, 'logo'), path.join(DIST, 'images/logo'), (n) => n.endsWith('.png'));
// Favicons tirés du logo carré
const LOGO_CARRE = path.join(IMAGES, 'logo/logo-carre.png');
for (const [nom, taille] of [['favicon-32.png', 32], ['favicon-192.png', 192], ['apple-touch-icon.png', 180]]) {
  await sharp(LOGO_CARRE).resize(taille, taille).png({ compressionLevel: 9, palette: true }).toFile(path.join(DIST, nom));
}
await writeFile(path.join(DIST, '.nojekyll'), '');
if (!INDEXABLE) await writeFile(path.join(DIST, 'robots.txt'), ROBOTS_TXT);
// L'ancienne adresse de la première publication redirige vers la racine
await mkdir(path.join(DIST, 'maquettes/d-journee'), { recursive: true });
await writeFile(path.join(DIST, 'maquettes/d-journee/index.html'), `<!doctype html><meta charset="utf-8">${INDEXABLE ? '' : META_ROBOTS}<title>CDPA Bassin-Rond</title><meta http-equiv="refresh" content="0; url=../../"><link rel="canonical" href="../../"><a href="../../">CDPA Bassin-Rond</a>`);

// 5. Mot de passe : seulement si SITE_PASSWORD est défini (secret GitHub Actions).
// En local, la variable n'existe pas : la page reste lisible sans mot de passe.
const MOT_DE_PASSE = process.env.SITE_PASSWORD;
if (!MOT_DE_PASSE && process.env.REQUIRE_PASSWORD) {
  throw new Error('SITE_PASSWORD manquant : ajoute le secret dans GitHub (Settings > Secrets and variables > Actions).');
}
if (MOT_DE_PASSE) {
  const page = path.join(DIST, 'index.html');
  execFileSync(path.join(RACINE, 'node_modules/.bin/staticrypt'), [
    page, '-d', DIST, '-p', MOT_DE_PASSE, '-c', 'false', '--short', '--remember', '30',
    '--template-title', 'CDPA Bassin-Rond',
    '--template-instructions', 'Le nouveau site est en préparation. Saisissez le mot de passe pour le consulter.',
    '--template-placeholder', 'Mot de passe',
    '--template-button', 'Entrer',
    '--template-remember', 'Se souvenir de moi pendant 30 jours',
    '--template-error', 'Mot de passe incorrect.',
    '--template-toggle-show', 'Afficher le mot de passe',
    '--template-toggle-hide', 'Masquer le mot de passe',
    '--template-color-primary', '#0f5c99',
    '--template-color-secondary', '#dbe7ef',
  ], { stdio: 'ignore' });
  // L'écran de mot de passe garde le blocage des robots et les favicons
  let ecran = await readFile(page, 'utf8');
  const tete = [INDEXABLE ? '' : META_ROBOTS, '<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">', '<link rel="apple-touch-icon" href="apple-touch-icon.png">'].join('');
  ecran = ecran.replace(/<head>/i, `<head>${tete}`);
  await writeFile(page, ecran);
  console.log('Mot de passe : page chiffrée (StatiCrypt).');
}

console.log(`Photos : ${ko(avant)} → ${ko(apres)} (${Object.keys(variantes).length} photos, ${LARGEURS.join(' et ')} px)`);
console.log(`HTML   : ${ko(h.avant)} → ${ko(h.apres)}`);
console.log(`CSS    : ${ko(c.avant)} → ${ko(c.apres)}`);
console.log(`JS     : ${ko(j.avant)} → ${ko(j.apres)}`);
console.log('dist/ prêt.');
