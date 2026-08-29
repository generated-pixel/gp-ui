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
  if (releaseType === 'patch') {
    parts[2]++;
  }
  if (releaseType === 'minor') {
    parts[1]++;
    parts[2] = 0;
  }
  if (releaseType === 'major') {
    parts[0]++;
    parts[1] = 0;
    parts[2] = 0;
  }
  newVersion = parts.join('.');
}

const packagePaths = [
  path.join(__dirname, '../package.json'),
  path.join(__dirname, '../packages/gp-ui/package.json'),
  path.join(__dirname, '../packages/gp-ui-theme/package.json'),
  path.join(__dirname, '../packages/gp-ui-icons/package.json'),
  path.join(__dirname, '../packages/gp-css/package.json'),
  path.join(__dirname, '../packages/gp-blocks/package.json'),
  path.join(__dirname, '../packages/gp-grid/package.json')
];

packagePaths.forEach((p) => {
  if (fs.existsSync(p)) {
    const json = JSON.parse(fs.readFileSync(p, 'utf8'));
    json.version = newVersion;
    fs.writeFileSync(p, JSON.stringify(json, null, 2) + '\n');
    console.log(`Updated ${path.relative(path.join(__dirname, '..'), p)} to version: ${newVersion}`);
  }
});

const versionTsPath = path.join(__dirname, '../packages/gp-ui/src/lib/version.ts');
if (fs.existsSync(versionTsPath)) {
  fs.writeFileSync(
    versionTsPath,
    `/**\n * Current version of the @generatedpixel/gp-ui library suite.\n */\nexport const GP_UI_VERSION = '${newVersion}';\n`
  );
  console.log(`Updated packages/gp-ui/src/lib/version.ts to version: ${newVersion}`);
}

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
