// Serveur de développement local : sert site/ à la racine et data/ sous /data/.
// Usage : npm run dev
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const RACINE = path.resolve(import.meta.dirname, '..');
const SITE = path.join(RACINE, 'site');
const DATA = path.join(RACINE, 'data');
const PORT = Number(process.env.PORT) || 8742;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function resolveSafe(root, relPath) {
  const resolved = path.resolve(root, relPath);
  if (resolved !== root && !resolved.startsWith(root + path.sep)) return null;
  return resolved;
}

createServer(async (req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  } catch {
    res.writeHead(400).end('Bad Request');
    return;
  }
  const isData = urlPath === '/data' || urlPath.startsWith('/data/');
  const root = isData ? DATA : SITE;
  let rel = (isData ? urlPath.slice('/data'.length) : urlPath).replace(/^\/+/, '');
  if (!isData && rel === '') rel = 'index.html';

  let filePath = resolveSafe(root, rel);
  if (!filePath) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  try {
    let info = await stat(filePath);
    if (info.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
      info = await stat(filePath);
    }
    const ext = path.extname(filePath).toLowerCase();
    const content = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(content);
  } catch {
    res.writeHead(404).end('Not Found');
  }
}).listen(PORT, '127.0.0.1', () => {
  console.log(`Serveur dev : http://localhost:${PORT}/ (site/ + data/)`);
});
