const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const args = process.argv.slice(2);
const releaseType = args[0] || 'patch'; // 'patch', 'minor', 'major', '1.0.0-rc.1'

console.log(`🚀 Automating Release: ${releaseType}...`);

const pkgPath = path.join(__dirname, '../packages/gp-ui/package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

console.log(`Current version: ${pkg.version}`);

// Version computation
let newVersion = releaseType;
if (['patch', 'minor', 'major'].includes(releaseType)) {
  const parts = pkg.version.split('.').map(Number);
  if (releaseType === 'patch') parts[2]++;
  if (releaseType === 'minor') { parts[1]++; parts[2] = 0; }
  if (releaseType === 'major') { parts[0]++; parts[1] = 0; parts[2] = 0; }
  newVersion = parts.join('.');
}

pkg.version = newVersion;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log(`Updated package.json to version: ${newVersion}`);

// Update CHANGELOG.md
const changelogPath = path.join(__dirname, '../CHANGELOG.md');
const date = new Date().toISOString().split('T')[0];
const entry = `\n## [${newVersion}] - ${date}\n- Release of gp-ui version ${newVersion}\n- Production components, theming tokens, and accessibility enhancements.\n`;

let currentChangelog = fs.existsSync(changelogPath) ? fs.readFileSync(changelogPath, 'utf8') : '# Changelog\n';
fs.writeFileSync(changelogPath, currentChangelog + entry);

console.log('Building packages...');
execSync('node tools/build-all.js', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
execSync('node tools/package-release.js', { stdio: 'inherit', cwd: path.join(__dirname, '..') });

console.log(`\n🎉 Release v${newVersion} ready for publishing!`);
console.log(`To publish to NPM: cd dist/packages/gp-ui && npm publish`);
