const fs = require('fs');
const path = require('path');

console.log('🔍 Running gp-ui architectural linter...');

const libDir = path.join(__dirname, '../packages/gp-ui/src/lib');
let errors = 0;

function checkFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      checkFiles(fullPath);
    } else if (entry.name.endsWith('.component.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');

      // Skip base directive classes (which are abstract @Directive rather than @Component)
      if (entry.name.startsWith('gp-base') || entry.name.startsWith('gp-editable-base')) {
        continue;
      }

      if (content.includes('@Component(')) {
        // Rule 1: Must be standalone: true
        if (!content.includes('standalone: true')) {
          console.error(`❌ [Lint Error] Component must be standalone: ${fullPath}`);
          errors++;
        }
        // Rule 2: Must use OnPush ChangeDetection
        if (!content.includes('ChangeDetectionStrategy.OnPush')) {
          console.error(`❌ [Lint Error] Component must use ChangeDetectionStrategy.OnPush: ${fullPath}`);
          errors++;
        }
        // Rule 3: Must not import from third-party component libraries
        if (content.includes('primeng') || content.includes('@angular/material')) {
          console.error(`❌ [Lint Error] Component must not depend on third-party UI libraries: ${fullPath}`);
          errors++;
        }
      }
    }
  }
}

checkFiles(path.join(__dirname, '../packages/gp-ui/src/lib'));
if (fs.existsSync(path.join(__dirname, '../packages/gp-grid/src/lib'))) {
  checkFiles(path.join(__dirname, '../packages/gp-grid/src/lib'));
}
if (fs.existsSync(path.join(__dirname, '../packages/gp-blocks/src/lib'))) {
  checkFiles(path.join(__dirname, '../packages/gp-blocks/src/lib'));
}
if (fs.existsSync(path.join(__dirname, '../packages/gp-rules/src/lib'))) {
  checkFiles(path.join(__dirname, '../packages/gp-rules/src/lib'));
}

if (errors === 0) {
  console.log('✅ All components pass architectural lint rules (standalone, OnPush, no 3rd-party dependencies)!');
} else {
  console.error(`❌ Lint failed with ${errors} error(s).`);
  process.exit(1);
}
