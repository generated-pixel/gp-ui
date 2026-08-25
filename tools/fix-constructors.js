const fs = require('fs');
const path = require('path');

const files = [
  'packages/gp-ui/src/lib/components/overlay/popover.component.ts',
  'packages/gp-ui/src/lib/components/navigation/menu.component.ts',
  'packages/gp-ui/src/lib/components/form/select.component.ts',
  'packages/gp-ui/src/lib/components/form/time-picker.component.ts',
  'packages/gp-ui/src/lib/components/form/tree-select.component.ts',
  'packages/gp-ui/src/lib/components/form/slider.component.ts',
  'packages/gp-ui/src/lib/components/form/multi-select.component.ts',
  'packages/gp-ui/src/lib/components/form/date-picker.component.ts',
  'packages/gp-ui/src/lib/components/form/color-picker.component.ts',
  'packages/gp-ui/src/lib/components/form/cascade-select.component.ts',
  'packages/gp-ui/src/lib/components/form/autocomplete.component.ts',
  'packages/gp-ui/src/lib/components/button/split-button.component.ts'
];

for (const rel of files) {
  const fullPath = path.join(__dirname, '..', rel);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(/constructor\(([^)]*)\)\s*\{\}/g, 'constructor($1) {\n    super();\n  }');
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated constructor in ${rel}`);
  }
}
