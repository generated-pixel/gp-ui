const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      replaceInDir(full);
    } else if (full.endsWith('.ts')) {
      let c = fs.readFileSync(full, 'utf8');
      c = c.replace(/from 'gp-ui'/g, "from '@generatedpixel/gp-ui'");
      c = c.replace(/from 'gp-ui-icons'/g, "from '@generatedpixel/gp-ui-icons'");
      c = c.replace(/from 'gp-ui-theme'/g, "from '@generatedpixel/gp-ui-theme'");
      c = c.replace(/from 'gp-css'/g, "from '@generatedpixel/gp-css'");
      fs.writeFileSync(full, c, 'utf8');
    }
  }
}

replaceInDir(path.resolve('packages/gp-blocks/src'));
console.log('Replaced imports successfully');
