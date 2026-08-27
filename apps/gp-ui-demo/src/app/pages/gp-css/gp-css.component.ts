import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GpButtonComponent, GpTagComponent, GpIconComponent, GP_UI_VERSION } from 'gp-ui';
import { DocCodeComponent } from '../../shared/doc-code.component';

@Component({
  selector: 'app-gp-css-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    GpButtonComponent,
    GpTagComponent,
    GpIconComponent,
    DocCodeComponent
  ],
  template: `
    <div class="page-container">
      <div class="hero-section">
        <div class="hero-badge">
          <gp-tag [value]="'v' + version" severity="primary" [rounded]="true" />
          <gp-tag value="Utility-First Engine" severity="success" [rounded]="true" />
        </div>
        <h1 class="hero-title">&#64;generatedpixel/gp-css</h1>
        <p class="hero-subtitle">
          Generated Pixel's utility-first CSS framework and compiler engine. Tailored for maximum synergy with <strong>gp-theme</strong> design tokens and <strong>gp-ui</strong> component primitives.
        </p>

        <div class="hero-actions">
          <a href="#directives">
            <gp-button label="Explore Directives" icon="code" severity="primary" size="lg" />
          </a>
          <a href="#tokens">
            <gp-button label="Theme Token Bridge" icon="palette" variant="outlined" severity="secondary" size="lg" />
          </a>
        </div>
      </div>

      <!-- Live Interactive Showcase -->
      <div class="doc-section">
        <h2 class="doc-section-title">
          <gp-icon name="sparkles" size="1em" />
          Interactive Utility Showcase
        </h2>
        <p class="doc-section-desc">Experience <code>gp-css</code> utility classes live with glassmorphism, glow effects, and responsive layout styling:</p>

        <div class="showcase-card">
          <div class="flex-row">
            <div class="flex-left">
              <div class="badge-icon">GP</div>
              <div>
                <h3 class="card-title">gp-css + gp-ui + gp-theme</h3>
                <p class="card-subtitle">Design Token Driven Utility Engine</p>
              </div>
            </div>
            <div class="tag-row">
              <gp-tag value="JIT Scanner" severity="primary" />
              <gp-tag value="Zero Config" severity="info" />
            </div>
          </div>

          <p class="card-desc">
            <code>gp-css</code> extracts classes like <code>bg-panel</code>, <code>glass</code>, <code>glow</code>, <code>text-accent</code>, <code>p-6</code>, <code>rounded-2xl</code> directly from HTML/TS templates and produces optimized atomic stylesheets.
          </p>

          <div class="btn-row">
            <gp-button label="Primary Action" severity="primary" (onClickEvent)="onDemoClick()" />
            <gp-button label="Secondary Action" variant="outlined" severity="secondary" />
          </div>
        </div>
      </div>

      <!-- Installation & Directives -->
      <div class="doc-section" id="directives">
        <h2 class="doc-section-title">
          <gp-icon name="download" size="1em" />
          Directives & CSS Entrypoint
        </h2>
        <p class="doc-section-desc">Add <code>&#64;gp-css</code> directives to your main <code>styles.css</code> or <code>styles.scss</code> file:</p>
        <doc-code [code]="directivesCode" language="css" />
      </div>

      <!-- Theme Token Mapping -->
      <div class="doc-section" id="tokens">
        <h2 class="doc-section-title">
          <gp-icon name="palette" size="1em" />
          Native Token Synergy (gp-theme)
        </h2>
        <p class="doc-section-desc"><code>gp-css</code> maps directly to CSS variable design tokens provided by <code>gp-theme</code>:</p>

        <div class="grid-table">
          <div class="grid-row grid-header">
            <div>Utility Class</div>
            <div>CSS Output / Resolved Property</div>
            <div>Design Token</div>
          </div>
          <div class="grid-row">
            <div><code>bg-panel</code></div>
            <div><code>background-color: var(--panel)</code></div>
            <div><code>rgba(15, 23, 42, 0.78)</code></div>
          </div>
          <div class="grid-row">
            <div><code>text-accent</code></div>
            <div><code>color: var(--accent)</code></div>
            <div><code>#67e8f9</code></div>
          </div>
          <div class="grid-row">
            <div><code>glass</code></div>
            <div><code>backdrop-filter: blur(12px); border: 1px solid var(--panel-border)</code></div>
            <div>Glassmorphic Container</div>
          </div>
          <div class="grid-row">
            <div><code>glow</code></div>
            <div><code>box-shadow: 0 0 25px rgba(103, 232, 249, 0.35)</code></div>
            <div>Cyan Glow Effect</div>
          </div>
        </div>
      </div>

      <!-- Programmatic Usage -->
      <div class="doc-section">
        <h2 class="doc-section-title">
          <gp-icon name="code" size="1em" />
          CLI & Compiler API
        </h2>
        <p class="doc-section-desc">Compile utility CSS programmatically or via CLI:</p>
        <doc-code [code]="cliCode" language="typescript" />
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
      background: linear-gradient(135deg, #22d3ee 0%, #a855f7 100%);
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
    .showcase-card {
      border: 1px solid rgba(94, 234, 212, 0.25);
      border-radius: 1rem;
      background: rgba(15, 23, 42, 0.85);
      padding: 1.75rem;
      margin-bottom: 2rem;
    }
    .flex-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }
    .flex-left {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .badge-icon {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.75rem;
      background: linear-gradient(135deg, #22d3ee, #14b8a6);
      color: #020617;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card-title {
      margin: 0;
      font-weight: 700;
      color: #fff;
      font-size: 1.1rem;
    }
    .card-subtitle {
      margin: 0;
      color: #94a3b8;
      font-size: 0.875rem;
    }
    .tag-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .card-desc {
      color: #cbd5e1;
      margin-bottom: 1.5rem;
      line-height: 1.6;
    }
    .btn-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .grid-table {
      border: 1px solid var(--gp-surface-border, rgba(148, 163, 184, 0.2));
      border-radius: 0.75rem;
      overflow: hidden;
    }
    .grid-row {
      display: grid;
      grid-template-columns: 1fr 2fr 1.5fr;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--gp-surface-border, rgba(148, 163, 184, 0.15));
      font-size: 0.9rem;
    }
    .grid-header {
      background: rgba(30, 41, 59, 0.6);
      font-weight: 700;
      color: var(--gp-text-color);
    }
    code {
      color: #5eead4;
      background: rgba(15, 23, 42, 0.6);
      padding: 0.15rem 0.4rem;
      border-radius: 0.25rem;
      font-size: 0.875rem;
    }
  `]
})
export class GpCssPageComponent {
  protected readonly version = GP_UI_VERSION;

  directivesCode = `/* styles.css */
@gp-css theme;
@gp-css base;
@gp-css components;

.custom-card {
  @apply flex items-center justify-between p-6 bg-panel glass rounded-xl;
}

@gp-css utilities;`;

  cliCode = `// CLI usage:
// npx gp-css build --minify

// Programmatic compilation in Node/TypeScript:
import { compile } from '@generatedpixel/gp-css';

const result = compile({
  content: ['<div class="flex items-center p-4 bg-panel glass"></div>'],
  minify: true
});

console.log(result.css);`;

  onDemoClick(): void {
    console.log('gp-css demo clicked!');
  }
}
