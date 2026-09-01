const { execSync } = require('child_process');
const path = require('path');

console.log('?? Starting Full gp-ui Monorepo Build...');

try {
  console.log('1/5 Building Themes...');
  execSync('node tools/build-theme.js', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

  console.log('2/5 Building gp-css Utility Engine...');
  execSync('node tools/build-css.js', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

  console.log('3/5 Building Icons...');
  execSync('node tools/build-icons.js', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

  console.log('4/7 Building Core Component Library (ng-packagr)...');
  execSync('npx ng-packagr -p packages/gp-ui/ng-package.json', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

  console.log('5/7 Building gp-grid Package (ng-packagr)...');
  execSync('npx ng-packagr -p packages/gp-grid/ng-package.json -c packages/gp-grid/tsconfig.lib.prod.json', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

  console.log('6/8 Building gp-blocks Library (ng-packagr)...');
  execSync('npx ng-packagr -p packages/gp-blocks/ng-package.json -c packages/gp-blocks/tsconfig.lib.prod.json', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

  console.log('7/8 Building gp-rules Library (ng-packagr)...');
  execSync('npx ng-packagr -p packages/gp-rules/ng-package.json -c packages/gp-rules/tsconfig.lib.prod.json', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

  console.log('8/8 Building Demo Application (ng build gp-ui-demo)...');
  execSync('npx ng build gp-ui-demo', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

  console.log('✅ All packages and demo app built successfully!');
} catch (err) {
  console.error('? Build failed:', err);
  process.exit(1);
}
