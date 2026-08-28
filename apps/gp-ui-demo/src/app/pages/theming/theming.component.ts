import { Component, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  GpButtonComponent,
  GpInputTextComponent,
  GpSwitchComponent,
  GpSliderComponent,
  GpColorPickerComponent,
  GpBadgeComponent,
  GpTagComponent,
  GpProgressBarComponent
} from 'gp-ui';
import { GpThemeManager, GpThemeMeta, GpThemeMode } from 'gp-ui-theme';
import { GpIconComponent } from 'gp-ui-icons';
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
    GpTagComponent,
    GpProgressBarComponent,
    GpIconComponent,
    DocCodeComponent,
    DocApiTableComponent
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-badge-row">
          <gp-tag value="Multi-Theme Architecture" severity="primary" [rounded]="true" />
          <gp-tag value="Light & Dark Modes" severity="success" [rounded]="true" />
        </div>
        <h1>Design Tokens & Multi-Theme System</h1>
        <p class="page-desc">
          gp-ui features a comprehensive multi-theme architecture where
          <strong>every theme includes built-in Light and Dark modes</strong>. Seamlessly switch themes, toggle color
          modes, dynamically register custom palettes at runtime, or customize design tokens globally without rebuilds.
        </p>
      </div>

      <!-- Section 1: Theme Gallery -->
      <div class="doc-section">
        <div class="section-title-bar">
          <h2 class="doc-section-title">
            <gp-icon name="palette" size="1em" />
            Built-In Theme Presets
          </h2>
          <div class="mode-toggle-group">
            <span class="mode-label">Color Scheme:</span>
            <button
              type="button"
              class="mode-btn"
              [class.mode-btn-active]="currentMode() === 'light'"
              (click)="setMode('light')"
            >
              <gp-icon name="sun" size="0.9em" />
              <span>Light</span>
            </button>
            <button
              type="button"
              class="mode-btn"
              [class.mode-btn-active]="currentMode() === 'dark'"
              (click)="setMode('dark')"
            >
              <gp-icon name="moon" size="0.9em" />
              <span>Dark</span>
            </button>
            <button
              type="button"
              class="mode-btn"
              [class.mode-btn-active]="currentMode() === 'system'"
              (click)="setMode('system')"
            >
              <gp-icon name="sliders" size="0.9em" />
              <span>System</span>
            </button>
          </div>
        </div>
        <p class="doc-section-desc">
          Select any of the 8 curated themes below. Each theme adapts automatically to the selected Light or Dark color
          scheme.
        </p>

        <div class="theme-cards-grid">
          @for (theme of themes(); track theme.id) {
            <div
              class="theme-card"
              [class.theme-card-active]="activeThemeId() === theme.id"
              (click)="selectTheme(theme.id)"
            >
              <div class="theme-card-header">
                <div class="theme-title-wrap">
                  <span class="theme-card-name">{{ theme.name }}</span>
                  <span class="theme-card-id"
                    ><code>data-gp-theme="{{ theme.id }}"</code></span
                  >
                </div>
                @if (activeThemeId() === theme.id) {
                  <span class="active-badge">
                    <gp-icon name="check" size="0.85em" />
                    <span>Active</span>
                  </span>
                }
              </div>

              <p class="theme-card-desc">{{ theme.description }}</p>

              <!-- Color Ramp Bar -->
              <div class="theme-swatch-bar">
                <div class="swatch-item" [style.backgroundColor]="theme.primaryColor" title="Primary Color"></div>
                <div class="swatch-item" [style.backgroundColor]="theme.accentColor" title="Accent Highlight"></div>
                <div class="swatch-item" [style.backgroundColor]="theme.lightSurface" title="Light Surface"></div>
                <div class="swatch-item" [style.backgroundColor]="theme.darkSurface" title="Dark Surface"></div>
              </div>

              <div class="theme-card-footer">
                <gp-button
                  [label]="activeThemeId() === theme.id ? 'Selected' : 'Apply Theme'"
                  [variant]="activeThemeId() === theme.id ? 'filled' : 'outlined'"
                  [severity]="activeThemeId() === theme.id ? 'primary' : 'secondary'"
                  size="sm"
                  (onClickEvent)="selectTheme(theme.id)"
                />
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Section 2: Live Component Studio Playground -->
      <div class="theme-playground-grid">
        <!-- Controls Panel -->
        <div class="theme-controls-card">
          <div class="controls-card-header">
            <h3>Live Token Tweaker</h3>
            <gp-button
              label="Reset Tokens"
              variant="text"
              severity="secondary"
              size="sm"
              (onClickEvent)="resetTokens()"
            />
          </div>

          <div class="control-group">
            <label>Primary Brand Override</label>
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
            <label>Dark Mode Switch</label>
            <gp-switch (onChange)="toggleDarkModeSwitch($event.checked)" />
          </div>

          <!-- Dynamic Theme Creator -->
          <div class="custom-theme-creator-box">
            <h4>Create &amp; Register Custom Theme</h4>
            <p class="creator-desc">
              Register a brand new theme at runtime using the <code>GpThemeManager.registerTheme()</code> API:
            </p>

            <div class="creator-inputs">
              <gp-input-text placeholder="Theme Name (e.g. Neon Lime)" (onInputEvent)="onNewThemeNameInput($event)" />
              <div class="creator-color-pickers">
                <div class="creator-pick-item">
                  <span>Primary:</span>
                  <gp-color-picker (onChange)="onNewThemePrimaryChange($event.value)" />
                </div>
                <div class="creator-pick-item">
                  <span>Dark Surface:</span>
                  <gp-color-picker (onChange)="onNewThemeDarkBgChange($event.value)" />
                </div>
              </div>
              <gp-button
                label="Register &amp; Activate Theme"
                icon="plus"
                severity="primary"
                size="sm"
                (onClickEvent)="registerCustomTheme()"
              />
            </div>
          </div>
        </div>

        <!-- Live Preview Panel -->
        <div class="theme-preview-card">
          <div class="preview-card-header">
            <h3>Live Component Preview</h3>
            <span class="theme-status-tag">
              Theme: <strong>{{ activeThemeId() }}</strong> ({{ isDarkMode() ? 'Dark' : 'Light' }})
            </span>
          </div>

          <div class="preview-group">
            <h4>Button Severities &amp; Variants</h4>
            <div class="preview-row">
              <gp-button label="Primary" severity="primary" />
              <gp-button label="Success" severity="success" />
              <gp-button label="Info" severity="info" />
              <gp-button label="Warning" severity="warning" />
              <gp-button label="Danger" severity="danger" />
              <gp-button label="Outlined" variant="outlined" severity="primary" />
            </div>
          </div>

          <div class="preview-group">
            <h4>Tags &amp; Badges</h4>
            <div class="preview-row">
              <gp-badge value="42" severity="primary" />
              <gp-badge value="New" severity="success" />
              <gp-tag value="Active Mode: {{ isDarkMode() ? 'Dark' : 'Light' }}" severity="primary" />
              <gp-tag value="Theme: {{ activeThemeId() }}" severity="secondary" />
            </div>
          </div>

          <div class="preview-group">
            <h4>Form Controls</h4>
            <div class="preview-form-col">
              <gp-input-text placeholder="Themed Input Text..." />
            </div>
          </div>

          <div class="preview-group">
            <h4>Progress &amp; Sliders</h4>
            <gp-progress-bar [value]="68" />
          </div>

          <div class="preview-group">
            <h4>Themed Card Container</h4>
            <div class="themed-subcard">
              <h5>Container Surface &amp; Border</h5>
              <p>This sub-container automatically inherits the active theme's surface, border, and text tokens.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 3: TypeScript & JSON Theme Architecture -->
      <div class="doc-section" style="margin-top: 2rem;">
        <h2 class="doc-section-title">
          <gp-icon name="code" size="1em" />
          TypeScript &amp; JSON Base Theme Architecture
        </h2>
        <p class="doc-section-desc">
          gp-ui uses a 3-tier token hierarchy: <strong>Primitives</strong> (raw scales),
          <strong>Semantic</strong> (contextual Light &amp; Dark tokens), and <strong>Components</strong> (component
          styles). Themes are built by extending the master <code>baseTheme</code> with <code>extendTheme()</code>.
        </p>

        <h3 class="subsection-title">1. Including gp-css (@generatedpixel/gp-ui-theme)</h3>
        <p class="doc-section-desc">
          <code>gp-css</code> is provided by <code>@generatedpixel/gp-ui-theme</code>. Import the core index CSS and
          optional theme presets into your <code>styles.scss</code> or <code>angular.json</code>:
        </p>
        <doc-code [code]="gpCssImportCode" language="scss" />

        <h3 class="subsection-title" style="margin-top: 1.5rem;">2. Extending the Base Theme in TypeScript</h3>
        <doc-code [code]="extendThemeCode" language="typescript" />

        <h3 class="subsection-title" style="margin-top: 1.5rem;">3. Theme Manager Runtime API</h3>
        <doc-code [code]="tsUsageCode" language="typescript" />

        <h3 class="subsection-title" style="margin-top: 1.5rem;">4. HTML Data Attributes &amp; Sub-Tree Scoping</h3>
        <doc-code [code]="htmlUsageCode" language="html" />
      </div>

      <!-- Section 4: Token Reference Table -->
      <div class="doc-section">
        <h2 class="doc-section-title">
          <gp-icon name="bars" size="1em" />
          Core Design Tokens Reference
        </h2>
        <doc-api-table title="Design Tokens" [properties]="tokenList" />
      </div>
    </div>
  `,
  styles: [
    `
      .header-badge-row {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
      }
      .section-title-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 1rem;
        margin-bottom: 0.5rem;
      }
      .mode-toggle-group {
        display: inline-flex;
        align-items: center;
        background: var(--gp-surface-ground);
        border: 1px solid var(--gp-surface-border);
        border-radius: var(--gp-border-radius, 6px);
        padding: 0.2rem;
        gap: 0.2rem;
      }
      .mode-label {
        font-size: var(--gp-font-size-xs);
        font-weight: 600;
        color: var(--gp-text-color-secondary);
        padding: 0 0.5rem;
      }
      .mode-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.35rem 0.65rem;
        border-radius: var(--gp-border-radius-sm, 4px);
        border: none;
        background: transparent;
        color: var(--gp-text-color-secondary);
        font-size: var(--gp-font-size-xs);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .mode-btn:hover {
        color: var(--gp-text-color);
        background: var(--gp-surface-hover);
      }
      .mode-btn-active {
        background: var(--gp-primary) !important;
        color: var(--gp-primary-text) !important;
      }
      .theme-cards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 1rem;
        margin-top: 1rem;
      }
      .theme-card {
        background: var(--gp-surface-ground);
        border: 2px solid var(--gp-surface-border);
        border-radius: var(--gp-border-radius-md);
        padding: 1.25rem;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        transition: all 0.2s ease;
      }
      .theme-card:hover {
        transform: translateY(-2px);
        border-color: var(--gp-primary-hover);
        box-shadow: var(--gp-shadow-md);
      }
      .theme-card-active {
        border-color: var(--gp-primary);
        background: var(--gp-surface-card);
        box-shadow: var(--gp-shadow-md);
      }
      .theme-card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 0.5rem;
      }
      .theme-title-wrap {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
      }
      .theme-card-name {
        font-weight: 700;
        font-size: 0.95rem;
        color: var(--gp-text-color);
      }
      .theme-card-id code {
        font-size: 0.72rem;
        color: var(--gp-text-color-muted);
      }
      .active-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        background: var(--gp-primary-light);
        color: var(--gp-primary);
        border: 1px solid var(--gp-primary-border);
        font-size: 0.7rem;
        font-weight: 700;
        padding: 0.15rem 0.45rem;
        border-radius: 999px;
      }
      .theme-card-desc {
        font-size: 0.82rem;
        color: var(--gp-text-color-secondary);
        line-height: 1.4;
        margin: 0 0 1rem 0;
        flex: 1;
      }
      .theme-swatch-bar {
        display: flex;
        height: 14px;
        border-radius: 999px;
        overflow: hidden;
        margin-bottom: 1rem;
        border: 1px solid var(--gp-surface-border);
      }
      .swatch-item {
        flex: 1;
      }
      .theme-card-footer {
        display: flex;
        justify-content: flex-end;
      }
      .theme-playground-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        margin-top: 1.5rem;
      }
      @media (max-width: 900px) {
        .theme-playground-grid {
          grid-template-columns: 1fr;
        }
      }
      .theme-controls-card,
      .theme-preview-card {
        background: var(--gp-surface-card);
        border: 1px solid var(--gp-surface-border);
        border-radius: var(--gp-border-radius-md);
        padding: 1.5rem;
        box-shadow: var(--gp-shadow-sm);
      }
      .controls-card-header,
      .preview-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.25rem;
      }
      .controls-card-header h3,
      .preview-card-header h3 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 700;
      }
      .theme-status-tag {
        font-size: 0.75rem;
        color: var(--gp-text-color-secondary);
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
      .custom-theme-creator-box {
        margin-top: 1.5rem;
        padding: 1rem;
        background: var(--gp-surface-ground);
        border: 1px dashed var(--gp-surface-border);
        border-radius: var(--gp-border-radius);
      }
      .custom-theme-creator-box h4 {
        margin: 0 0 0.4rem 0;
        font-size: 0.9rem;
        font-weight: 700;
      }
      .creator-desc {
        font-size: 0.78rem;
        color: var(--gp-text-color-secondary);
        margin: 0 0 0.75rem 0;
      }
      .creator-inputs {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .creator-color-pickers {
        display: flex;
        gap: 1rem;
        align-items: center;
      }
      .creator-pick-item {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.8rem;
        color: var(--gp-text-color);
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
      .preview-form-col {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .themed-subcard {
        background: var(--gp-surface-section);
        border: 1px solid var(--gp-surface-border);
        border-radius: var(--gp-border-radius);
        padding: 1rem;
      }
      .themed-subcard h5 {
        margin: 0 0 0.25rem 0;
        font-size: 0.9rem;
      }
      .themed-subcard p {
        margin: 0;
        font-size: 0.8rem;
        color: var(--gp-text-color-secondary);
      }
      .subsection-title {
        font-size: 1rem;
        font-weight: 700;
        margin: 1rem 0 0.5rem 0;
        color: var(--gp-text-color);
      }
    `
  ]
})
export class ThemingPageComponent implements OnInit, OnDestroy {
  protected activeThemeId = signal<string>('default');
  protected currentMode = signal<GpThemeMode>('system');
  protected isDarkMode = signal<boolean>(false);
  protected primaryColor = signal<string>('#6366f1');
  protected borderRadius = signal<number>(6);
  protected themes = signal<GpThemeMeta[]>(GpThemeManager.getAvailableThemes());

  newThemeName = 'Neon Lime';
  newThemePrimary = '#84cc16';
  newThemeDarkBg = '#0d1a04';

  private unsubscribeThemeListener: (() => void) | null = null;

  brandPalette = [
    '#6366f1',
    '#3b82f6',
    '#0ea5e9',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#ec4899',
    '#8b5cf6',
    '#14b8a6',
    '#f97316',
    '#06b6d4',
    '#64748b'
  ];

  gpCssImportCode = `// 1. Core global reset, layout utilities, animations & ripple effects
@import '@generatedpixel/gp-ui-theme/src/index.css';

// 2. Default light & dark themes (or import all built-in themes)
@import '@generatedpixel/gp-ui-theme/src/themes/default.css';
// @import '@generatedpixel/gp-ui-theme/src/themes/all.css'; // Includes ocean, emerald, sunset, etc.`;

  extendThemeCode = `import { baseTheme, extendTheme, GpThemeManager } from '@generatedpixel/gp-ui-theme';

// 1. Create a custom theme by extending the master baseTheme
export const brandCustomTheme = extendTheme({
  id: 'brand-crimson',
  name: 'Brand Crimson',
  description: 'Corporate crimson branding with custom dark mode surfaces',
  light: {
    semantic: {
      primary: {
        main: '#be123c',
        text: '#ffffff',
        hover: '#9f1239',
        active: '#881337',
        light: '#fff1f2'
      },
      surfaces: {
        ground: '#fffafb',
        card: '#ffffff'
      }
    },
    components: {
      button: {
        borderRadius: '8px'
      }
    }
  },
  dark: {
    semantic: {
      primary: {
        main: '#fb7185',
        text: '#4c0519',
        hover: '#fda4af',
        active: '#fecdd3',
        light: 'rgba(244, 63, 94, 0.2)'
      },
      surfaces: {
        ground: '#1c050d',
        card: '#2e0817'
      }
    }
  }
}, baseTheme);

// 2. Register & activate dynamically at runtime
GpThemeManager.registerTheme(brandCustomTheme);
GpThemeManager.setTheme('brand-crimson');`;

  tsUsageCode = `import { GpThemeManager } from '@generatedpixel/gp-ui-theme';

// Switch Theme Presets ('default', 'ocean', 'emerald', 'sunset', 'amethyst', 'rose', 'nord', 'cyberpunk')
GpThemeManager.setTheme('ocean');

// Switch Color Mode ('light', 'dark', or 'system')
GpThemeManager.setMode('dark');

// Toggle between Light and Dark
GpThemeManager.toggleMode();

// Subscribe to real-time state changes
const unsubscribe = GpThemeManager.onChange((state) => {
  console.log('Active Theme:', state.theme);
  console.log('Mode:', state.mode);
  console.log('Effective Dark:', state.isDark);
});`;

  htmlUsageCode = `<!-- Apply Theme and Mode to the entire document -->
<html data-gp-theme="ocean" data-gp-mode="dark">
  ...
</html>

<!-- Or scope a specific theme/mode to a sub-container or dialog -->
<div data-gp-theme="sunset" data-gp-mode="light" class="themed-card">
  <h3>Golden Sunset Panel</h3>
  <gp-button label="Themed Button" severity="primary" />
</div>`;

  tokenList: DocApiProperty[] = [
    {
      name: '--gp-primary',
      type: 'color',
      default: 'varies by theme',
      description: 'Primary brand color for buttons, active navigation, focus highlights, and controls.'
    },
    {
      name: '--gp-primary-text',
      type: 'color',
      default: '#ffffff',
      description: 'Contrasting text color for primary filled elements.'
    },
    {
      name: '--gp-primary-hover',
      type: 'color',
      default: 'varies by theme',
      description: 'Interactive hover color for primary elements.'
    },
    {
      name: '--gp-primary-light',
      type: 'color',
      default: 'varies by theme',
      description: 'Subtle translucent background for active items and badges.'
    },
    {
      name: '--gp-surface-ground',
      type: 'color',
      default: 'varies by theme',
      description: 'Main canvas and background surface color.'
    },
    {
      name: '--gp-surface-card',
      type: 'color',
      default: 'varies by theme',
      description: 'Elevated card, panel, and dialog surface color.'
    },
    {
      name: '--gp-surface-border',
      type: 'color',
      default: 'varies by theme',
      description: 'Structural border and divider stroke color.'
    },
    {
      name: '--gp-text-color',
      type: 'color',
      default: 'varies by theme',
      description: 'Primary foreground text color.'
    },
    {
      name: '--gp-text-color-secondary',
      type: 'color',
      default: 'varies by theme',
      description: 'Secondary descriptive text color.'
    },
    {
      name: '--gp-border-radius',
      type: 'length',
      default: '6px (theme configurable)',
      description: 'Standard corner radius for buttons, inputs, and cards.'
    }
  ];

  ngOnInit(): void {
    this.unsubscribeThemeListener = GpThemeManager.onChange((state) => {
      this.activeThemeId.set(state.theme);
      this.currentMode.set(state.mode);
      this.isDarkMode.set(state.isDark);
      this.themes.set(GpThemeManager.getAvailableThemes());
    });
  }

  ngOnDestroy(): void {
    if (this.unsubscribeThemeListener) {
      this.unsubscribeThemeListener();
    }
  }

  public selectTheme(themeId: string): void {
    GpThemeManager.setTheme(themeId);
  }

  public setMode(mode: GpThemeMode): void {
    GpThemeManager.setMode(mode);
  }

  public toggleDarkModeSwitch(dark: boolean): void {
    GpThemeManager.setMode(dark ? 'dark' : 'light');
  }

  public onPrimaryColorChange(color: string): void {
    this.primaryColor.set(color);
    GpThemeManager.setCustomToken('--gp-primary', color);
  }

  public onBorderRadiusChange(radius: number): void {
    this.borderRadius.set(radius);
    GpThemeManager.setCustomToken('--gp-border-radius', `${radius}px`);
  }

  public onNewThemeNameInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    if (val) this.newThemeName = val;
  }

  public onNewThemePrimaryChange(val: string): void {
    this.newThemePrimary = val;
  }

  public onNewThemeDarkBgChange(val: string): void {
    this.newThemeDarkBg = val;
  }

  public resetTokens(): void {
    GpThemeManager.resetCustomTokens();
    this.borderRadius.set(6);
    this.primaryColor.set('#6366f1');
  }

  public registerCustomTheme(): void {
    const id = this.newThemeName.toLowerCase().replace(/\s+/g, '-');
    GpThemeManager.registerTheme({
      id,
      name: this.newThemeName,
      description: `Custom registered theme with ${this.newThemePrimary} accent.`,
      light: {
        semantic: {
          primary: {
            main: this.newThemePrimary,
            text: '#ffffff',
            hover: this.newThemePrimary,
            active: this.newThemePrimary,
            light: 'rgba(0, 0, 0, 0.05)'
          },
          surfaces: {
            ground: '#fafcf8',
            card: '#ffffff'
          }
        }
      },
      dark: {
        semantic: {
          primary: {
            main: this.newThemePrimary,
            text: '#000000',
            hover: this.newThemePrimary,
            active: this.newThemePrimary,
            light: 'rgba(255, 255, 255, 0.15)'
          },
          surfaces: {
            ground: this.newThemeDarkBg,
            card: '#162808'
          }
        }
      }
    });

    this.themes.set(GpThemeManager.getAvailableThemes());
    GpThemeManager.setTheme(id);
  }
}
