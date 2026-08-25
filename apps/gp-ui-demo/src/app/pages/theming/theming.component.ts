import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  GpButtonComponent,
  GpInputTextComponent,
  GpSwitchComponent,
  GpSliderComponent,
  GpColorPickerComponent,
  GpBadgeComponent,
  GpProgressBarComponent
} from 'gp-ui';
import { GpThemeManager } from 'gp-ui-theme';
import { DocCodeComponent } from '../../shared/doc-code.component';
import { DocApiTableComponent, DocApiProperty } from '../../shared/doc-api-table.component';

@Component({
  selector: 'app-theming-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GpButtonComponent,
    GpInputTextComponent,
    GpSwitchComponent,
    GpSliderComponent,
    GpColorPickerComponent,
    GpBadgeComponent,
    GpProgressBarComponent,
    DocCodeComponent,
    DocApiTableComponent
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Design Tokens & Theming System</h1>
        <p class="page-desc">
          gp-ui is built on standard CSS Custom Properties (CSS variables), allowing complete runtime customization of colors, typography, elevations, spacing, and dark mode transitions without rebuilding.
        </p>
      </div>

      <!-- Live Theme Customizer Playground -->
      <div class="theme-playground-grid">
        <!-- Controls Panel -->
        <div class="theme-controls-card">
          <h3>Interactive Theme Customizer</h3>

          <div class="control-group">
            <label>Primary Brand Color</label>
            <div class="color-picker-row">
              <gp-color-picker [presetColors]="brandPalette" (onChange)="onPrimaryColorChange($event.value)" />
              <span class="color-val">{{ primaryColor() }}</span>
            </div>
          </div>

          <div class="control-group">
            <label>Border Radius: {{ borderRadius() }}px</label>
            <gp-slider [min]="0" [max]="20" [step]="2" (onChange)="onBorderRadiusChange($event.value)" />
          </div>

          <div class="control-group">
            <label>Dark Mode</label>
            <gp-switch (onChange)="toggleDarkMode($event.checked)" />
          </div>

          <div class="control-actions">
            <gp-button label="Reset to Default" variant="outlined" severity="secondary" (onClickEvent)="resetTheme()" />
          </div>
        </div>

        <!-- Live Preview Panel -->
        <div class="theme-preview-card">
          <h3>Live Token Preview</h3>

          <div class="preview-group">
            <h4>Buttons & Badges</h4>
            <div class="preview-row">
              <gp-button label="Primary" severity="primary" />
              <gp-button label="Success" severity="success" />
              <gp-button label="Outlined" variant="outlined" severity="primary" />
              <gp-badge value="42" severity="primary" />
            </div>
          </div>

          <div class="preview-group">
            <h4>Form Controls</h4>
            <gp-input-text placeholder="Themed Input Text..." />
          </div>

          <div class="preview-group">
            <h4>Progress & Sliders</h4>
            <gp-progress-bar [value]="75" />
          </div>
        </div>
      </div>

      <!-- Custom CSS Variables Guide -->
      <div class="doc-section" style="margin-top: 2rem;">
        <h2 class="doc-section-title">Overriding Tokens in CSS</h2>
        <p class="doc-section-desc">Override any gp-ui design token globally or within a specific component container:</p>
        <doc-code [code]="cssOverrideCode" language="css" />
      </div>

      <!-- Token Reference Table -->
      <div class="doc-section">
        <h2 class="doc-section-title">Core CSS Custom Properties</h2>
        <doc-api-table title="Design Tokens" [properties]="tokenList" />
      </div>
    </div>
  `,
  styles: [`
    .theme-playground-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    @media (max-width: 768px) {
      .theme-playground-grid { grid-template-columns: 1fr; }
    }
    .theme-controls-card, .theme-preview-card {
      background: var(--gp-surface-card);
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius-md);
      padding: 1.5rem;
      box-shadow: var(--gp-shadow-sm);
    }
    .theme-controls-card h3, .theme-preview-card h3 {
      margin-top: 0;
      margin-bottom: 1.25rem;
      font-size: 1.25rem;
      font-weight: 700;
    }
    .control-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
    }
    .control-group label {
      font-size: var(--gp-font-size-sm);
      font-weight: 600;
      color: var(--gp-text-color);
    }
    .color-picker-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .color-val {
      font-family: monospace;
      font-size: var(--gp-font-size-sm);
      color: var(--gp-text-color-secondary);
    }
    .preview-group {
      margin-bottom: 1.5rem;
    }
    .preview-group h4 {
      font-size: var(--gp-font-size-sm);
      color: var(--gp-text-color-secondary);
      margin: 0 0 0.75rem 0;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .preview-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
  `]
})
export class ThemingPageComponent {
  protected primaryColor = signal<string>('#6366f1');
  protected borderRadius = signal<number>(6);

  brandPalette = [
    '#6366f1', '#3b82f6', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444',
    '#ec4899', '#8b5cf6', '#14b8a6', '#f97316', '#06b6d4', '#64748b'
  ];

  cssOverrideCode = `:root {
  --gp-primary: #6366f1;
  --gp-primary-hover: #4f46e5;
  --gp-border-radius: 8px;
  --gp-font-family: 'Inter', system-ui, sans-serif;
}

/* Dark mode theme scope */
[data-theme="gp-dark"] {
  --gp-surface-ground: #090d16;
  --gp-surface-card: #131b2e;
  --gp-surface-border: #1e293b;
  --gp-text-color: #f8fafc;
}`;

  tokenList: DocApiProperty[] = [
    { name: '--gp-primary', type: 'color', default: '#6366f1', description: 'Primary brand accent color used in buttons, active states, and highlights.' },
    { name: '--gp-primary-hover', type: 'color', default: '#4f46e5', description: 'Interactive hover color for primary elements.' },
    { name: '--gp-surface-ground', type: 'color', default: '#f8fafc', description: 'Main page and background canvas surface color.' },
    { name: '--gp-surface-card', type: 'color', default: '#ffffff', description: 'Surface color for elevated cards, dialogs, and panels.' },
    { name: '--gp-surface-border', type: 'color', default: '#e2e8f0', description: 'Default border stroke color.' },
    { name: '--gp-text-color', type: 'color', default: '#0f172a', description: 'Primary foreground text color.' },
    { name: '--gp-text-color-secondary', type: 'color', default: '#64748b', description: 'Secondary descriptive text color.' },
    { name: '--gp-border-radius', type: 'length', default: '6px', description: 'Standard corner radius for buttons and inputs.' }
  ];

  public onPrimaryColorChange(color: string): void {
    this.primaryColor.set(color);
    GpThemeManager.setCustomToken('--gp-primary', color);
  }

  public onBorderRadiusChange(radius: number): void {
    this.borderRadius.set(radius);
    GpThemeManager.setCustomToken('--gp-border-radius', `${radius}px`);
  }

  public toggleDarkMode(dark: boolean): void {
    GpThemeManager.setTheme(dark ? 'gp-dark' : 'gp-light');
  }

  public resetTheme(): void {
    GpThemeManager.resetCustomTokens();
    this.primaryColor.set('#6366f1');
    this.borderRadius.set(6);
  }
}
