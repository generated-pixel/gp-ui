const { execSync } = require('child_process');
const path = require('path');

console.log('📦 Starting Full gp-ui Monorepo Build...');

try {
  console.log('1/4 Building Themes...');
  execSync('node tools/build-theme.js', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

  console.log('2/4 Building Icons...');
  execSync('node tools/build-icons.js', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

  console.log('3/4 Building Core Component Library (ng-packagr)...');
  execSync('npx ng-packagr -p packages/gp-ui/ng-package.json', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

  console.log('4/4 Building Demo Application (ng build gp-ui-demo)...');
  execSync('npx ng build gp-ui-demo', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

  console.log('🎉 All packages and demo app built successfully!');
} catch (err) {
  console.error('❌ Build failed:', err);
  process.exit(1);
}
