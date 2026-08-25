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
  GpCardComponent,
  GpProgressBarComponent
} from 'gp-ui';
import { GpThemeManager } from 'gp-ui-theme';
import { GpIconComponent } from 'gp-ui-icons';

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
    GpProgressBarComponent
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Design Tokens & Theme Playground</h1>
        <p class="page-desc">
          Customize design tokens at runtime and instantly see them applied across all components.
        </p>
      </div>

      <div class="theme-playground-grid">
        <!-- Controls Panel -->
        <div class="theme-controls-card">
          <h3>Theme Customizer</h3>

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
    </div>
  `,
  styles: [`
    .page-header h1 {
      font-size: 2rem;
      font-weight: 800;
      margin: 0 0 0.5rem 0;
    }
    .page-desc {
      color: var(--gp-text-color-secondary);
      margin: 0 0 2rem 0;
    }
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
