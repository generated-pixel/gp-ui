import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GpButtonComponent,
  GpButtonGroupComponent,
  GpSplitButtonComponent,
  GpSpeedDialComponent,
  GpToggleButtonComponent,
  GpMenuItem
} from 'gp-ui';

@Component({
  selector: 'app-buttons-demo',
  standalone: true,
  imports: [
    CommonModule,
    GpButtonComponent,
    GpButtonGroupComponent,
    GpSplitButtonComponent,
    GpSpeedDialComponent,
    GpToggleButtonComponent
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Button & Action Components</h1>
        <p class="page-desc">Comprehensive suite of buttons, split buttons, button groups, speed dials, and toggle buttons.</p>
      </div>

      <!-- Severities -->
      <div class="doc-section">
        <h2 class="doc-section-title">Severities</h2>
        <p class="doc-section-desc">Status styles representing semantic actions.</p>
        <div class="doc-demo-box">
          <gp-button label="Primary" severity="primary" />
          <gp-button label="Secondary" severity="secondary" />
          <gp-button label="Success" severity="success" />
          <gp-button label="Info" severity="info" />
          <gp-button label="Warning" severity="warning" />
          <gp-button label="Danger" severity="danger" />
          <gp-button label="Contrast" severity="contrast" />
        </div>
      </div>

      <!-- Variants -->
      <div class="doc-section">
        <h2 class="doc-section-title">Variants</h2>
        <p class="doc-section-desc">Filled, outlined, text, and tonal visual treatments.</p>
        <div class="doc-demo-box">
          <gp-button label="Filled" variant="filled" severity="primary" />
          <gp-button label="Outlined" variant="outlined" severity="primary" />
          <gp-button label="Text" variant="text" severity="primary" />
          <gp-button label="Tonal" variant="tonal" severity="primary" />
        </div>
      </div>

      <!-- Sizes -->
      <div class="doc-section">
        <h2 class="doc-section-title">Sizes</h2>
        <div class="doc-demo-box">
          <gp-button label="Small" size="sm" severity="primary" />
          <gp-button label="Medium" size="md" severity="primary" />
          <gp-button label="Large" size="lg" severity="primary" />
        </div>
      </div>

      <!-- Icons & Loading -->
      <div class="doc-section">
        <h2 class="doc-section-title">Icons & Loading States</h2>
        <div class="doc-demo-box">
          <gp-button label="Search" icon="search" severity="primary" />
          <gp-button label="Upload" icon="upload" iconPos="right" severity="secondary" />
          <gp-button icon="check" [iconOnly]="true" severity="success" />
          <gp-button icon="trash" [iconOnly]="true" [rounded]="true" severity="danger" />
          <gp-button label="Saving..." [loading]="true" severity="primary" />
        </div>
      </div>

      <!-- Button Groups & Split Buttons -->
      <div class="doc-section">
        <h2 class="doc-section-title">Button Groups & Split Button</h2>
        <div class="doc-demo-box">
          <gp-button-group>
            <gp-button label="Left" severity="secondary" />
            <gp-button label="Middle" severity="secondary" />
            <gp-button label="Right" severity="secondary" />
          </gp-button-group>

          <gp-split-button label="Save Document" icon="check" [model]="splitItems" severity="primary" />
          <gp-toggle-button onLabel="Active" offLabel="Inactive" onIcon="check" offIcon="times" />
        </div>
      </div>

      <!-- Speed Dial -->
      <div class="doc-section">
        <h2 class="doc-section-title">Speed Dial</h2>
        <div class="doc-demo-box" style="height: 120px; align-items: flex-end;">
          <gp-speed-dial [model]="speedDialItems" direction="up" />
        </div>
      </div>
    </div>
  `
})
export class ButtonsDemoComponent {
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
}
