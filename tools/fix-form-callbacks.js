const fs = require('fs');
const path = require('path');

const formDir = path.join(__dirname, '../packages/gp-ui/src/lib/components/form');
const files = fs.readdirSync(formDir).filter(f => f.endsWith('.component.ts'));

for (const file of files) {
  const fullPath = path.join(formDir, file);
  let content = fs.readFileSync(fullPath, 'utf8');

  // Replace private onChangeCallback and onTouchedCallback with inherited versions
  content = content.replace(/private\s+onChangeCallback[\s\S]*?;/g, '// Inherited onChangeCallback');
  content = content.replace(/private\s+onTouchedCallback[\s\S]*?;/g, '// Inherited onTouchedCallback');

  // Also replace any private onChange / onTouched declarations
  content = content.replace(/private\s+onChange[\s\S]*?;/g, '// Inherited onChange');
  content = content.replace(/private\s+onTouched[\s\S]*?;/g, '// Inherited onTouched');

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Updated form callbacks in ${file}`);
}
