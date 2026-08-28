const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../packages/gp-css');
const distDir = path.join(__dirname, '../dist/packages/gp-css');

console.log('?? Compiling @generatedpixel/gp-css engine...');

try {
  execSync('npx tsc -p packages/gp-css/tsconfig.json', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

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
        if (entry.name === 'node_modules') {
          continue;
        }
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  copyDir(path.join(srcDir, 'dist'), path.join(distDir, 'dist'));
  fs.copyFileSync(path.join(srcDir, 'package.json'), path.join(distDir, 'package.json'));
  fs.copyFileSync(path.join(srcDir, 'README.md'), path.join(distDir, 'README.md'));
  if (fs.existsSync(path.join(srcDir, 'bin'))) {
    copyDir(path.join(srcDir, 'bin'), path.join(distDir, 'bin'));
  }

  console.log('? @generatedpixel/gp-css engine compiled and built successfully.');
} catch (err) {
  console.error('? Failed to build gp-css:', err);
  process.exit(1);
}
