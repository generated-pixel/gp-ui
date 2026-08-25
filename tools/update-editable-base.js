const fs = require('fs');
const path = require('path');

const valueHoldingComponents = [
  // Form controls
  'packages/gp-ui/src/lib/components/form/autocomplete.component.ts',
  'packages/gp-ui/src/lib/components/form/cascade-select.component.ts',
  'packages/gp-ui/src/lib/components/form/checkbox.component.ts',
  'packages/gp-ui/src/lib/components/form/color-picker.component.ts',
  'packages/gp-ui/src/lib/components/form/date-picker.component.ts',
  'packages/gp-ui/src/lib/components/form/file-upload.component.ts',
  'packages/gp-ui/src/lib/components/form/input-mask.component.ts',
  'packages/gp-ui/src/lib/components/form/input-number.component.ts',
  'packages/gp-ui/src/lib/components/form/input-text.component.ts',
  'packages/gp-ui/src/lib/components/form/listbox.component.ts',
  'packages/gp-ui/src/lib/components/form/multi-select.component.ts',
  'packages/gp-ui/src/lib/components/form/password.component.ts',
  'packages/gp-ui/src/lib/components/form/radio-button.component.ts',
  'packages/gp-ui/src/lib/components/form/rating.component.ts',
  'packages/gp-ui/src/lib/components/form/select.component.ts',
  'packages/gp-ui/src/lib/components/form/slider.component.ts',
  'packages/gp-ui/src/lib/components/form/switch.component.ts',
  'packages/gp-ui/src/lib/components/form/textarea.component.ts',
  'packages/gp-ui/src/lib/components/form/time-picker.component.ts',
  'packages/gp-ui/src/lib/components/form/tree-select.component.ts',
  // Value button
  'packages/gp-ui/src/lib/components/button/toggle-button.component.ts',
  // Value data components
  'packages/gp-ui/src/lib/components/data/data-view.component.ts',
  'packages/gp-ui/src/lib/components/data/table.component.ts',
  'packages/gp-ui/src/lib/components/data/tree-table.component.ts',
  'packages/gp-ui/src/lib/components/data/virtual-scroller.component.ts',
  'packages/gp-ui/src/lib/components/tree/tree.component.ts',
  'packages/gp-ui/src/lib/components/tree/org-chart.component.ts',
  // Value display components
  'packages/gp-ui/src/lib/components/display/carousel.component.ts',
  'packages/gp-ui/src/lib/components/display/meter-group.component.ts',
  'packages/gp-ui/src/lib/components/display/timeline.component.ts',
  'packages/gp-ui/src/lib/components/feedback/progress-bar.component.ts',
  'packages/gp-ui/src/lib/components/feedback/progress-spinner.component.ts'
];

for (const rel of valueHoldingComponents) {
  const fullPath = path.join(__dirname, '..', rel);
  if (!fs.existsSync(fullPath)) continue;

  let content = fs.readFileSync(fullPath, 'utf8');
  const dirName = path.dirname(fullPath);
  const relToBase = path.relative(dirName, path.join(__dirname, '../packages/gp-ui/src/lib/base')).replace(/\\/g, '/');

  // Replace import
  content = content.replace(/import\s*\{\s*(GpBaseComponent|GpBaseControlValueAccessor)\s*\}\s*from\s*'[^']+';?/, '');
  content = `import { GpEditableBaseComponent } from '${relToBase}/gp-editable-base.component';\n` + content.trimStart();

  // Replace extends
  content = content.replace(/extends\s+(GpBaseComponent|GpBaseControlValueAccessor)/g, 'extends GpEditableBaseComponent');

  // Ensure override modifier on value if present
  content = content.replace(/@Input\(\)\s+(?!override\b)value\b/g, '@Input() override value');

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Updated to GpEditableBaseComponent: ${rel}`);
}

console.log('✅ Value components updated.');
