const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, '../packages/gp-ui/src/lib');

function replaceInDir(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'icons') replaceInDir(full);
    } else if (entry.name.endsWith('.ts')) {
      let content = fs.readFileSync(full, 'utf8');
      if (content.includes("'gp-ui-icons'")) {
        let rel = path.relative(path.dirname(full), path.join(base, 'icons/icon.component')).replace(/\\/g, '/');
        if (!rel.startsWith('.')) rel = './' + rel;
        content = content.replace(/from\s+['"]gp-ui-icons['"]/g, `from '${rel}'`);
        fs.writeFileSync(full, content);
        console.log('Updated:', entry.name, '->', rel);
      }
    }
  }
}
replaceInDir(base);
console.log('Icon import paths resolved.');
