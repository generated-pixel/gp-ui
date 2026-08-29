const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      processDir(full);
    } else if (full.endsWith('.html')) {
      let c = fs.readFileSync(full, 'utf8');
      
      // Avatar size fixes
      c = c.replace(/size="medium"/g, 'size="normal"');
      c = c.replace(/size="small"/g, 'size="normal"');

      // Style attributes on custom components
      c = c.replace(/<gp-input-text([^>]*?)style="width: 100%; display: block;"/g, '<gp-input-text$1class="full-width-control"');
      c = c.replace(/<gp-password([^>]*?)style="width: 100%; display: block;"/g, '<gp-password$1class="full-width-control"');
      c = c.replace(/<gp-textarea([^>]*?)style="width: 100%; display: block;"/g, '<gp-textarea$1class="full-width-control"');
      c = c.replace(/<gp-select([^>]*?)style="width: 100%; display: block;"/g, '<gp-select$1class="full-width-control"');
      
      // rows on textarea
      c = c.replace(/rows="(\d+)"/g, '[rows]="$1"');

      // switch checked binding -> value binding
      c = c.replace(/<gp-switch([^>]*?)\[checked\]=/g, '<gp-switch$1[value]=');

      fs.writeFileSync(full, c, 'utf8');
    }
  }
}

processDir(path.resolve('packages/gp-blocks/src'));
console.log('Processed template fixes in gp-blocks successfully.');
