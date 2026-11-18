// Vérifie les budgets de poids des assets générés dans dist/ (garde-fou anti-régression).
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import zlib from 'node:zlib';

const DIST = path.resolve(import.meta.dirname, '..', 'dist');

const gzipSize = async (rel) => zlib.gzipSync(await readFile(path.join(DIST, rel))).length;
const rawSize = async (rel) => (await stat(path.join(DIST, rel))).size;

const checks = [
  { label: 'CSS (gzip)', actual: await gzipSize('css/style.css'), limit: 50 * 1024 },
  { label: 'JS (gzip)', actual: await gzipSize('js/main.js'), limit: 200 * 1024 },
  { label: 'Hero LCP desktop (fb02-1800.webp)', actual: await rawSize('images/photos/fb02-1800.webp'), limit: 200 * 1024 },
  { label: 'Hero LCP mobile (fb02-780.webp)', actual: await rawSize('images/photos/fb02-780.webp'), limit: 100 * 1024 },
  {
    label: 'Polices latin initiales',
    actual: (await Promise.all([
      'fonts/FiraSans-normal-600-latin.woff2',
      'fonts/FiraSans-normal-800-latin.woff2',
      'fonts/SourceSans3-normal-400-700-latin.woff2',
    ].map(rawSize))).reduce((a, b) => a + b, 0),
    limit: 100 * 1024,
  },
];

let failed = false;
for (const c of checks) {
  const ko = (n) => `${(n / 1024).toFixed(1)} Ko`;
  const ok = c.actual <= c.limit;
  if (!ok) failed = true;
  console.log(`${ok ? 'OK' : 'KO'} ${c.label}: ${ko(c.actual)} / ${ko(c.limit)}`);
}
if (failed) process.exit(1);
