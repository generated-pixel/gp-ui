const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('⚡ Building gp-ui-icons package...');

const distDir = path.join(__dirname, '../dist/packages/gp-ui-icons');
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

copyDir(path.join(__dirname, '../packages/gp-ui-icons/src'), path.join(distDir, 'src'));
fs.copyFileSync(path.join(__dirname, '../packages/gp-ui-icons/package.json'), path.join(distDir, 'package.json'));
const readmePath = path.join(__dirname, '../packages/gp-ui-icons/README.md');
if (fs.existsSync(readmePath)) {
  fs.copyFileSync(readmePath, path.join(distDir, 'README.md'));
}

console.log('✅ gp-ui-icons built successfully.');
