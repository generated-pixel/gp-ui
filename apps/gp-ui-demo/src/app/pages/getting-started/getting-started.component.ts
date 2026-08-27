import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GpButtonComponent, GpTagComponent, GpIconComponent, GP_UI_VERSION } from 'gp-ui';
import { DocCodeComponent } from '../../shared/doc-code.component';

@Component({
  selector: 'app-getting-started',
  standalone: true,
  imports: [CommonModule, RouterModule, GpButtonComponent, GpTagComponent, GpIconComponent, DocCodeComponent],
  template: `
    <div class="page-container">
      <div class="hero-section">
        <div class="hero-badge">
          <gp-tag [value]="'v' + version" severity="primary" [rounded]="true" />
          <gp-tag value="Angular 22 Standalone" severity="success" [rounded]="true" />
        </div>
        <h1 class="hero-title">&#64;generatedpixel/gp-ui</h1>
        <p class="hero-subtitle">
          An enterprise-grade, design-token-driven Angular UI component framework. Built with signals, standalone components, 2-tier base component inheritance, full accessibility, internationalization, and modular theme customization.
        </p>

        <div class="hero-actions">
          <a routerLink="/component/button">
            <gp-button label="Explore Components" icon="chevron-right" iconPos="right" severity="primary" size="lg" />
          </a>
          <a href="https://github.com/generated-pixel/gp-ui" target="_blank" rel="noopener">
            <gp-button label="GitHub Repository" icon="code" variant="outlined" severity="secondary" size="lg" />
          </a>
        </div>
      </div>

      <!-- Installation -->
      <div class="doc-section">
        <h2 class="doc-section-title">
          <gp-icon name="download" size="1em" />
          NPM Installation
        </h2>
        <p class="doc-section-desc">Install the core UI library and companion theme tokens via npm or pnpm:</p>
        <doc-code [code]="installCode" language="bash" />
      </div>

      <!-- Theme Setup -->
      <div class="doc-section">
        <h2 class="doc-section-title">
          <gp-icon name="palette" size="1em" />
          Theme Stylesheet Setup
        </h2>
        <p class="doc-section-desc">Include the design tokens and themes in your <code>angular.json</code> or global <code>styles.scss</code>:</p>
        <doc-code [code]="themeCode" language="scss" />
      </div>

      <!-- Standalone Component Usage -->
      <div class="doc-section">
        <h2 class="doc-section-title">
          <gp-icon name="code" size="1em" />
          Usage in Standalone Angular Components
        </h2>
        <p class="doc-section-desc">Import any of the 40+ standalone UI components directly in your component's <code>imports</code> array:</p>
        <doc-code [code]="usageCode" language="typescript" />
      </div>

      <!-- Architecture -->
      <div class="doc-section">
        <h2 class="doc-section-title">
          <gp-icon name="layer-group" size="1em" />
          2-Tier Base Component Architecture
        </h2>
        <p class="doc-section-desc">All components in the library follow a clean two-tier inheritance hierarchy:</p>
        <ul class="arch-list">
          <li>
            <strong><code>GpBaseComponent</code></strong>: Base for display-only and layout containers (Buttons, Panels, Dialogs, Avatars, Tabs). Provides auto-generated unique IDs, <code>styleClass</code>, <code>style</code>, <code>ariaLabel</code>, and <code>disabled</code> state.
          </li>
          <li>
            <strong><code>GpEditableBaseComponent&lt;T&gt;</code></strong>: Extends <code>GpBaseComponent</code> for all value-bearing and form controls (InputText, Select, Checkbox, Slider, Table, DataView). Implements <code>ControlValueAccessor</code> with <code>value</code>, <code>valueChange</code>, validation flags, and form state callbacks.
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 960px;
    }
    .hero-section {
      padding: 3rem 0 2rem 0;
      margin-bottom: 2rem;
    }
    .hero-badge {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .hero-title {
      font-size: 2.75rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      margin: 0 0 1rem 0;
      background: linear-gradient(135deg, var(--gp-primary) 0%, #a855f7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-subtitle {
      font-size: 1.15rem;
      color: var(--gp-text-color-secondary);
      line-height: 1.6;
      max-width: 48rem;
      margin: 0 0 2rem 0;
    }
    .hero-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .hero-actions a {
      text-decoration: none;
    }
    .arch-list {
      padding-left: 1.5rem;
      line-height: 1.8;
      color: var(--gp-text-color);
    }
  `]
})
export class GettingStartedComponent {
  protected readonly version = GP_UI_VERSION;
  installCode = `npm install @generatedpixel/gp-ui @generatedpixel/gp-ui-theme`;

  themeCode = `// In styles.scss:
// Import all preset themes (Default, Ocean, Emerald, Sunset, Amethyst, Rose, Nord, Cyberpunk)
@import '@generatedpixel/gp-ui-theme/src/index.css';

// Or import specific theme stylesheets:
// @import '@generatedpixel/gp-ui-theme/src/themes/ocean.css';
// @import '@generatedpixel/gp-ui-theme/src/themes/emerald.css';

// Switch theme and mode dynamically in TypeScript:
import { GpThemeManager } from '@generatedpixel/gp-ui-theme';

GpThemeManager.setTheme('ocean'); // 'default' | 'ocean' | 'emerald' | 'sunset' | 'amethyst' | 'rose' | 'nord' | 'cyberpunk'
GpThemeManager.setMode('dark');   // 'light' | 'dark' | 'system'
GpThemeManager.toggleMode();      // Toggles between light and dark mode`;

  usageCode = `import { Component } from '@angular/core';
import { GpButtonComponent, GpInputTextComponent, GpTableComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'app-my-view',
  standalone: true,
  imports: [GpButtonComponent, GpInputTextComponent, GpTableComponent],
  template: \`
    <gp-button label="Save Changes" severity="primary" (onClickEvent)="onSave()" />
  \`
})
export class MyViewComponent {
  onSave(): void {
    console.log('Saved!');
  }
}`;
}
