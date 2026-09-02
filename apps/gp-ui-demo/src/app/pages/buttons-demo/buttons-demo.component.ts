import { Component } from '@angular/core';

import {
  GpButtonComponent,
  GpButtonGroupComponent,
  GpSplitButtonComponent,
  GpSpeedDialComponent,
  GpToggleButtonComponent,
  GpMenuItem
} from 'gp-ui';
import { DocCodeComponent } from '../../shared/doc-code.component';
import { DocApiTableComponent, DocApiProperty } from '../../shared/doc-api-table.component';

@Component({
  selector: 'app-buttons-demo',
  standalone: true,
  imports: [
    GpButtonComponent,
    GpButtonGroupComponent,
    GpSplitButtonComponent,
    GpSpeedDialComponent,
    GpToggleButtonComponent,
    DocCodeComponent,
    DocApiTableComponent
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Button Components & Actions</h1>
        <p class="page-desc">
          Interactive buttons with support for severities, visual variants, sizes, icon positioning, loading states, and
          floating action menus.
        </p>
      </div>

      <!-- Import Section -->
      <div class="doc-section">
        <h2 class="doc-section-title">Import</h2>
        <p class="doc-section-desc">Import standalone components directly in your component or module:</p>
        <doc-code [code]="importCode" language="typescript" />
      </div>

      <!-- Severities -->
      <div class="doc-section">
        <h2 class="doc-section-title">Severities</h2>
        <p class="doc-section-desc">Semantic color styles representing different intent levels.</p>
        <div class="doc-demo-box">
          <gp-button label="Primary" severity="primary" />
          <gp-button label="Secondary" severity="secondary" />
          <gp-button label="Success" severity="success" />
          <gp-button label="Info" severity="info" />
          <gp-button label="Warning" severity="warning" />
          <gp-button label="Danger" severity="danger" />
          <gp-button label="Contrast" severity="contrast" />
        </div>
        <doc-code [code]="severityCode" language="html" />
      </div>

      <!-- Variants -->
      <div class="doc-section">
        <h2 class="doc-section-title">Visual Variants</h2>
        <p class="doc-section-desc">Choose between filled, outlined, text, and tonal visual weights.</p>
        <div class="doc-demo-box">
          <gp-button label="Filled" variant="filled" severity="primary" />
          <gp-button label="Outlined" variant="outlined" severity="primary" />
          <gp-button label="Text" variant="text" severity="primary" />
          <gp-button label="Tonal" variant="tonal" severity="primary" />
        </div>
        <doc-code [code]="variantsCode" language="html" />
      </div>

      <!-- Sizes & Icons -->
      <div class="doc-section">
        <h2 class="doc-section-title">Sizes & Icons</h2>
        <p class="doc-section-desc">Flexible sizing with left/right/top/bottom icon placement.</p>
        <div class="doc-demo-box">
          <gp-button label="Small" size="sm" severity="primary" />
          <gp-button label="Medium" size="md" severity="primary" />
          <gp-button label="Large" size="lg" severity="primary" />
          <gp-button label="Search" icon="search" severity="secondary" />
          <gp-button label="Upload" icon="upload" iconPos="right" severity="secondary" />
          <gp-button icon="check" [iconOnly]="true" severity="success" />
          <gp-button icon="trash" [iconOnly]="true" [rounded]="true" severity="danger" />
          <gp-button label="Saving..." [loading]="true" severity="primary" />
        </div>
        <doc-code [code]="iconsCode" language="html" />
      </div>

      <!-- Button Groups & Split Buttons -->
      <div class="doc-section">
        <h2 class="doc-section-title">Button Groups & Split Button</h2>
        <p class="doc-section-desc">
          Group actions together or provide dropdown menu options alongside a primary action.
        </p>
        <div class="doc-demo-box">
          <gp-button-group>
            <gp-button label="Left" severity="secondary" />
            <gp-button label="Middle" severity="secondary" />
            <gp-button label="Right" severity="secondary" />
          </gp-button-group>

          <gp-split-button label="Save Document" icon="check" [model]="splitItems" severity="primary" />
          <gp-toggle-button onLabel="Active" offLabel="Inactive" onIcon="check" offIcon="times" />
        </div>
        <doc-code [code]="groupsCode" language="html" />
      </div>

      <!-- Speed Dial -->
      <div class="doc-section">
        <h2 class="doc-section-title">Speed Dial Floating Action Button</h2>
        <p class="doc-section-desc">Reveals a circular popout menu of secondary actions when clicked.</p>
        <div class="doc-demo-box" style="height: 140px; align-items: flex-end;">
          <gp-speed-dial [model]="speedDialItems" direction="up" />
        </div>
        <doc-code [code]="speedDialCode" language="html" />
      </div>

      <!-- API Reference -->
      <div class="doc-section">
        <h2 class="doc-section-title">API Reference</h2>
        <doc-api-table title="GpButtonComponent Properties (Inputs)" [properties]="buttonProperties" />
        <doc-api-table title="GpButtonComponent Events (Outputs)" [properties]="buttonEvents" [hasDefaults]="false" />
      </div>
    </div>
  `
})
export class ButtonsDemoComponent {
  importCode = `import {
  GpButtonComponent,
  GpButtonGroupComponent,
  GpSplitButtonComponent,
  GpSpeedDialComponent,
  GpToggleButtonComponent
} from '@generatedpixel/gp-ui';`;

  severityCode = `<gp-button label="Primary" severity="primary" />
<gp-button label="Secondary" severity="secondary" />
<gp-button label="Success" severity="success" />
<gp-button label="Info" severity="info" />
<gp-button label="Warning" severity="warning" />
<gp-button label="Danger" severity="danger" />
<gp-button label="Contrast" severity="contrast" />`;

  variantsCode = `<gp-button label="Filled" variant="filled" severity="primary" />
<gp-button label="Outlined" variant="outlined" severity="primary" />
<gp-button label="Text" variant="text" severity="primary" />
<gp-button label="Tonal" variant="tonal" severity="primary" />`;

  iconsCode = `<gp-button label="Search" icon="search" severity="primary" />
<gp-button label="Upload" icon="upload" iconPos="right" severity="secondary" />
<gp-button icon="check" [iconOnly]="true" severity="success" />
<gp-button icon="trash" [iconOnly]="true" [rounded]="true" severity="danger" />
<gp-button label="Saving..." [loading]="true" severity="primary" />`;

  groupsCode = `<gp-button-group>
  <gp-button label="Left" severity="secondary" />
  <gp-button label="Middle" severity="secondary" />
  <gp-button label="Right" severity="secondary" />
</gp-button-group>

<gp-split-button label="Save Document" icon="check" [model]="splitItems" severity="primary" />
<gp-toggle-button onLabel="Active" offLabel="Inactive" onIcon="check" offIcon="times" />`;

  speedDialCode = '<gp-speed-dial [model]="speedDialItems" direction="up" />';

  splitItems: GpMenuItem[] = [
    { label: 'Update', icon: 'refresh' },
    { label: 'Delete', icon: 'trash' },
    { separator: true },
    { label: 'Quit', icon: 'times' }
  ];

  speedDialItems: GpMenuItem[] = [
    { label: 'Add', icon: 'plus' },
    { label: 'Edit', icon: 'edit' },
    { label: 'Delete', icon: 'trash' }
  ];

  buttonProperties: DocApiProperty[] = [
    { name: 'label', type: 'string', default: "''", description: 'Text label displayed on the button.' },
    { name: 'icon', type: 'string', default: "''", description: 'Icon name from the built-in SVG icon registry.' },
    {
      name: 'iconPos',
      type: "'left' | 'right' | 'top' | 'bottom'",
      default: "'left'",
      description: 'Position of the icon relative to the label.'
    },
    {
      name: 'severity',
      type: "'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'contrast'",
      default: "'primary'",
      description: 'Semantic color scheme.'
    },
    {
      name: 'variant',
      type: "'filled' | 'outlined' | 'text' | 'tonal' | 'elevated' | 'link'",
      default: "'filled'",
      description: 'Visual style variant.'
    },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Button size dimensions.' },
    {
      name: 'rounded',
      type: 'boolean',
      default: 'false',
      description: 'Renders the button with fully pill-rounded borders.'
    },
    {
      name: 'iconOnly',
      type: 'boolean',
      default: 'false',
      description: 'Renders a square/circle button without text margins.'
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables user interactions and applies disabled styling.'
    },
    {
      name: 'loading',
      type: 'boolean',
      default: 'false',
      description: 'Displays a spinning loading indicator and prevents click events.'
    },
    { name: 'badge', type: 'string', default: "''", description: 'Optional badge value displayed inside the button.' },
    {
      name: 'styleClass',
      type: 'string',
      default: "''",
      description: 'Custom CSS class attached to the root container.'
    }
  ];

  buttonEvents: DocApiProperty[] = [
    {
      name: 'onClickEvent',
      type: 'EventEmitter<MouseEvent>',
      description: 'Fires when the button is clicked and not in disabled/loading state.'
    }
  ];
}
