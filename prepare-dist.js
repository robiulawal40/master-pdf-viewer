const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname);
const DIST = path.join(ROOT, 'dist');

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

for (const file of filesToCopy) {
  const src = path.join(ROOT, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(DIST, file));
    console.log('Copied:', file);
  }
}

for (const dir of dirsToCopy) {
  const src = path.join(ROOT, dir);
  if (fs.existsSync(src)) {
    copyDirSync(src, path.join(DIST, dir));
    console.log('Copied dir:', dir);
  }
}

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
