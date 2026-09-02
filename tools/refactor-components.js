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
console.log(`Found ${files.length} components to refactor.`);

let refactoredCount = 0;

for (const filePath of files) {
  let content = fs.readFileSync(filePath, 'utf8');
  const baseName = path.basename(filePath, '.component.ts');
  const dirName = path.dirname(filePath);

  // Calculate relative import path to base
  const relToBase = path.relative(dirName, path.join(__dirname, '../packages/gp-ui/src/lib/base')).replace(/\\/g, '/');

  // Check if template exists
  const templateMatch = content.match(/template:\s*`([\s\S]*?)`,\s*(styles|styleUrls|styleUrl|changeDetection)/);
  // Check if styles exists
  const stylesMatch = content.match(/styles:\s*\[`([\s\S]*?)`\]/);

  let hasChanges = false;

  // 1. Extract Template
  if (templateMatch) {
    const templateContent = templateMatch[1].trim();
    const htmlPath = path.join(dirName, `${baseName}.component.html`);
    fs.writeFileSync(htmlPath, templateContent + '\n', 'utf8');

    // Replace template in ts file
    content = content.replace(/template:\s*`[\s\S]*?`/, `templateUrl: './${baseName}.component.html'`);
    hasChanges = true;
  }

  // 2. Extract Styles
  if (stylesMatch) {
    const stylesContent = stylesMatch[1].trim();
    const scssPath = path.join(dirName, `${baseName}.component.scss`);
    fs.writeFileSync(scssPath, stylesContent + '\n', 'utf8');

    // Replace styles in ts file
    content = content.replace(/styles:\s*\[`[\s\S]*?`\]/, `styleUrl: './${baseName}.component.scss'`);
    hasChanges = true;
  }

  // 3. Base class inheritance
  const isForm = content.includes('ControlValueAccessor') || dirName.includes('form');
  const baseClass = isForm ? 'GpBaseControlValueAccessor' : 'GpBase';
  const baseImportFile = isForm ? 'gp-base-control-value-accessor' : 'gp-base.component';

  // Add import if not present
  if (!content.includes(baseClass)) {
    content = `import { ${baseClass} } from '${relToBase}/${baseImportFile}';\n` + content;
  }

  // Update export class
  // Check all export class declarations in this file
  const classMatches = [...content.matchAll(/export class (\w+)(?: implements ([^{]+))?/g)];
  for (const match of classMatches) {
    const fullMatch = match[0];
    const className = match[1];
    const existingImplements = match[2];

    // Don't extend base if already extends
    if (fullMatch.includes('extends')) {
      continue;
    }

    // Check if main component class (usually ends with Component)
    if (className.endsWith('Component')) {
      let replacement = '';
      if (isForm) {
        if (existingImplements) {
          replacement = `export class ${className} extends ${baseClass} implements ${existingImplements}`;
        } else {
          replacement = `export class ${className} extends ${baseClass}`;
        }
      } else {
        if (existingImplements) {
          replacement = `export class ${className} extends ${baseClass} implements ${existingImplements}`;
        } else {
          replacement = `export class ${className} extends ${baseClass}`;
        }
      }
      content = content.replace(fullMatch, replacement);
      hasChanges = true;
    }
  }

  if (hasChanges) {
    fs.writeFileSync(filePath, content, 'utf8');
    refactoredCount++;
    console.log(`✓ Refactored: ${baseName}.component.ts (.html & .scss extracted)`);
  }
}

console.log(`\n🎉 Successfully refactored ${refactoredCount} components!`);
