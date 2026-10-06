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
const PAGE = path.join(RACINE, 'maquettes/d-journee');
const ASSETS = path.join(RACINE, 'maquettes/assets');
const DIST = path.join(RACINE, 'dist');
const LARGEURS = [900, 1200, 1800];
const QUALITE_WEBP = 72;
// Tant que le site n'est qu'une maquette à montrer : ni moteurs de recherche ni robots d'IA.
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
  const dossier = path.join(ASSETS, 'photos');
  const sortie = path.join(DIST, 'assets/photos');
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
      const info = await sharp(fichier).resize({ width: l }).webp({ quality: QUALITE_WEBP }).keepMetadata().toFile(path.join(sortie, out));
      apres += info.size;
      variantes[base].push({ l, out });
    }
  }
  return variantes;
}

// 2. HTML : chemins vers dist/, srcset WebP, préchargement de la photo d'accueil, minification
async function html(variantes) {
  let source = await readFile(path.join(PAGE, 'index.html'), 'utf8');
  source = source.replaceAll('../assets/', 'assets/');

  const srcset = (base) => variantes[base].map((v) => `assets/photos/${v.out} ${v.l}w`).join(', ');
  const grande = (base) => `assets/photos/${variantes[base].at(-1).out}`;

  // Les photos pleine largeur (accueil, location, adhésion) occupent tout l'écran ; les autres au plus la moitié
  source = source.replace(/(<figure class="([^"]*)">\s*)<img src="assets\/photos\/([\w-]+)\.jpg"/g, (m, debut, classes, base) => {
    if (!variantes[base]) return m;
    const plein = /\b(hero__photo|plein)\b/.test(classes);
    const sizes = plein ? '100vw' : '(max-width: 760px) 100vw, 50vw';
    return `${debut}<img src="${grande(base)}" srcset="${srcset(base)}" sizes="${sizes}"`;
  });
  // Filet de sécurité : toute photo restante passe aussi en WebP
  source = source.replace(/<img src="assets\/photos\/([\w-]+)\.jpg"/g, (m, base) =>
    variantes[base] ? `<img src="${grande(base)}" srcset="${srcset(base)}" sizes="(max-width: 760px) 100vw, 50vw"` : m);

  const hero = source.match(/class="hero__photo">\s*<img src="assets\/photos\/([\w-]+)-\d+\.webp"/);
  if (hero) {
    const base = hero[1];
    source = source.replace('</head>', `<link rel="preload" as="image" href="${grande(base)}" imagesrcset="${srcset(base)}" imagesizes="100vw" fetchpriority="high">\n</head>`);
  }

  source = source
    .replace('<link rel="icon" type="image/png" href="assets/logo/logo-carre.png">', '<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">\n<link rel="icon" type="image/png" sizes="192x192" href="favicon-192.png">')
    .replace('<link rel="apple-touch-icon" href="assets/logo/logo-carre.png">', '<link rel="apple-touch-icon" href="apple-touch-icon.png">');

  if (!INDEXABLE) source = source.replace('<meta charset="utf-8">', `<meta charset="utf-8">\n${META_ROBOTS}`);

  const restantes = source.match(/assets\/photos\/[\w-]+\.jpg/g);
  if (restantes) throw new Error(`Photos JPEG encore référencées : ${restantes.join(', ')}`);

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
  const source = await readFile(path.join(PAGE, nom), 'utf8');
  const { code: sortie } = await transform(source, { loader, minify: true, target: 'es2020', legalComments: 'none' });
  await writeFile(path.join(DIST, nom), sortie);
  return { avant: Buffer.byteLength(source), apres: Buffer.byteLength(sortie) };
}

// 4. JSON compactés (les fichiers source restent lisibles pour l'agent qui les modifie)
async function donnees() {
  const src = path.join(PAGE, 'data');
  await mkdir(path.join(DIST, 'data'), { recursive: true });
  for (const nom of (await readdir(src)).filter((n) => n.endsWith('.json'))) {
    const json = JSON.parse(await readFile(path.join(src, nom), 'utf8'));
    await writeFile(path.join(DIST, 'data', nom), JSON.stringify(json));
  }
}

await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

const variantes = await photos();
const h = await html(variantes);
const c = await code('style.css', 'css');
const j = await code('script.js', 'js');
await donnees();
await copierDossier(path.join(PAGE, 'fonts'), path.join(DIST, 'fonts'), (n) => n.endsWith('.woff2'));
await copierDossier(path.join(ASSETS, 'logo'), path.join(DIST, 'assets/logo'));
// Favicons tirés du logo carré
const LOGO_CARRE = path.join(ASSETS, 'logo/logo-carre.png');
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
    '--template-instructions', 'Cette maquette du nouveau site est protégée. Saisissez le mot de passe pour la consulter.',
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
