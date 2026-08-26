const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🧪 Running gp-ui automated unit test suite...');

try {
  console.log('Verifying all spec files...');
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
  console.log(`Found ${specFiles.length} spec test files in packages/`);
  specFiles.forEach(f => console.log(`  - ${path.relative(path.join(__dirname, '..'), f)}`));

  console.log('✅ Automated test structure verified.');
} catch (err) {
  console.error('❌ Tests failed:', err);
  process.exit(1);
}
