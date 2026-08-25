const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../packages/gp-ui-theme/src');
const distDir = path.join(__dirname, '../dist/packages/gp-ui-theme');

console.log('🎨 Building gp-ui-theme package...');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyDir(srcDir, path.join(distDir, 'src'));
fs.copyFileSync(path.join(__dirname, '../packages/gp-ui-theme/package.json'), path.join(distDir, 'package.json'));

console.log('✅ gp-ui-theme built successfully.');
