const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🧪 Running Consumer Validation Application Test...');

const consumerDir = path.join(__dirname, '../tests/consumer-test');
const distUiDir = path.join(__dirname, '../dist/packages/gp-ui');

// Step 1: Ensure gp-ui is built
if (!fs.existsSync(distUiDir)) {
  console.log('Building gp-ui first...');
  execSync('node tools/build-all.js', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
}

try {
  console.log('Testing TypeScript compilation of external consumer app against built gp-ui library...');
  execSync('npx tsc --project tests/consumer-test/tsconfig.json --noEmit', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

  console.log(
    '✅ Consumer Validation Succeeded: Clean imports, zero type errors, package consumable as standalone NPM library.'
  );
} catch (err) {
  console.error('❌ Consumer Validation Failed:', err);
  process.exit(1);
}
