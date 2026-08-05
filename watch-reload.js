const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 35729;
const WATCH_DIR = path.resolve(__dirname);
const DEBOUNCE_MS = 300;

let changed = false;
let timer = null;

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.url === '/reload') {
        if (changed) {
            changed = false;
            res.writeHead(200);
            res.end(JSON.stringify({ reload: true }));
        } else {
            res.writeHead(200);
            res.end(JSON.stringify({ reload: false }));
        }
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'not found' }));
    }
});

server.listen(PORT, () => {
    console.log(`Watch reload server running on port ${PORT}`);
    console.log(`Watching: ${WATCH_DIR}`);
    console.log(`Poll http://localhost:${PORT}/reload from your browser to check for changes.`);
});

const ignoredDirs = ['node_modules', '.git', 'build', 'pdf-js', 'master-pdf-viewer'];

function shouldIgnore(filePath) {
    const relative = path.relative(WATCH_DIR, filePath);
    return ignoredDirs.some(dir => relative.startsWith(dir + path.sep) || relative.startsWith(dir));
}

fs.watch(WATCH_DIR, { recursive: true }, (eventType, filename) => {
    if (!filename) return;
    const fullPath = path.join(WATCH_DIR, filename);

    if (shouldIgnore(fullPath)) return;

    const ext = path.extname(filename).toLowerCase();
    const watchExts = ['.php', '.js', '.jsx', '.ts', '.tsx', '.scss', '.css', '.html', '.json', '.md'];
    if (!watchExts.includes(ext)) return;

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
        changed = true;
        console.log(`File changed: ${filename} — reload flag set`);
    }, DEBOUNCE_MS);
});