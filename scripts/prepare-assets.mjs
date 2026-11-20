// Prépare les assets optimisés dans public/ à partir de site/ avant `astro build` ou `astro dev` :
// - Photos JPEG converties en variantes WebP (480, 780, 1200, 1800 px) + manifeste src/lib/photo-variants.json
// - Favicons PNG (32, 180, 192 px) générés depuis site/images/logo/logo-carre.png
// - Polices WOFF2 et logos copiés
// - CSS et JS minifiés via esbuild
import { readFile, writeFile, mkdir, rm, readdir, copyFile, stat, access } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { transform } from 'esbuild';

const RACINE = path.resolve(import.meta.dirname, '..');
const SITE = path.join(RACINE, 'site');
const IMAGES = path.join(SITE, 'images');
const PUBLIC = path.join(RACINE, 'public');
const MANIFEST = path.join(RACINE, 'src/lib/photo-variants.json');
const LARGEURS = [480, 780, 1200, 1800];
const QUALITE_WEBP = 72;

const ifMissing = process.argv.includes('--if-missing');
if (ifMissing) {
  try {
    await access(MANIFEST);
    await access(path.join(PUBLIC, 'css/style.css'));
    await access(path.join(PUBLIC, 'js/main.js'));
    console.log('Assets public/ déjà prêts.');
    process.exit(0);
  } catch {
    // Générer les assets
  }
}

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

async function photos() {
  const dossier = path.join(IMAGES, 'photos');
  const sortie = path.join(PUBLIC, 'images/photos');
  await mkdir(sortie, { recursive: true });
  const variantes = {};
  for (const nom of (await readdir(dossier)).filter((n) => n.endsWith('.jpg')).sort()) {
    const fichier = path.join(dossier, nom);
    avant += (await stat(fichier)).size;
    const { width } = await sharp(fichier).metadata();
    const base = nom.replace(/\.jpg$/, '');
    variantes[base] = [];
    for (const largeur of LARGEURS) {
      const l = Math.min(largeur, width);
      if (variantes[base].some((v) => v.l === l)) continue;
      const out = `${base}-${l}.webp`;
      const info = await sharp(fichier)
        .resize({ width: l })
        .webp({ quality: QUALITE_WEBP, effort: 6 })
        .keepMetadata()
        .toFile(path.join(sortie, out));
      apres += info.size;
      variantes[base].push({ l, out });
    }
  }
  await mkdir(path.dirname(MANIFEST), { recursive: true });
  await writeFile(MANIFEST, JSON.stringify(variantes, null, 2) + '\n');
  return variantes;
}

async function code(nom, loader) {
  const source = await readFile(path.join(SITE, nom), 'utf8');
  const { code: sortie } = await transform(source, {
    loader,
    minify: true,
    target: 'es2020',
    legalComments: 'none',
  });
  await mkdir(path.dirname(path.join(PUBLIC, nom)), { recursive: true });
  await writeFile(path.join(PUBLIC, nom), sortie);
  return { avant: Buffer.byteLength(source), apres: Buffer.byteLength(sortie) };
}

await rm(PUBLIC, { recursive: true, force: true });
await mkdir(PUBLIC, { recursive: true });

const variantes = await photos();
const c = await code('css/style.css', 'css');
const j = await code('js/main.js', 'js');
await copierDossier(path.join(SITE, 'fonts'), path.join(PUBLIC, 'fonts'), (n) => n.endsWith('.woff2'));
await copierDossier(path.join(IMAGES, 'logo'), path.join(PUBLIC, 'images/logo'), (n) => n.endsWith('.png'));

const LOGO_CARRE = path.join(IMAGES, 'logo/logo-carre.png');
for (const [nom, taille] of [
  ['favicon-32.png', 32],
  ['favicon-192.png', 192],
  ['apple-touch-icon.png', 180],
]) {
  await sharp(LOGO_CARRE)
    .resize(taille, taille)
    .png({ compressionLevel: 9, palette: true })
    .toFile(path.join(PUBLIC, nom));
}

console.log(`Photos : ${ko(avant)} → ${ko(apres)} (${Object.keys(variantes).length} photos, ${LARGEURS.join(', ')} px)`);
console.log(`CSS    : ${ko(c.avant)} → ${ko(c.apres)}`);
console.log(`JS     : ${ko(j.avant)} → ${ko(j.apres)}`);
console.log('public/ prêt.');
