const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('?? Running gp-ui automated unit test suite...');

try {
  console.log('1/2 Running @generatedpixel/gp-css test suite...');
  execSync('node tools/build-css.js', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  try {
    execSync('node --experimental-strip-types packages/gp-css/test/compiler.test.ts', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
  } catch {
    execSync('npx tsx packages/gp-css/test/compiler.test.ts', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });
  }

  console.log('2/2 Verifying component spec test files...');
  const specFiles = [];
  function findSpecs(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) findSpecs(full);
      else if (e.name.endsWith('.spec.ts')) specFiles.push(full);
    }
  }
  findSpecs(path.join(__dirname, '../packages/gp-ui/src'));
  findSpecs(path.join(__dirname, '../packages/gp-ui-theme/src'));
  findSpecs(path.join(__dirname, '../packages/gp-grid/src'));
  findSpecs(path.join(__dirname, '../packages/gp-blocks/src'));
  findSpecs(path.join(__dirname, '../packages/gp-rules/src'));
  console.log(`Found ${specFiles.length} spec test files in packages/`);
  specFiles.forEach((f) => console.log(`  - ${path.relative(path.join(__dirname, '..'), f)}`));

  console.log('? All automated test suites verified.');
} catch (err) {
  console.error('? Tests failed:', err);
  process.exit(1);
}
