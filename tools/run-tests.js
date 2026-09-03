const { execSync } = require('child_process');
const path = require('path');

console.log('?? Running gp-ui automated unit test suite...');

const workspaceRoot = path.join(__dirname, '..');
let failedSuites = 0;

function runSuite(name, callback) {
  console.log(name);
  try {
    callback();
  } catch {
    failedSuites++;
  }
}

runSuite('1/2 Running @generatedpixel/gp-css test suite...', () => {
  execSync('node tools/build-css.js', { stdio: 'inherit', cwd: workspaceRoot });
  try {
    execSync('node --experimental-strip-types packages/gp-css/test/compiler.test.ts', {
      stdio: 'inherit',
      cwd: workspaceRoot
    });
  } catch {
    execSync('npx tsx packages/gp-css/test/compiler.test.ts', {
      stdio: 'inherit',
      cwd: workspaceRoot
    });
  }
});

runSuite('2/2 Running Angular package test suites with Vitest...', () => {
  execSync('npx ng test packages-tests --watch=false', {
    stdio: 'inherit',
    cwd: workspaceRoot
  });
});

if (failedSuites === 0) {
  console.log('? All automated test suites verified.');
} else {
  console.error(`? ${failedSuites} test suite(s) failed.`);
  process.exit(1);
}
