import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { GpButtonComponent, GpTagComponent, GpIconComponent, GP_UI_VERSION } from 'gp-ui';
import { DocCodeComponent } from '../../shared/doc-code.component';

@Component({
  selector: 'app-getting-started',
  standalone: true,
  imports: [RouterModule, GpButtonComponent, GpTagComponent, GpIconComponent, DocCodeComponent],
  template: `
    <div class="page-container">
      <div class="hero-section">
        <div class="hero-badge">
          <gp-tag [value]="'v' + version" severity="primary" [rounded]="true" />
          <gp-tag value="100% Angular Signals" severity="success" [rounded]="true" />
          <gp-tag value="Standalone Components" severity="info" [rounded]="true" />
        </div>
        <h1 class="hero-title">&#64;generatedpixel/gp-ui</h1>
        <p class="hero-subtitle">
          An enterprise-grade, design-token-driven Angular UI component framework. Built with 100% modern Angular
          Signals (<code>input()</code>, <code>output()</code>, <code>model()</code>, <code>contentChild()</code>,
          <code>contentChildren()</code>), standalone components, 2-tier base component inheritance, full accessibility,
          internationalization, and modular theme customization.
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
            <strong><code>GpBaseComponent</code></strong
            >: Foundational root base for all components. Provides auto-generated unique IDs,
            <code>id = input&lt;string&gt;()</code>, <code>styleClass = input&lt;string&gt;()</code>,
            <code>style = input()</code>, <code>ariaLabel = input&lt;string&gt;()</code>, and
            <code>disabled = input&lt;boolean&gt;(false)</code> signal state.
          </li>
          <li>
            <strong><code>GpButtonBaseComponent</code></strong
            >: Base for all button variants (<code>GpButtonComponent</code>, <code>GpSplitButtonComponent</code>,
            <code>GpSpeedDialComponent</code>, <code>GpToggleButtonComponent</code>). Standardizes <code>label</code>,
            <code>icon</code>, <code>iconPos</code>, <code>variant</code>, <code>severity</code>, <code>size</code>,
            <code>loading</code>, <code>badge</code>, and full focus, blur, mouse, and keyboard event outputs.
          </li>
          <li>
            <strong><code>GpEditableBaseComponent&lt;T&gt;</code></strong
            >: Foundational base for all value-bearing and form controls. Implements Angular
            <code>ControlValueAccessor</code> with <code>name</code>, <code>placeholder</code>, <code>required</code>,
            <code>readonly</code>, <code>invalid</code> signal inputs, <code>onValidate</code>, <code>onValid</code>,
            <code>onInvalid</code> output signals, and integrated validation pipeline.
          </li>
          <li>
            <strong><code>GpInputBaseComponent&lt;T&gt;</code></strong
            >: Extends <code>GpEditableBaseComponent</code> for text-like inputs (<code>GpInputTextComponent</code>,
            <code>GpTextareaComponent</code>, <code>GpPasswordComponent</code>, <code>GpInputMaskComponent</code>,
            <code>GpInputNumberComponent</code>). Standardizes <code>inputId</code>, <code>size</code>,
            <code>variant</code>, <code>clearable</code>, <code>autofocus</code>, <code>tabindex</code>,
            <code>maxlength</code>, and <code>onInputEvent</code>, <code>onFocusEvent</code>, <code>onBlurEvent</code>,
            <code>onClearEvent</code>.
          </li>
          <li>
            <strong><code>GpSelectBaseComponent&lt;T&gt;</code></strong
            >: Extends <code>GpEditableBaseComponent</code> for option dropdowns & listboxes
            (<code>GpSelectComponent</code>, <code>GpMultiSelectComponent</code>, <code>GpListboxComponent</code>).
            Provides option normalization, live search filtering, overlay lifecycle, outside-click auto-dismissal, and
            Escape key listener.
          </li>
          <li>
            <strong><code>GpCheckableBaseComponent</code></strong
            >: Extends <code>GpEditableBaseComponent</code> for boolean and toggle controls
            (<code>GpCheckboxComponent</code>, <code>GpRadioButtonComponent</code>, <code>GpSwitchComponent</code>).
            Provides <code>checked</code> signal state, Space/Enter keyboard toggling, and change events.
          </li>
          <li>
            <strong><code>GpMenuBaseComponent&lt;T&gt;</code></strong
            >: Base for all menu and navigation overlays (<code>GpMenuComponent</code>, <code>GpMenubarComponent</code>,
            <code>GpContextMenuComponent</code>, <code>GpTieredMenuComponent</code>, <code>GpMegaMenuComponent</code>,
            <code>GpPanelMenuComponent</code>, <code>GpDockComponent</code>, <code>GpBreadcrumbComponent</code>).
            Handles popup mode lifecycle, viewport-boundary collision detection, outside-click auto-dismissal, Escape
            listener, and item command execution.
          </li>
          <li>
            <strong><code>GpOverlayBaseComponent</code></strong
            >: Base for floating overlay and modal dialogs (<code>GpDialogComponent</code>,
            <code>GpDrawerComponent</code>, <code>GpConfirmDialogComponent</code>, <code>GpPopoverComponent</code>).
            Provides two-way <code>[(visible)]</code> synchronization, modal z-index elevation layering with
            <code>ZIndexService</code>, mask click handling, and Escape key dismissal.
          </li>
          <li>
            <strong><code>GpPanelBaseComponent</code></strong
            >: Base for panel and container components (<code>GpPanelComponent</code>, <code>GpCardComponent</code>,
            <code>GpFieldsetComponent</code>). Provides header/subheader metadata, collapsible toggle state,
            <code>collapsed</code> signal, and <code>onToggle</code> / <code>onExpand</code> /
            <code>onCollapse</code> events.
          </li>
        </ul>
      </div>

      <!-- Community & Contribution -->
      <div class="doc-section">
        <h2 class="doc-section-title">
          <gp-icon name="heart" size="1em" />
          Contributing & Support
        </h2>
        <p class="doc-section-desc">
          Want to help?
          <a href="mailto:hello@generatedpixel.dev" style="color: var(--gp-primary); font-weight: 600;"
            >Email us at hello&#64;generatedpixel.dev</a
          >
        </p>
      </div>
    </div>
  `,
  styles: [
    `
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
        flex-wrap: wrap;
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
    `
  ]
})
export class GettingStartedComponent {
  protected readonly version = GP_UI_VERSION;
  installCode = 'npm install @generatedpixel/gp-ui @generatedpixel/gp-ui-theme';

  signalsExampleCode = `import { Component, signal, computed } from '@angular/core';
import { GpInputTextComponent, GpButtonComponent, GpSelectComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [GpInputTextComponent, GpButtonComponent, GpSelectComponent],
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
export class UserProfileComponent {
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
