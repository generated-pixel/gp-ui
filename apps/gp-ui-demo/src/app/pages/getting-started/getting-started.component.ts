import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpTagComponent, GpCardComponent } from 'gp-ui';
import { GpIconComponent } from 'gp-ui-icons';

@Component({
  selector: 'app-getting-started',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpTagComponent, GpIconComponent],
  template: `
    <div class="page-container">
      <div class="hero-section">
        <div class="hero-badge">
          <gp-tag value="v1.0.0 Stable" severity="primary" [rounded]="true" />
          <gp-tag value="Angular 19/20 Standalone" severity="success" [rounded]="true" />
        </div>
        <h1 class="hero-title">gp-ui Component Framework</h1>
        <p class="hero-subtitle">
          An enterprise-grade, design-token-driven Angular UI component framework. Built with signals, standalone components, full accessibility, internationalization, and rich theme customization.
        </p>

        <div class="hero-actions">
          <gp-button label="Explore Components" icon="chevron-right" iconPos="right" severity="primary" size="lg" />
          <gp-button label="GitHub Repository" icon="code" variant="outlined" severity="secondary" size="lg" />
        </div>
      </div>

      <div class="doc-section">
        <h2 class="doc-section-title">
          <gp-icon name="download" size="1em" />
          Installation
        </h2>
        <p class="doc-section-desc">Install gp-ui and its companion packages using npm or pnpm:</p>
        <div class="doc-code-box">
          <pre><code>npm install gp-ui gp-ui-theme gp-ui-icons</code></pre>
        </div>
      </div>

      <div class="doc-section">
        <h2 class="doc-section-title">
          <gp-icon name="palette" size="1em" />
          Importing Theme Styles
        </h2>
        <p class="doc-section-desc">Add the core theme tokens and stylesheets to your <code>angular.json</code> or root <code>styles.scss</code>:</p>
        <div class="doc-code-box">
          <pre><code>// In styles.scss:
&#64;import 'gp-ui-theme/src/themes/gp-light.css';
&#64;import 'gp-ui-theme/src/themes/gp-dark.css';
&#64;import 'gp-ui-theme/src/index.css';</code></pre>
        </div>
      </div>

      <div class="doc-section">
        <h2 class="doc-section-title">
          <gp-icon name="code" size="1em" />
          Usage in Standalone Components
        </h2>
        <p class="doc-section-desc">Import components directly into your standalone Angular components:</p>
        <div class="doc-code-box">
          <pre><code>import {{ '{' }} Component {{ '}' }} from '&#64;angular/core';
import {{ '{' }} GpButtonComponent, GpInputTextComponent, GpTableComponent {{ '}' }} from 'gp-ui';

&#64;Component({{ '{' }}
  selector: 'app-my-feature',
  standalone: true,
  imports: [GpButtonComponent, GpInputTextComponent, GpTableComponent],
  template: \`
    &lt;gp-button label="Save Changes" severity="primary" /&gt;
  \`
{{ '}' }})
export class MyFeatureComponent {{ '{' }} {{ '}' }}</code></pre>
        </div>
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
  `]
})
export class GettingStartedComponent {}
