// Serveur de développement local avec rechargement automatique (SSE).
// Sert site/ à la racine et data/ sous /data/. Usage : npm run dev
import { createServer } from 'node:http';
import { watch } from 'node:fs';
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

const RELOAD_SCRIPT = `<script>
(() => {
  const es = new EventSource('/__reload');
  es.onmessage = (e) => {
    if (e.data === 'css') {
      document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
        const url = new URL(link.href, location.href);
        url.searchParams.set('_t', Date.now());
        link.href = url.toString();
      });
    } else {
      location.reload();
    }
  };
})();
</script>`;

const clients = new Set();
let pendingTimer = null;
let pendingKind = 'css';

function scheduleReload(filename) {
  const ext = path.extname(filename || '').toLowerCase();
  if (ext !== '.css') pendingKind = 'reload';
  clearTimeout(pendingTimer);
  pendingTimer = setTimeout(() => {
    const msg = `data: ${pendingKind}\n\n`;
    pendingKind = 'css';
    for (const res of clients) res.write(msg);
  }, 80);
}

for (const dir of [SITE, DATA]) {
  watch(dir, { recursive: true }, (_event, filename) => {
    if (!filename || path.basename(filename).startsWith('.')) return;
    scheduleReload(filename);
  });
}

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

  if (urlPath === '/__reload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.write(': connected\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
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
    let content = await readFile(filePath);
    if (ext === '.html') {
      const html = content.toString('utf8');
      content = Buffer.from(
        html.includes('</body>') ? html.replace('</body>', `${RELOAD_SCRIPT}\n</body>`) : html + RELOAD_SCRIPT,
        'utf8',
      );
    }
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(content);
  } catch {
    res.writeHead(404).end('Not Found');
  }
}).listen(PORT, '127.0.0.1', () => {
  console.log(`Serveur dev (hot reload) : http://localhost:${PORT}/ (site/ + data/)`);
});
