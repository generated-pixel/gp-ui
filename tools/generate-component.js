#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const type = args[0] || 'component';
const name = args[1];

if (!name) {
  console.error(
    '❌ Error: Please specify a component name.\nUsage: node tools/generate-component.js component <component-name>'
  );
  process.exit(1);
}

const kebabName = name.toLowerCase().replace(/\s+/g, '-');
const pascalName = kebabName
  .split('-')
  .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
  .join('');
const componentClass = `Gp${pascalName}Component`;
const selector = `gp-${kebabName}`;

console.log(`🚀 Generating gp-ui component: <${selector}> (${componentClass})...`);

const compDir = path.join(__dirname, `../packages/gp-ui/src/lib/components/${kebabName}`);
if (fs.existsSync(compDir)) {
  console.error(`❌ Component directory already exists: ${compDir}`);
  process.exit(1);
}

fs.mkdirSync(compDir, { recursive: true });

// 1. Component file
const compFile = path.join(compDir, `${kebabName}.component.ts`);
const compContent = `import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: '${selector}',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: \`
    <div class="${selector}">
      <ng-content />
    </div>
  \`,
  styles: [\`
    .${selector} {
      display: inline-block;
      font-family: var(--gp-font-family);
    }
  \`]
})
export class ${componentClass} {
  @Input() disabled = false;
  @Output() onClick = new EventEmitter<MouseEvent>();
}
`;
fs.writeFileSync(compFile, compContent);

// 2. Spec file
const specFile = path.join(compDir, `${kebabName}.component.spec.ts`);
const specContent = `import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ${componentClass} } from './${kebabName}.component';

describe('${componentClass}', () => {
  let component: ${componentClass};
  let fixture: ComponentFixture<${componentClass}>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [${componentClass}]
    }).compileComponents();

    fixture = TestBed.createComponent(${componentClass});
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
`;
fs.writeFileSync(specFile, specContent);

// 3. Story file
const storyFile = path.join(compDir, `${kebabName}.stories.ts`);
const storyContent = `import { Meta, StoryObj } from '@storybook/angular';
import { ${componentClass} } from './${kebabName}.component';

const meta: Meta<${componentClass}> = {
  title: 'Components/${pascalName}',
  component: ${componentClass},
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<${componentClass}>;

export const Default: Story = {
  args: {
    disabled: false
  }
};
`;
fs.writeFileSync(storyFile, storyContent);

console.log(`✅ Component scaffolded successfully at packages/gp-ui/src/lib/components/${kebabName}/`);
console.log(`Remember to export from packages/gp-ui/src/public-api.ts if ready!`);
