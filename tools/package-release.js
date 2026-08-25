const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Packaging gp-ui for NPM release...');

const rootPkg = require('../package.json');
const distUiDir = path.join(__dirname, '../dist/packages/gp-ui');

if (!fs.existsSync(distUiDir)) {
  console.log('Building gp-ui first...');
  execSync('npx ng build gp-ui', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
}

// Ensure README is copied
const readmeSrc = path.join(__dirname, '../README.md');
const readmeDest = path.join(distUiDir, 'README.md');
if (fs.existsSync(readmeSrc)) {
  fs.copyFileSync(readmeSrc, readmeDest);
}

// Generate tarball
console.log('Creating npm pack tarball...');
execSync('npm pack', { stdio: 'inherit', cwd: distUiDir });

console.log('✅ gp-ui release package generated in dist/packages/gp-ui/');
