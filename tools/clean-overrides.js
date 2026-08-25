const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '../packages/gp-ui/src/lib/components');

function getComponentFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results = results.concat(getComponentFiles(fullPath));
    } else if (item.name.endsWith('.component.ts')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = getComponentFiles(componentsDir);

const baseProps = ['id', 'styleClass', 'style', 'ariaLabel', 'disabled'];
const cvaProps = ['name', 'placeholder', 'required', 'readonly', 'invalid'];
const cvaMethods = ['writeValue', 'registerOnChange', 'registerOnTouched', 'setDisabledState'];

for (const filePath of files) {
  let content = fs.readFileSync(filePath, 'utf8');
  const isForm = content.includes('extends GpBaseControlValueAccessor');
  const isBase = content.includes('extends GpBaseComponent') || isForm;

  if (!isBase) continue;

  const propsToOverride = isForm ? [...baseProps, ...cvaProps] : baseProps;

  // Add override to @Input() <prop> if not present
  for (const prop of propsToOverride) {
    // Matches "@Input() <prop>" without override
    const regex = new RegExp(`@Input\\(\\)\\s+(?!override\\b)(${prop}\\b)`, 'g');
    content = content.replace(regex, '@Input() override $1');
  }

  // If form, also check methods and value signal
  if (isForm) {
    for (const method of cvaMethods) {
      const regex = new RegExp(`public\\s+(?!override\\b)(${method}\\b)`, 'g');
      content = content.replace(regex, 'public override $1');
    }
    // protected value / signal
    content = content.replace(/protected\s+(?!override\b)(value\s*=\s*signal)/g, 'protected override $1');
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

console.log('✅ Standardized override modifiers across all components.');
