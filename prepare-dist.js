const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname);
const DIST = path.join(ROOT, 'dist');
const WP_ORG = path.join(ROOT, '.wordpress-org');

// Clean dist
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true });
}
fs.mkdirSync(DIST, { recursive: true });

const filesToCopy = [
  'master-pdf-viewer.php',
  'functions.php',
  'readme.txt',
  'sample.pdf',
];

const dirsToCopy = [
  'build',
  'pdf-js',
];

const copiedFiles = new Set();

for (const file of filesToCopy) {
  const src = path.join(ROOT, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(DIST, file));
    copiedFiles.add(file);
    console.log('Copied:', file);
  }
}

for (const dir of dirsToCopy) {
  const src = path.join(ROOT, dir);
  if (fs.existsSync(src)) {
    copyDirSync(src, path.join(DIST, dir));
    copiedFiles.add(dir);
    console.log('Copied dir:', dir);
  }
}

// Copy WordPress.org assets from .wordpress-org/ to dist root
if (fs.existsSync(WP_ORG) && fs.statSync(WP_ORG).isDirectory()) {
  const entries = fs.readdirSync(WP_ORG, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(WP_ORG, entry.name);
    const destPath = path.join(DIST, entry.name);
    if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
      copiedFiles.add(entry.name);
      console.log('Copied asset:', entry.name);
    }
  }
}

// Write .distignore inside dist/ so deploy only includes copied files
const distignore = ['*'];
for (const f of copiedFiles) {
  if (f.endsWith('/')) {
    distignore.push('!' + f);
  } else {
    distignore.push('!' + f);
  }
}
fs.writeFileSync(path.join(DIST, '.distignore'), distignore.join('\n') + '\n');
console.log('dist/ ready for deployment.');

function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
