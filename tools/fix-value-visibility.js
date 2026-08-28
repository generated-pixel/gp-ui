const fs = require('fs');
const path = require('path');

const formDir = path.join(__dirname, '../packages/gp-ui/src/lib/components/form');
const formFiles = fs.readdirSync(formDir).filter((f) => f.endsWith('.component.ts'));

for (const file of formFiles) {
  const fullPath = path.join(formDir, file);
  let content = fs.readFileSync(fullPath, 'utf8');

  // Change protected override value = signal to public override value = signal
  content = content.replace(/protected\s+override\s+value\s*=\s*signal/g, 'public override value = signal');
  content = content.replace(/protected\s+value\s*=\s*signal/g, 'public override value = signal');

  fs.writeFileSync(fullPath, content, 'utf8');
}

// Fix org-chart
const orgChartPath = path.join(__dirname, '../packages/gp-ui/src/lib/components/tree/org-chart.component.ts');
if (fs.existsSync(orgChartPath)) {
  let content = fs.readFileSync(orgChartPath, 'utf8');
  content = content.replace(
    /@Input\(\)\s+(?:override\s+)?value\?:\s*GpTreeNode;/,
    '@Input() override value: GpTreeNode | null = null;'
  );
  fs.writeFileSync(orgChartPath, content, 'utf8');
}

console.log('✅ Form value visibility normalized.');
