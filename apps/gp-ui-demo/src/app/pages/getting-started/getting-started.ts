import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GpButton, GpTag, GpIcon, GP_UI_VERSION } from 'gp-ui';
import { DocCode } from '../../shared/doc-code';

interface GpPackageItem {
  name: string;
  npmName: string;
  description: string;
  category: string;
  icon: string;
  isDev?: boolean;
  demoRoute?: string;
  demoLabel?: string;
  tags: string[];
}

@Component({
  selector: 'app-getting-started',
  standalone: true,
  imports: [CommonModule, RouterModule, GpButton, GpTag, GpIcon, DocCode],
  template: `
    <div class="page-container">
      <div class="hero-section">
        <div class="hero-badge">
          <gp-tag [value]="'v' + version" severity="primary" [rounded]="true" />
          <gp-tag value="100% Angular Signals" severity="success" [rounded]="true" />
          <gp-tag value="Standalone Components" severity="info" [rounded]="true" />
          <gp-tag value="7 Modular Packages" severity="contrast" [rounded]="true" />
        </div>
        <h1 class="hero-title">&#64;generatedpixel Suite</h1>
        <p class="hero-subtitle">
          An enterprise-grade, design-token-driven Angular UI framework and modular ecosystem. Built with 100% modern
          Angular Signals (<code>input()</code>, <code>output()</code>, <code>model()</code>,
          <code>contentChild()</code>, <code>contentChildren()</code>), standalone components, 2-tier base component
          inheritance, high-performance CSS compiler, vector icon registry, dynamic rules engine, drag-and-drop
          dashboards, and 60+ pre-built application blocks.
        </p>

        <div class="hero-actions">
          <a routerLink="/component/button">
            <gp-button
              label="Explore 80+ Components"
              icon="chevron-right"
              iconPos="right"
              severity="primary"
              size="lg"
            />
          </a>
          <a href="#all-packages">
            <gp-button
              label="Package Directory &amp; Installation"
              icon="download"
              variant="outlined"
              severity="primary"
              size="lg"
            />
          </a>
          <a href="https://github.com/generated-pixel/gp-ui" target="_blank" rel="noopener">
            <gp-button label="GitHub Repository" icon="code" variant="outlined" severity="secondary" size="lg" />
          </a>
        </div>
      </div>

      <!-- Quick Start Installation Bundles -->
      <div class="doc-section">
        <div class="section-header-row">
          <div>
            <h2 class="doc-section-title">
              <gp-icon name="download" size="1em" />
              Quick Start Installation
            </h2>
            <p class="doc-section-desc">
              Choose your preferred package manager and select a bundle suited to your application requirements:
            </p>
          </div>

          <div class="pm-switcher">
            <button
              type="button"
              class="pm-btn"
              [class.active]="selectedPm() === 'npm'"
              (click)="selectedPm.set('npm')"
            >
              npm
            </button>
            <button
              type="button"
              class="pm-btn"
              [class.active]="selectedPm() === 'pnpm'"
              (click)="selectedPm.set('pnpm')"
            >
              pnpm
            </button>
            <button
              type="button"
              class="pm-btn"
              [class.active]="selectedPm() === 'yarn'"
              (click)="selectedPm.set('yarn')"
            >
              yarn
            </button>
            <button
              type="button"
              class="pm-btn"
              [class.active]="selectedPm() === 'bun'"
              (click)="selectedPm.set('bun')"
            >
              bun
            </button>
          </div>
        </div>

        <div class="bundle-cards">
          <!-- Bundle 1: Full Suite -->
          <div class="bundle-card featured">
            <div class="bundle-header">
              <div class="bundle-badge">RECOMMENDED FOR ENTERPRISE</div>
              <h3 class="bundle-title">Complete &#64;generatedpixel Suite</h3>
              <p class="bundle-desc">
                Installs all 7 packages: UI components, design tokens/theming, icon registry, business rules engine,
                dashboard grid layout, application blocks, and the utility CSS compiler.
              </p>
            </div>
            <doc-code [code]="fullSuiteCmd()" language="bash" />
          </div>

          <!-- Bundle 2: Core UI Foundation -->
          <div class="bundle-card">
            <div class="bundle-header">
              <div class="bundle-badge secondary">FOUNDATION</div>
              <h3 class="bundle-title">Core UI Foundation (Components + Theming + Icons)</h3>
              <p class="bundle-desc">
                Everything required for standard Angular applications needing modern signal-driven UI controls,
                accessibility, dark mode palettes, and vector icons.
              </p>
            </div>
            <doc-code [code]="coreUiCmd()" language="bash" />
          </div>
        </div>
      </div>

      <!-- Individual Package Catalog -->
      <div class="doc-section" id="all-packages">
        <h2 class="doc-section-title">
          <gp-icon name="layers" size="1em" />
          All Available Packages &amp; Installation
        </h2>
        <p class="doc-section-desc">
          Every package in the &#64;generatedpixel ecosystem is decoupled and publishable independently. Install only
          the modules you need:
        </p>

        <div class="packages-grid">
          @for (pkg of packages; track pkg.npmName) {
            <div class="package-item-card">
              <div class="pkg-card-top">
                <div class="pkg-icon-wrap">
                  <gp-icon [name]="pkg.icon" size="1.25em" />
                </div>
                <div class="pkg-title-wrap">
                  <div class="pkg-badge-row">
                    <span class="pkg-category">{{ pkg.category }}</span>
                    @if (pkg.isDev) {
                      <gp-tag value="devDependency" severity="warning" [rounded]="true" />
                    } @else {
                      <gp-tag value="runtime" severity="info" [rounded]="true" />
                    }
                  </div>
                  <h3 class="pkg-name">{{ pkg.name }}</h3>
                  <code class="pkg-npm-badge">{{ pkg.npmName }}</code>
                </div>
              </div>

              <p class="pkg-description">{{ pkg.description }}</p>

              <div class="pkg-tags-row">
                @for (tag of pkg.tags; track tag) {
                  <span class="pkg-feature-tag">{{ tag }}</span>
                }
              </div>

              <div class="pkg-install-box">
                <doc-code [code]="getInstallCmd(pkg.npmName, pkg.isDev)" language="bash" />
              </div>

              @if (pkg.demoRoute) {
                <div class="pkg-footer-actions">
                  <a [routerLink]="pkg.demoRoute">
                    <gp-button
                      [label]="pkg.demoLabel || 'View Documentation'"
                      icon="chevron-right"
                      iconPos="right"
                      size="sm"
                      variant="outlined"
                      severity="primary"
                    />
                  </a>
                </div>
              }
            </div>
          }
        </div>
      </div>

      <!-- Signals First Section -->
      <div class="doc-section">
        <h2 class="doc-section-title">
          <gp-icon name="bolt" size="1em" />
          Signals-First Reactive Paradigm
        </h2>
        <p class="doc-section-desc">
          Every component in <code>&#64;generatedpixel/gp-ui</code> is built with modern Angular Signals. This
          guarantees fine-grained reactivity, optimal OnPush change detection, zoneless readiness, and seamless two-way
          model binding:
        </p>
        <ul class="arch-list">
          <li>
            <strong>Signal Inputs (<code>input&lt;T&gt;()</code>)</strong>: Bind static values or dynamic signals
            directly with standard property binding <code>[prop]="mySignal()"</code> or <code>[prop]="'value'"</code>.
          </li>
          <li>
            <strong>Two-Way Models (<code>model&lt;T&gt;()</code>)</strong>: Fully support banana-in-a-box syntax
            <code>[(value)]="mySignal"</code> or <code>[(selection)]="selectedItem"</code>.
          </li>
          <li>
            <strong>Output Signals (<code>output&lt;T&gt;()</code>)</strong>: Modern type-safe event emitters that
            seamlessly handle user interactions with standard event binding
            <code>(onClickEvent)="handleClick($event)"</code>.
          </li>
          <li>
            <strong>Signal Queries (<code>contentChild()</code> / <code>contentChildren()</code>)</strong>: Fine-grained
            declarative template querying without manual lifecycle hooks.
          </li>
        </ul>
        <doc-code [code]="signalsExampleCode" language="typescript" />
      </div>

      <!-- Theme Setup -->
      <div class="doc-section">
        <h2 class="doc-section-title">
          <gp-icon name="palette" size="1em" />
          Theme Stylesheet Setup
        </h2>
        <p class="doc-section-desc">
          Include the design tokens and themes in your <code>angular.json</code> or global <code>styles.scss</code>:
        </p>
        <doc-code [code]="themeCode" language="scss" />
      </div>

      <!-- Standalone Component Usage -->
      <div class="doc-section">
        <h2 class="doc-section-title">
          <gp-icon name="code" size="1em" />
          Usage in Standalone Angular Components
        </h2>
        <p class="doc-section-desc">
          Import any of the standalone UI components directly in your component's <code>imports</code> array:
        </p>
        <doc-code [code]="usageCode" language="typescript" />
      </div>

      <!-- Architecture -->
      <div class="doc-section">
        <h2 class="doc-section-title">
          <gp-icon name="layer-group" size="1em" />
          Modular Base Component Architecture
        </h2>
        <p class="doc-section-desc">
          All components in the library inherit from specialized, signal-driven base classes to eliminate boilerplate
          and standardize APIs:
        </p>
        <ul class="arch-list">
          <li>
            <strong><code>GpBase</code></strong
            >: Foundational root base for all components. Provides auto-generated unique IDs,
            <code>id = input&lt;string&gt;()</code>, <code>inputId = input&lt;string&gt;()</code>,
            <code>styleClass = input&lt;string&gt;()</code>, <code>style = input()</code>,
            <code>ariaLabel = input&lt;string&gt;()</code>, <code>ariaLabelledBy = input&lt;string&gt;()</code>,
            <code>ariaDescribedBy = input&lt;string&gt;()</code>, and
            <code>disabled = input&lt;boolean&gt;(false)</code> signal state.
          </li>
          <li>
            <strong><code>GpButtonBase</code></strong
            >: Base for all button variants (<code>GpButton</code>, <code>GpSplitButton</code>,
            <code>GpSpeedDial</code>, <code>GpToggleButton</code>). Standardizes <code>label</code>, <code>icon</code>,
            <code>iconPos</code>, <code>variant</code>, <code>severity</code>, <code>size</code>, <code>loading</code>,
            <code>badge</code>, and full focus, blur, mouse, and keyboard event outputs.
          </li>
          <li>
            <strong><code>GpEditableBase&lt;T&gt;</code></strong
            >: Foundational base for all value-bearing and form controls. Implements Angular
            <code>ControlValueAccessor</code> with <code>name</code>, <code>placeholder</code>, <code>required</code>,
            <code>readonly</code>, <code>invalid</code> signal inputs, <code>onValidate</code>, <code>onValid</code>,
            <code>onInvalid</code> output signals, and integrated validation pipeline.
          </li>
          <li>
            <strong><code>GpInputBase&lt;T&gt;</code></strong
            >: Extends <code>GpEditableBase</code> for text-like inputs (<code>GpInputText</code>,
            <code>GpTextarea</code>, <code>GpPassword</code>, <code>GpInputMask</code>, <code>GpInputNumber</code>).
            Standardizes <code>inputId</code>, <code>size</code>, <code>variant</code>, <code>clearable</code>,
            <code>autofocus</code>, <code>tabindex</code>, <code>maxlength</code>, and <code>onInputEvent</code>,
            <code>onFocusEvent</code>, <code>onBlurEvent</code>, <code>onClearEvent</code>.
          </li>
          <li>
            <strong><code>GpSelectBase&lt;T&gt;</code></strong
            >: Extends <code>GpEditableBase</code> for option dropdowns &amp; listboxes (<code>GpSelect</code>,
            <code>GpMultiSelect</code>, <code>GpListbox</code>). Provides option normalization, live search filtering,
            overlay lifecycle, outside-click auto-dismissal, and Escape key listener.
          </li>
          <li>
            <strong><code>GpCheckableBase</code></strong
            >: Extends <code>GpEditableBase</code> for boolean and toggle controls (<code>GpCheckbox</code>,
            <code>GpRadioButton</code>, <code>GpSwitch</code>). Provides <code>checked</code> signal state, Space/Enter
            keyboard toggling, and change events.
          </li>
          <li>
            <strong><code>GpMenuBase&lt;T&gt;</code></strong
            >: Base for all menu and navigation overlays (<code>GpMenu</code>, <code>GpMenubar</code>,
            <code>GpContextMenu</code>, <code>GpTieredMenu</code>, <code>GpMegaMenu</code>, <code>GpPanelMenu</code>,
            <code>GpDock</code>, <code>GpBreadcrumb</code>). Handles popup mode lifecycle, viewport-boundary collision
            detection, outside-click auto-dismissal, Escape listener, and item command execution.
          </li>
          <li>
            <strong><code>GpOverlayBase</code></strong
            >: Base for floating overlay and modal dialogs (<code>GpDialog</code>, <code>GpDrawer</code>,
            <code>GpConfirmDialog</code>, <code>GpPopover</code>). Provides two-way
            <code>[(visible)]</code> synchronization, modal z-index elevation layering with <code>ZIndexService</code>,
            mask click handling, and Escape key dismissal.
          </li>
          <li>
            <strong><code>GpPanelBase</code></strong
            >: Base for panel and container components (<code>GpPanel</code>, <code>GpCard</code>,
            <code>GpFieldset</code>). Provides header/subheader metadata, collapsible toggle state,
            <code>collapsed</code> signal, and <code>onToggle</code> / <code>onExpand</code> /
            <code>onCollapse</code> events.
          </li>
        </ul>
      </div>

      <!-- Community & Contribution -->
      <div class="doc-section">
        <h2 class="doc-section-title">
          <gp-icon name="heart" size="1em" />
          Contributing &amp; Support
        </h2>
        <p class="doc-section-desc">
          Want to help or request a feature?
          <a href="mailto:hello@generatedpixel.dev" style="color: var(--gp-primary); font-weight: 600;"
            >Email us at hello&#64;generatedpixel.dev</a
          >
          or visit our
          <a
            href="https://github.com/generated-pixel/gp-ui"
            target="_blank"
            rel="noopener"
            style="color: var(--gp-primary); font-weight: 600;"
            >GitHub repository</a
          >.
        </p>
      </div>
    </div>
  `,
  styles: [
    `
      .page-container {
        width: 100%;
        max-width: 1040px;
        margin: 0 auto;
        padding-bottom: 4rem;
        box-sizing: border-box;
      }
      .hero-section {
        padding: 3rem 0 2.5rem 0;
        margin-bottom: 2rem;
        border-bottom: 1px solid var(--gp-surface-border);
        box-sizing: border-box;
      }
      .hero-badge {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
        flex-wrap: wrap;
      }
      .hero-title {
        font-size: 3rem;
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
        line-height: 1.65;
        max-width: 52rem;
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

      .section-header-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
        width: 100%;
        box-sizing: border-box;
      }

      .pm-switcher {
        display: inline-flex;
        background: var(--gp-surface-card);
        border: 1px solid var(--gp-surface-border);
        border-radius: 9999px;
        padding: 0.25rem;
        gap: 0.25rem;
      }

      .pm-btn {
        background: transparent;
        border: none;
        color: var(--gp-text-color-secondary);
        padding: 0.35rem 1rem;
        border-radius: 9999px;
        font-size: var(--gp-font-size-sm);
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease-in-out;
      }

      .pm-btn:hover {
        color: var(--gp-text-color);
      }

      .pm-btn.active {
        background: var(--gp-primary);
        color: var(--gp-primary-contrast);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }

      .bundle-cards {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
        width: 100%;
        max-width: 100%;
        min-width: 0;
        box-sizing: border-box;
      }

      .bundle-card {
        background: var(--gp-surface-card);
        border: 1px solid var(--gp-surface-border);
        border-radius: var(--gp-border-radius);
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
        max-width: 100%;
        min-width: 0;
        box-sizing: border-box;
        overflow: hidden;
      }

      .bundle-card.featured {
        border-color: var(--gp-primary);
        background: linear-gradient(
          180deg,
          var(--gp-surface-card) 0%,
          rgba(var(--gp-primary-rgb, 99, 102, 241), 0.04) 100%
        );
      }

      .bundle-badge {
        display: inline-block;
        font-size: 0.6875rem;
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--gp-primary);
        margin-bottom: 0.35rem;
      }

      .bundle-badge.secondary {
        color: var(--gp-text-color-secondary);
      }

      .bundle-title {
        font-size: 1.25rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
        color: var(--gp-text-color);
      }

      .bundle-desc {
        font-size: var(--gp-font-size-sm);
        color: var(--gp-text-color-secondary);
        line-height: 1.5;
        margin: 0;
      }

      .packages-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
        gap: 1.5rem;
        margin-top: 1.5rem;
        width: 100%;
        max-width: 100%;
        min-width: 0;
        box-sizing: border-box;
      }

      .package-item-card {
        background: var(--gp-surface-card);
        border: 1px solid var(--gp-surface-border);
        border-radius: var(--gp-border-radius);
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 100%;
        min-width: 0;
        box-sizing: border-box;
        overflow: hidden;
        transition:
          transform 0.2s ease,
          border-color 0.2s ease,
          box-shadow 0.2s ease;
      }

      .package-item-card:hover {
        border-color: var(--gp-primary);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        transform: translateY(-2px);
      }

      .pkg-card-top {
        display: flex;
        gap: 1rem;
        align-items: flex-start;
        margin-bottom: 1rem;
      }

      .pkg-icon-wrap {
        width: 44px;
        height: 44px;
        border-radius: 10px;
        background: rgba(var(--gp-primary-rgb, 99, 102, 241), 0.1);
        color: var(--gp-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .pkg-title-wrap {
        flex: 1;
        min-width: 0;
      }

      .pkg-badge-row {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        margin-bottom: 0.25rem;
      }

      .pkg-category {
        font-size: var(--gp-font-size-xs);
        font-weight: 600;
        text-transform: uppercase;
        color: var(--gp-text-color-muted);
        letter-spacing: 0.05em;
      }

      .pkg-name {
        font-size: 1.125rem;
        font-weight: 700;
        margin: 0 0 0.35rem 0;
        color: var(--gp-text-color);
      }

      .pkg-npm-badge {
        font-size: var(--gp-font-size-xs);
        background: var(--gp-surface-ground);
        padding: 0.2rem 0.45rem;
        border-radius: 4px;
        color: var(--gp-primary);
        border: 1px solid var(--gp-surface-border);
      }

      .pkg-description {
        font-size: var(--gp-font-size-sm);
        color: var(--gp-text-color-secondary);
        line-height: 1.55;
        margin: 0 0 1rem 0;
        flex: 1;
      }

      .pkg-tags-row {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        margin-bottom: 1.25rem;
      }

      .pkg-feature-tag {
        font-size: 0.75rem;
        font-weight: 600;
        background: var(--gp-surface-ground);
        color: var(--gp-text-color-secondary);
        padding: 0.2rem 0.5rem;
        border-radius: 9999px;
        border: 1px solid var(--gp-surface-border);
      }

      .pkg-install-box {
        margin-bottom: 1rem;
        min-width: 0;
        max-width: 100%;
        overflow: hidden;
      }

      .pkg-footer-actions {
        display: flex;
        justify-content: flex-end;
      }

      .pkg-footer-actions a {
        text-decoration: none;
      }

      .arch-list {
        padding-left: 1.5rem;
        line-height: 1.8;
        color: var(--gp-text-color);
      }
    `
  ]
})
export class GettingStarted {
  protected readonly version = GP_UI_VERSION;
  public readonly selectedPm = signal<'npm' | 'pnpm' | 'yarn' | 'bun'>('npm');

  public readonly fullSuiteCmd = computed(() => {
    switch (this.selectedPm()) {
      case 'pnpm':
        return 'pnpm add @generatedpixel/gp-ui @generatedpixel/gp-ui-theme @generatedpixel/gp-ui-icons @generatedpixel/gp-rules @generatedpixel/gp-grid @generatedpixel/gp-blocks\npnpm add -D @generatedpixel/gp-css';
      case 'yarn':
        return 'yarn add @generatedpixel/gp-ui @generatedpixel/gp-ui-theme @generatedpixel/gp-ui-icons @generatedpixel/gp-rules @generatedpixel/gp-grid @generatedpixel/gp-blocks\nyarn add -D @generatedpixel/gp-css';
      case 'bun':
        return 'bun add @generatedpixel/gp-ui @generatedpixel/gp-ui-theme @generatedpixel/gp-ui-icons @generatedpixel/gp-rules @generatedpixel/gp-grid @generatedpixel/gp-blocks\nbun add -d @generatedpixel/gp-css';
      default:
        return 'npm install @generatedpixel/gp-ui @generatedpixel/gp-ui-theme @generatedpixel/gp-ui-icons @generatedpixel/gp-rules @generatedpixel/gp-grid @generatedpixel/gp-blocks\nnpm install --save-dev @generatedpixel/gp-css';
    }
  });

  public readonly coreUiCmd = computed(() => {
    switch (this.selectedPm()) {
      case 'pnpm':
        return 'pnpm add @generatedpixel/gp-ui @generatedpixel/gp-ui-theme @generatedpixel/gp-ui-icons';
      case 'yarn':
        return 'yarn add @generatedpixel/gp-ui @generatedpixel/gp-ui-theme @generatedpixel/gp-ui-icons';
      case 'bun':
        return 'bun add @generatedpixel/gp-ui @generatedpixel/gp-ui-theme @generatedpixel/gp-ui-icons';
      default:
        return 'npm install @generatedpixel/gp-ui @generatedpixel/gp-ui-theme @generatedpixel/gp-ui-icons';
    }
  });

  public getInstallCmd(pkg: string, isDev = false): string {
    const pm = this.selectedPm();
    if (pm === 'pnpm') {
      return isDev ? `pnpm add -D ${pkg}` : `pnpm add ${pkg}`;
    }
    if (pm === 'yarn') {
      return isDev ? `yarn add -D ${pkg}` : `yarn add ${pkg}`;
    }
    if (pm === 'bun') {
      return isDev ? `bun add -d ${pkg}` : `bun add ${pkg}`;
    }
    return isDev ? `npm install --save-dev ${pkg}` : `npm install ${pkg}`;
  }

  public readonly packages: GpPackageItem[] = [
    {
      name: 'Core UI Components',
      npmName: '@generatedpixel/gp-ui',
      description:
        '80+ enterprise-grade standalone Angular 19+ UI components built 100% with native Signals (input, output, model). Includes buttons, form controls, tables, trees, dialogs, drawers, and menus.',
      category: 'UI Library',
      icon: 'layers',
      isDev: false,
      demoRoute: '/component/button',
      demoLabel: 'Browse 80+ Components',
      tags: ['80+ Components', '100% Signals', 'OnPush Default', 'Zero 3rd-Party Deps']
    },
    {
      name: 'Design Tokens & Theming',
      npmName: '@generatedpixel/gp-ui-theme',
      description:
        'System-wide CSS variables, 8 preset palettes (Default, Ocean, Emerald, Sunset, Amethyst, Rose, Nord, Cyberpunk), dark/light modes, WCAG AAA high-contrast modes, and runtime GpThemeManager.',
      category: 'Design System',
      icon: 'palette',
      isDev: false,
      demoRoute: '/theming',
      demoLabel: 'Theming Studio',
      tags: ['8 Color Palettes', 'CSS Variables', 'Light & Dark', 'WCAG AAA']
    },
    {
      name: 'High-Performance Utility CSS Engine',
      npmName: '@generatedpixel/gp-css',
      description:
        'Zero-runtime utility CSS engine and compiler CLI with atomic rule generation, sub-15ms project scanning, @gp-css directives, and design token integration.',
      category: 'Build Tool',
      icon: 'code',
      isDev: true,
      demoRoute: '/gp-css',
      demoLabel: 'gp-css Documentation',
      tags: ['Zero Runtime', 'CLI Compiler', 'Sub-15ms Scans', 'Token Integration']
    },
    {
      name: 'Vector Icon Registry',
      npmName: '@generatedpixel/gp-ui-icons',
      description:
        'Lightweight, tree-shakeable SVG icon collection and registry system. Includes GpIcon with automatic size scaling, semantic color inheritance, and dynamic SVG sprite loading.',
      category: 'Icons',
      icon: 'sparkles',
      isDev: false,
      demoRoute: '/component/icon',
      demoLabel: 'Icon Components',
      tags: ['500+ Vector Icons', 'SVG Registry', 'Tree-Shakeable', 'Auto Sizing']
    },
    {
      name: 'Dynamic Business Rules Engine',
      npmName: '@generatedpixel/gp-rules',
      description:
        'Declarative reactive business logic and validation rules engine. Triggers actions on keypress (with configurable debounce), blur, change, or button clicks with formula calculations and simulator.',
      category: 'Logic Engine',
      icon: 'sliders',
      isDev: false,
      demoRoute: '/rules',
      demoLabel: 'Rules Engine & Simulator',
      tags: ['Debounced Keypress', 'Formula Eval', 'Field Comparison', 'Dry-Run Simulator']
    },
    {
      name: 'Dashboard Grid & Widgets',
      npmName: '@generatedpixel/gp-grid',
      description:
        'Interactive drag-and-drop dashboard grid layout manager. Features responsive column snapping, resizable widgets, serialized layout persistence, and widget data resolvers.',
      category: 'Layout & Data',
      icon: 'grid',
      isDev: false,
      demoRoute: '/grid',
      demoLabel: 'Dashboard Grid Demo',
      tags: ['Drag & Drop', 'Resizable Widgets', 'State Persistence', 'Responsive Snapping']
    },
    {
      name: 'Application Blocks & UI Shells',
      npmName: '@generatedpixel/gp-blocks',
      description:
        '60+ ready-to-use application layouts, analytics dashboards, settings screens, form wizards, and dynamic schema-driven form renderers built natively with gp-ui and gp-css.',
      category: 'Page Templates',
      icon: 'layout',
      isDev: false,
      demoRoute: '/blocks',
      demoLabel: 'Explore 60+ Blocks',
      tags: ['60+ Ready Shells', 'JSON Schema Form Builder', 'CMS Ready', 'Zero Config']
    }
  ];

  signalsExampleCode = `import { Component, signal, computed } from '@angular/core';
import { GpInputText, GpButton, GpSelect } from '@generatedpixel/gp-ui';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [GpInputText, GpButton, GpSelect],
  template: \`
    <!-- Two-way Signal Model Binding -->
    <gp-input-text label="Username" [(value)]="username" placeholder="Enter username..." />

    <!-- Signal Inputs & Computed State -->
    <gp-button
      label="Submit"
      [disabled]="isSubmitDisabled()"
      severity="primary"
      (onClickEvent)="onSubmit()"
    />
  \`
})
export class UserProfile {
  // Define writable signals
  username = signal('');

  // Define computed signals reacting to input changes
  isSubmitDisabled = computed(() => this.username().trim().length === 0);

  onSubmit(): void {
    console.log('Submitted username:', this.username());
  }
}`;

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
import { GpButton, GpInputText, GpTable } from '@generatedpixel/gp-ui';

@Component({
  selector: 'app-my-view',
  standalone: true,
  imports: [GpButton, GpInputText, GpTable],
  template: \`
    <gp-button label="Save Changes" severity="primary" (onClickEvent)="onSave()" />
  \`
})
export class MyView {
  onSave(): void {
    console.log('Saved!');
  }
}`;
}
