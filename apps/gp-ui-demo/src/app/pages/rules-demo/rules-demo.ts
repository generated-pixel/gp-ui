import { Component, OnInit, signal, inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  GpInputText,
  GpInputNumber,
  GpSelect,
  GpBadge,
  GpIcon,
  GpToast,
  GpToastService,
  GpButton,
  GP_UI_VERSION
} from 'gp-ui';
import {
  GpRuleDirective,
  GpRuleInspector,
  GpRuleBuilder,
  GpRuleEngineService,
  GpRuleSimulator,
  GpRuleValidator,
  GpBusinessRule,
  GpRuleSimulationResult,
  GP_COUPON_RULE,
  GP_ORDER_CALCULATOR_RULES,
  GP_SHIPPING_VISIBILITY_RULE,
  GP_DEPENDENT_COUNTRY_RULE,
  GP_CONFIRM_FIELD_RULE,
  GP_PASSWORD_STRENGTH_RULE,
  GP_CREDIT_CARD_TYPE_RULE,
  GP_SLUGIFY_RULE,
  STATES_BY_COUNTRY
} from 'gp-rules';
import { DocCode } from '../../shared/doc-code';

@Component({
  selector: 'app-rules-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GpInputText,
    GpInputNumber,
    GpSelect,
    GpBadge,
    GpIcon,
    GpToast,
    GpButton,
    GpRuleDirective,
    GpRuleInspector,
    GpRuleBuilder,
    DocCode
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="rules-page-container">
      <gp-toast />

      <!-- Page Hero Header -->
      <div class="page-header">
        <div class="header-badge-row">
          <gp-badge value="@generatedpixel/gp-rules" severity="primary" />
          <gp-badge [value]="'v' + version" severity="info" />
          <gp-badge value="Signals Reactive" severity="success" />
        </div>
        <h1 class="page-title">Dynamic Business Rules Engine</h1>
        <p class="page-desc">
          Enterprise declarative rules engine for Angular. Execute reactive UI actions triggered by keypress (with
          configurable debounce), blur / focusout, value changes, button clicks, and custom events. Features rich
          formula computation, field-to-field comparisons, transformations, dry-run simulator, and visual inspector.
        </p>
      </div>

      <!-- Navigation Tabs -->
      <div class="rules-tab-bar">
        <button
          type="button"
          class="rules-tab-btn"
          [class.active]="activeTab() === 'demo'"
          (click)="activeTab.set('demo')"
        >
          <gp-icon name="sparkles" size="0.9em" />
          <span>Interactive Playground</span>
        </button>
        <button
          type="button"
          class="rules-tab-btn"
          [class.active]="activeTab() === 'simulator'"
          (click)="activeTab.set('simulator')"
        >
          <gp-icon name="play" size="0.9em" />
          <span>Dry-Run Simulator</span>
        </button>
        <button
          type="button"
          class="rules-tab-btn"
          [class.active]="activeTab() === 'api'"
          (click)="activeTab.set('api')"
        >
          <gp-icon name="code" size="0.9em" />
          <span>API & Operator Reference</span>
        </button>
        <button
          type="button"
          class="rules-tab-btn"
          [class.active]="activeTab() === 'recipes'"
          (click)="activeTab.set('recipes')"
        >
          <gp-icon name="sliders" size="0.9em" />
          <span>TypeScript Recipes</span>
        </button>
      </div>

      <!-- TAB 1: Live Interactive Showcase -->
      @if (activeTab() === 'demo') {
        <!-- Quick Code Example -->
        <div class="doc-card">
          <div class="doc-card-header">
            <gp-icon name="code" size="1em" />
            <span>Declarative Directive Usage</span>
          </div>
          <div class="doc-card-body">
            <doc-code [code]="exampleUsageCode" language="html" />
          </div>
        </div>

        <!-- Live Interactive Showcase Grid -->
        <div class="showcase-grid">
          <!-- Left: Interactive Forms & Triggers -->
          <div class="showcase-forms-col">
            <!-- Scenario 1: Keypress Debounced Coupon & Pricing Calculator -->
            <div class="demo-card">
              <div class="demo-card-head">
                <div class="card-icon-title">
                  <gp-icon name="tag" size="1.1em" class="icon-accent" />
                  <h3>1. Debounced Keypress Coupon & Formula Pricing</h3>
                </div>
                <gp-badge value="Debounce: 300ms" severity="warning" />
              </div>
              <div class="demo-card-body">
                <p class="section-hint">
                  Type <code>SAVE20</code> in Promo Code. Notice the 300ms keypress debouncer evaluates the condition as
                  you type, applying 20% discount and recalculating the total in real time.
                </p>

                <div class="form-grid-3">
                  <div class="form-field-item">
                    <label>Quantity</label>
                    <gp-input-number
                      [ngModel]="orderState().quantity"
                      (ngModelChange)="updateOrderField('quantity', $event)"
                      [min]="1"
                      [max]="100"
                      [gpRules]="orderRules"
                    />
                  </div>

                  <div class="form-field-item">
                    <label>Unit Price ($)</label>
                    <gp-input-number
                      [ngModel]="orderState().unitPrice"
                      (ngModelChange)="updateOrderField('unitPrice', $event)"
                      [min]="5"
                      [max]="1000"
                      [gpRules]="orderRules"
                    />
                  </div>

                  <div class="form-field-item">
                    <label>Promo Code (try 'SAVE20')</label>
                    <gp-input-text
                      [ngModel]="orderState().couponCode"
                      (ngModelChange)="updateOrderField('couponCode', $event)"
                      placeholder="e.g. SAVE20"
                      [gpRule]="couponRule"
                      [gpRuleState]="orderState()"
                    />
                  </div>
                </div>

                <!-- Calculation Summary Panel -->
                <div class="calc-summary-box">
                  <div class="summary-row">
                    <span class="summary-label">Subtotal:</span>
                    <span class="summary-val">\${{ orderState().subtotal | number: '1.2-2' }}</span>
                  </div>
                  <div class="summary-row" [class.discount-highlight]="orderState().discountPercent > 0">
                    <span class="summary-label">Discount ({{ orderState().discountPercent }}%):</span>
                    <span class="summary-val"
                      >-\${{ (orderState().subtotal * orderState().discountPercent) / 100 | number: '1.2-2' }}</span
                    >
                  </div>
                  <div class="summary-row total-row">
                    <span class="summary-label">Final Order Total:</span>
                    <span class="summary-val">\${{ orderState().total | number: '1.2-2' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Scenario 2: Password Complexity & Confirm Password Field Matching -->
            <div class="demo-card">
              <div class="demo-card-head">
                <div class="card-icon-title">
                  <gp-icon name="lock" size="1.1em" class="icon-accent" />
                  <h3>2. Password Strength & Field Matching (compareToField)</h3>
                </div>
                <gp-badge value="Compare with Field" severity="primary" />
              </div>
              <div class="demo-card-body">
                <p class="section-hint">
                  Type a password to see strength scored live. Then type in <strong>Confirm Password</strong> to trigger
                  the <code>compareToField</code> equality check rule in real time.
                </p>

                <div class="form-grid-2">
                  <div class="form-field-item">
                    <label>New Password</label>
                    <gp-input-text
                      [ngModel]="userSecurityState().password"
                      (ngModelChange)="updateSecurityField('password', $event)"
                      placeholder="Enter password..."
                      [gpRule]="passwordStrengthRule"
                      [gpRuleState]="userSecurityState()"
                    />
                    <!-- Strength meter -->
                    <div class="strength-meter-wrap">
                      <div
                        class="strength-meter-bar"
                        [style.width.%]="userSecurityState().passwordScore"
                        [class.str-weak]="userSecurityState().passwordStrength === 'weak'"
                        [class.str-med]="userSecurityState().passwordStrength === 'medium'"
                        [class.str-strong]="userSecurityState().passwordStrength === 'strong'"
                      ></div>
                    </div>
                    <span class="strength-badge-text">
                      Strength: <strong>{{ userSecurityState().passwordStrength | uppercase }}</strong> ({{
                        userSecurityState().passwordScore
                      }}%)
                    </span>
                  </div>

                  <div class="form-field-item">
                    <label>Confirm Password</label>
                    <gp-input-text
                      [ngModel]="userSecurityState().confirmPassword"
                      (ngModelChange)="updateSecurityField('confirmPassword', $event)"
                      placeholder="Confirm password..."
                      [gpRule]="confirmPasswordRule"
                      [gpRuleState]="userSecurityState()"
                    />
                    @if (
                      userSecurityState().confirmPassword &&
                      userSecurityState().confirmPassword !== userSecurityState().password
                    ) {
                      <span class="field-error-msg">⚠️ Passwords do not match</span>
                    } @else if (
                      userSecurityState().confirmPassword &&
                      userSecurityState().confirmPassword === userSecurityState().password
                    ) {
                      <span class="field-match-msg">✓ Passwords match perfectly</span>
                    }
                  </div>
                </div>
              </div>
            </div>

            <!-- Scenario 3: Auto Credit Card Brand Detection -->
            <div class="demo-card">
              <div class="demo-card-head">
                <div class="card-icon-title">
                  <gp-icon name="credit-card" size="1.1em" class="icon-accent" />
                  <h3>3. Auto Credit Card Type & Brand Detection</h3>
                </div>
                <gp-badge value="Live Format Rule" severity="success" />
              </div>
              <div class="demo-card-body">
                <p class="section-hint">
                  Enter test card prefixes (e.g. <code>4</code> for Visa, <code>55</code> for Mastercard,
                  <code>37</code> for Amex, <code>6011</code> for Discover).
                </p>

                <div class="form-grid-2">
                  <div class="form-field-item">
                    <label>Card Number</label>
                    <gp-input-text
                      [ngModel]="paymentState().cardNumber"
                      (ngModelChange)="updatePaymentField('cardNumber', $event)"
                      placeholder="e.g. 4111 2222 3333 4444"
                      [gpRule]="creditCardRule"
                      [gpRuleState]="paymentState()"
                    />
                  </div>

                  <div class="form-field-item">
                    <label>Detected Card Brand</label>
                    <div class="card-brand-display">
                      <gp-badge
                        [value]="paymentState().cardBrand | uppercase"
                        [severity]="paymentState().cardBrand !== 'generic' ? 'success' : 'secondary'"
                      />
                      <span class="cvv-hint">Expected CVV: {{ paymentState().expectedCvvLength }} digits</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Scenario 4: Title-to-Slug Transformation -->
            <div class="demo-card">
              <div class="demo-card-head">
                <div class="card-icon-title">
                  <gp-icon name="edit" size="1.1em" class="icon-accent" />
                  <h3>4. Automatic String Transformation (transformValue: slugify)</h3>
                </div>
                <gp-badge value="Transform Action" severity="info" />
              </div>
              <div class="demo-card-body">
                <p class="section-hint">
                  Type any blog post or article title. The business rule automatically transforms and formats it into an
                  SEO-friendly URL slug.
                </p>

                <div class="form-grid-2">
                  <div class="form-field-item">
                    <label>Article Title</label>
                    <gp-input-text
                      [ngModel]="contentState().title"
                      (ngModelChange)="updateContentField('title', $event)"
                      placeholder="e.g. 10 Best Practices for Angular 19"
                      [gpRule]="slugifyRule"
                      [gpRuleState]="contentState()"
                    />
                  </div>

                  <div class="form-field-item">
                    <label>Generated URL Slug</label>
                    <gp-input-text
                      [ngModel]="contentState().slug"
                      [disabled]="true"
                      placeholder="auto-generated-slug"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Scenario 5: Dependent Cascading Select (Country -> State) -->
            <div class="demo-card">
              <div class="demo-card-head">
                <div class="card-icon-title">
                  <gp-icon name="globe" size="1.1em" class="icon-accent" />
                  <h3>5. Dependent Dropdown Cascader (Value Change)</h3>
                </div>
                <gp-badge value="Trigger: change" severity="info" />
              </div>
              <div class="demo-card-body">
                <p class="section-hint">
                  Select a country. The business rule dynamically loads and selects matching states/provinces.
                </p>

                <div class="form-grid-2">
                  <div class="form-field-item">
                    <label>Select Country</label>
                    <gp-select
                      [options]="countryOptions"
                      [ngModel]="countryState().country"
                      (ngModelChange)="onCountryChange($event)"
                      [gpRule]="countryRule"
                    />
                  </div>

                  <div class="form-field-item">
                    <label>State / Province (Dynamic)</label>
                    <gp-select
                      [options]="stateOptions()"
                      [ngModel]="countryState().state"
                      (ngModelChange)="countryState.update((s) => ({ ...s, state: $event }))"
                      [disabled]="stateOptions().length === 0"
                      placeholder="Select State..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Interactive Rule Builder -->
            <gp-rule-builder (ruleCreated)="onCustomRuleCreated($event)" />
          </div>

          <!-- Right: Live Audit Trail & Rule Inspector -->
          <div class="showcase-inspector-col">
            <gp-rule-inspector />
          </div>
        </div>
      }

      <!-- TAB 2: Dry-Run Rule Simulator -->
      @if (activeTab() === 'simulator') {
        <div class="simulator-container">
          <div class="doc-card">
            <div class="doc-card-header">
              <gp-icon name="play" size="1em" />
              <span>Dry-Run Business Rule Simulator</span>
            </div>
            <div class="doc-card-body">
              <p class="section-hint">
                The <code>GpRuleSimulator</code> allows backend services, form wizards, and QA teams to simulate rule
                chains on mock data and inspect complete execution diffs without modifying real component state.
              </p>

              <div class="simulator-layout">
                <div class="sim-input-col">
                  <div class="sim-editor-toolbar">
                    <div class="sim-editor-title-wrap">
                      <label class="sim-lbl" for="sim-state-editor">Initial Mock State (JSON):</label>
                      @if (simJsonError()) {
                        <span class="sim-status-badge sim-status-badge--error">
                          <gp-icon name="exclamation-triangle" size="0.75em" />
                          Invalid JSON
                        </span>
                      } @else {
                        <span class="sim-status-badge sim-status-badge--success">
                          <gp-icon name="check-circle" size="0.75em" />
                          Valid JSON
                        </span>
                      }
                    </div>

                    <div class="sim-editor-actions">
                      <gp-button
                        variant="text"
                        severity="secondary"
                        size="sm"
                        title="Format JSON (Indent 2 spaces)"
                        [disabled]="isSimulating() || !!simJsonError()"
                        (onClickEvent)="formatSimulatorJson()"
                      >
                        <gp-icon name="code" size="0.85em" style="margin-right: 0.35rem" />
                        Format JSON
                      </gp-button>
                      <gp-button
                        variant="text"
                        severity="secondary"
                        size="sm"
                        title="Reset to default mock state"
                        [disabled]="isSimulating()"
                        (onClickEvent)="resetSimulatorJson()"
                      >
                        <gp-icon name="refresh" size="0.85em" style="margin-right: 0.35rem" />
                        Reset
                      </gp-button>
                    </div>
                  </div>

                  <div class="sim-textarea-wrapper" [class.is-invalid]="!!simJsonError()">
                    <textarea
                      id="sim-state-editor"
                      class="sim-textarea"
                      rows="10"
                      spellcheck="false"
                      [value]="simStateJson()"
                      (input)="onSimStateChange($any($event.target).value)"
                      (keydown)="onSimStateKeydown($event)"
                      placeholder="Enter valid JSON mock state..."
                    ></textarea>
                  </div>

                  @if (simJsonError(); as err) {
                    <div class="sim-json-error">
                      <gp-icon name="exclamation-triangle" size="0.85em" />
                      <span>{{ err }}</span>
                    </div>
                  }

                  <div class="sim-btn-row">
                    <gp-button
                      severity="primary"
                      size="md"
                      [loading]="isSimulating()"
                      [disabled]="isSimulating() || !!simJsonError()"
                      (onClickEvent)="runSimulation()"
                    >
                      <gp-icon name="play" size="0.9em" style="margin-right: 0.4rem" />
                      {{ isSimulating() ? 'Simulating Rules...' : 'Run Simulation' }}
                    </gp-button>

                    <span class="sim-run-hint">
                      <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to run
                    </span>
                  </div>
                </div>

                <div class="sim-output-col">
                  <div class="sim-output-header">
                    <label class="sim-lbl">Simulation Output & Diff:</label>
                    @if (simulationResult(); as res) {
                      <gp-badge [value]="res.matchedRules.length + ' matched'" severity="success" />
                    }
                  </div>
                  @if (simulationResult(); as res) {
                    <div class="sim-result-box">
                      <div class="sim-meta-row">
                        <span
                          >Matched Rules: <strong>{{ res.matchedRules.length }}</strong></span
                        >
                        <span
                          >Executed Actions: <strong>{{ res.executedActions.length }}</strong></span
                        >
                        <span
                          >Duration: <strong>{{ res.durationMs }}ms</strong></span
                        >
                      </div>

                      <div class="sim-diff-block">
                        <label>State Changes:</label>
                        <pre><code>{{ res.stateDiff | json }}</code></pre>
                      </div>

                      <div class="sim-final-block">
                        <label>Final Computed State:</label>
                        <pre><code>{{ res.finalState | json }}</code></pre>
                      </div>
                    </div>
                  } @else {
                    <div class="sim-placeholder">
                      Click "Run Simulation" to execute registered rules on the mock input state.
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- TAB 3: API & Operator Reference -->
      @if (activeTab() === 'api') {
        <div class="api-docs-container">
          <!-- Installation Section -->
          <div class="doc-card">
            <div class="doc-card-header">
              <gp-icon name="download" size="1em" />
              <span>Package Installation</span>
            </div>
            <div class="doc-card-body">
              <p style="margin-top: 0; color: var(--gp-text-color-secondary); font-size: var(--gp-font-size-sm);">
                Install <code>@generatedpixel/gp-rules</code> into your Angular 19+ application:
              </p>
              <doc-code code="npm install @generatedpixel/gp-rules" language="bash" />
            </div>
          </div>

          <!-- Triggers Section -->
          <div class="doc-card">
            <div class="doc-card-header">
              <gp-icon name="sliders" size="1em" />
              <span>1. Supported Event Triggers</span>
            </div>
            <div class="doc-card-body">
              <table class="doc-table">
                <thead>
                  <tr>
                    <th>Trigger Event</th>
                    <th>Supported Options</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>keypress</code> / <code>input</code></td>
                    <td><code>debounce: number</code>, <code>keyFilter: string</code></td>
                    <td>Fires on keystroke. Debounce delays execution until typing pauses.</td>
                  </tr>
                  <tr>
                    <td><code>blur</code> / <code>focusout</code></td>
                    <td><code>distinctUntilChanged: boolean</code></td>
                    <td>Fires when the component or DOM element loses focus.</td>
                  </tr>
                  <tr>
                    <td><code>change</code> / <code>valueChange</code></td>
                    <td>—</td>
                    <td>Fires when the control or signal value changes.</td>
                  </tr>
                  <tr>
                    <td><code>click</code> / <code>select</code></td>
                    <td>—</td>
                    <td>Fires on button click, option selection, or item interaction.</td>
                  </tr>
                  <tr>
                    <td><code>focus</code> / <code>focusin</code></td>
                    <td>—</td>
                    <td>Fires when the input or element receives focus.</td>
                  </tr>
                  <tr>
                    <td><code>init</code> / <code>mount</code></td>
                    <td>—</td>
                    <td>Fires once upon component initialization.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Operators Section -->
          <div class="doc-card">
            <div class="doc-card-header">
              <gp-icon name="check-circle" size="1em" />
              <span>2. Condition Evaluator Operators</span>
            </div>
            <div class="doc-card-body">
              <table class="doc-table">
                <thead>
                  <tr>
                    <th>Operator</th>
                    <th>Meaning</th>
                    <th>Example Expression</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>eq</code> / <code>equals</code></td>
                    <td>Strict or loose equality, supports <code>compareToField</code></td>
                    <td>
                      <code
                        >{{ '{' }} field: 'confirmPassword', operator: 'eq', compareToField: 'password' {{ '}' }}</code
                      >
                    </td>
                  </tr>
                  <tr>
                    <td><code>neq</code> / <code>notEquals</code></td>
                    <td>Not equal</td>
                    <td>
                      <code>{{ '{' }} field: 'status', operator: 'neq', value: 'banned' {{ '}' }}</code>
                    </td>
                  </tr>
                  <tr>
                    <td><code>gt</code> / <code>gte</code></td>
                    <td>Greater than / Greater than or equal</td>
                    <td>
                      <code>{{ '{' }} field: 'age', operator: 'gte', value: 18 {{ '}' }}</code>
                    </td>
                  </tr>
                  <tr>
                    <td><code>lt</code> / <code>lte</code></td>
                    <td>Less than / Less than or equal</td>
                    <td>
                      <code>{{ '{' }} field: 'stock', operator: 'lt', value: 5 {{ '}' }}</code>
                    </td>
                  </tr>
                  <tr>
                    <td><code>between</code> / <code>notBetween</code></td>
                    <td>Value falls within inclusive <code>[min, max]</code> range</td>
                    <td>
                      <code>{{ '{' }} field: 'score', operator: 'between', value: [80, 100] {{ '}' }}</code>
                    </td>
                  </tr>
                  <tr>
                    <td><code>isBefore</code> / <code>isAfter</code></td>
                    <td>Chronological date comparison</td>
                    <td>
                      <code
                        >{{ '{' }} field: 'endDate', operator: 'isAfter', compareToField: 'startDate' {{ '}' }}</code
                      >
                    </td>
                  </tr>
                  <tr>
                    <td><code>lengthGt</code> / <code>hasLength</code></td>
                    <td>String or array length comparison</td>
                    <td>
                      <code>{{ '{' }} field: 'password', operator: 'lengthGt', value: 8 {{ '}' }}</code>
                    </td>
                  </tr>
                  <tr>
                    <td><code>contains</code></td>
                    <td>String substring or Array inclusion</td>
                    <td>
                      <code>{{ '{' }} field: 'permissions', operator: 'contains', value: 'write' {{ '}' }}</code>
                    </td>
                  </tr>
                  <tr>
                    <td><code>startsWith</code> / <code>endsWith</code></td>
                    <td>String prefix/suffix matching</td>
                    <td>
                      <code>{{ '{' }} field: 'taxId', operator: 'startsWith', value: 'US-' {{ '}' }}</code>
                    </td>
                  </tr>
                  <tr>
                    <td><code>matches</code></td>
                    <td>Regular expression evaluation</td>
                    <td>
                      <code
                        >{{ '{' }} field: 'email', operator: 'matches', value: '^[\\w.-]+@[\\w.-]+\\.\\w+$'
                        {{ '}' }}</code
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Actions Section -->
          <div class="doc-card">
            <div class="doc-card-header">
              <gp-icon name="sparkles" size="1em" />
              <span>3. Action Handlers</span>
            </div>
            <div class="doc-card-body">
              <table class="doc-table">
                <thead>
                  <tr>
                    <th>Action Type</th>
                    <th>Parameters</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>setValue</code></td>
                    <td><code>target: string</code>, <code>value: any</code></td>
                    <td>Updates the target form control or state variable.</td>
                  </tr>
                  <tr>
                    <td><code>copyValue</code></td>
                    <td><code>fromField: string</code>, <code>target: string</code></td>
                    <td>Copies value directly from another field.</td>
                  </tr>
                  <tr>
                    <td><code>transformValue</code></td>
                    <td><code>fromField</code>, <code>target</code>, <code>transformType</code></td>
                    <td>Transforms string formatting (slugify, uppercase, currency, phone).</td>
                  </tr>
                  <tr>
                    <td><code>setValidationError</code></td>
                    <td><code>target: string</code>, <code>errorKey: string</code></td>
                    <td>Sets custom validation error directly on Reactive Form control.</td>
                  </tr>
                  <tr>
                    <td><code>clearValidationError</code></td>
                    <td><code>target: string</code>, <code>errorKey?: string</code></td>
                    <td>Clears validation error from Reactive Form control.</td>
                  </tr>
                  <tr>
                    <td><code>compute</code> / <code>calculate</code></td>
                    <td><code>target: string</code>, <code>formula: string</code></td>
                    <td>Evaluates mathematical/logical formula with SUM, AVG, ROUND, IF, DATE_DIFF.</td>
                  </tr>
                  <tr>
                    <td><code>setOptions</code></td>
                    <td><code>target: string</code>, <code>options: any[]</code></td>
                    <td>Dynamically populates select/dropdown options.</td>
                  </tr>
                  <tr>
                    <td><code>show</code> / <code>hide</code></td>
                    <td><code>target: string</code></td>
                    <td>Toggles visibility of target component or section.</td>
                  </tr>
                  <tr>
                    <td><code>enable</code> / <code>disable</code></td>
                    <td><code>target: string</code></td>
                    <td>Enables or disables target input control.</td>
                  </tr>
                  <tr>
                    <td><code>toast</code></td>
                    <td><code>message: string</code>, <code>severity: string</code></td>
                    <td>Displays toast notification.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }

      <!-- TAB 4: TypeScript Recipes -->
      @if (activeTab() === 'recipes') {
        <div class="recipes-container">
          <div class="doc-card">
            <div class="doc-card-header">
              <gp-icon name="code" size="1em" />
              <span>Recipe 1: Field-to-Field Comparison (Password Match)</span>
            </div>
            <div class="doc-card-body">
              <doc-code [code]="recipe1Code" language="typescript" />
            </div>
          </div>

          <div class="doc-card">
            <div class="doc-card-header">
              <gp-icon name="code" size="1em" />
              <span>Recipe 2: Dry-Run Rule Simulation & Testing</span>
            </div>
            <div class="doc-card-body">
              <doc-code [code]="recipe2Code" language="typescript" />
            </div>
          </div>

          <div class="doc-card">
            <div class="doc-card-header">
              <gp-icon name="code" size="1em" />
              <span>Recipe 3: Advanced Pricing Formulas with Math Helpers</span>
            </div>
            <div class="doc-card-body">
              <doc-code [code]="recipe3Code" language="typescript" />
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .rules-page-container {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding-bottom: 3rem;
      }

      .header-badge-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
      }

      .page-title {
        font-size: 2rem;
        font-weight: 900;
        color: var(--gp-text-color, #0f172a);
        margin: 0;
        letter-spacing: -0.02em;
      }

      .page-desc {
        font-size: 0.95rem;
        color: var(--gp-text-color-secondary, #64748b);
        margin: 0.35rem 0 0 0;
        max-width: 800px;
        line-height: 1.6;
      }

      .rules-tab-bar {
        display: flex;
        gap: 0.5rem;
        border-bottom: 1px solid var(--gp-surface-border, #e2e8f0);
        padding-bottom: 0.5rem;
      }

      .rules-tab-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        padding: 0.5rem 1rem;
        border-radius: var(--gp-border-radius, 8px);
        border: 1px solid transparent;
        background: transparent;
        color: var(--gp-text-color-secondary, #64748b);
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 150ms ease;
      }

      .rules-tab-btn:hover {
        background: var(--gp-surface-ground, #f1f5f9);
        color: var(--gp-text-color, #1e293b);
      }

      .rules-tab-btn.active {
        background: var(--gp-primary-light, rgba(99, 102, 241, 0.1));
        color: var(--gp-primary, #6366f1);
        border-color: var(--gp-primary, #6366f1);
      }

      .doc-card {
        background: var(--gp-surface-card, #ffffff);
        border: 1px solid var(--gp-surface-border, #e2e8f0);
        border-radius: var(--gp-border-radius-lg, 12px);
        overflow: hidden;
      }

      .doc-card-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.25rem;
        background: var(--gp-surface-ground, #f8fafc);
        border-bottom: 1px solid var(--gp-surface-border, #e2e8f0);
        font-weight: 700;
        font-size: 0.875rem;
        color: var(--gp-text-color, #1e293b);
      }

      .doc-card-body {
        padding: 1.25rem 1.5rem;
      }

      .doc-card-body:has(> .doc-table) {
        padding: 0;
      }

      .showcase-grid {
        display: grid;
        grid-template-columns: 1.35fr 1fr;
        gap: 1.5rem;
        align-items: start;
      }

      @media (max-width: 1024px) {
        .showcase-grid {
          grid-template-columns: 1fr;
        }
      }

      .showcase-forms-col {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .showcase-inspector-col {
        position: sticky;
        top: 1.5rem;
      }

      .demo-card {
        background: var(--gp-surface-card, #ffffff);
        border: 1px solid var(--gp-surface-border, #e2e8f0);
        border-radius: var(--gp-border-radius-lg, 12px);
        overflow: hidden;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      }

      .demo-card-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.25rem;
        background: var(--gp-surface-ground, #f8fafc);
        border-bottom: 1px solid var(--gp-surface-border, #e2e8f0);
      }

      .card-icon-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .card-icon-title h3 {
        margin: 0;
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--gp-text-color, #1e293b);
      }

      .icon-accent {
        color: var(--gp-primary, #6366f1);
      }

      .demo-card-body {
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .section-hint {
        margin: 0;
        font-size: 0.85rem;
        color: var(--gp-text-color-secondary, #64748b);
        line-height: 1.5;
      }

      .section-hint code {
        background: var(--gp-surface-ground, #f1f5f9);
        padding: 0.15rem 0.35rem;
        border-radius: 4px;
        font-weight: 600;
        color: var(--gp-primary, #6366f1);
      }

      .form-grid-3 {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
      }

      .form-grid-2 {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }

      @media (max-width: 640px) {
        .form-grid-3,
        .form-grid-2 {
          grid-template-columns: 1fr;
        }
      }

      .form-field-item {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }

      .form-field-item label {
        font-size: 0.8125rem;
        font-weight: 600;
        color: var(--gp-text-color, #334155);
      }

      .strength-meter-wrap {
        height: 6px;
        background: var(--gp-surface-ground, #f1f5f9);
        border-radius: 999px;
        overflow: hidden;
        margin-top: 0.25rem;
      }

      .strength-meter-bar {
        height: 100%;
        transition: all 250ms ease;
      }

      .str-weak {
        background: var(--gp-danger, #ef4444);
      }

      .str-med {
        background: var(--gp-warning, #f59e0b);
      }

      .str-strong {
        background: var(--gp-success, #10b981);
      }

      .strength-badge-text {
        font-size: 0.75rem;
        color: var(--gp-text-color-secondary, #64748b);
      }

      .field-error-msg {
        font-size: 0.75rem;
        color: var(--gp-danger, #ef4444);
        font-weight: 600;
      }

      .field-match-msg {
        font-size: 0.75rem;
        color: var(--gp-success, #10b981);
        font-weight: 600;
      }

      .card-brand-display {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.45rem 0;
      }

      .cvv-hint {
        font-size: 0.75rem;
        color: var(--gp-text-color-secondary, #64748b);
      }

      .calc-summary-box {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        padding: 1rem;
        background: var(--gp-surface-ground, #f8fafc);
        border: 1px solid var(--gp-surface-border, #e2e8f0);
        border-radius: var(--gp-border-radius, 8px);
        margin-top: 0.5rem;
      }

      .summary-row {
        display: flex;
        justify-content: space-between;
        font-size: 0.875rem;
        color: var(--gp-text-color-secondary, #64748b);
      }

      .summary-val {
        font-weight: 600;
        font-family: monospace;
        color: var(--gp-text-color, #1e293b);
      }

      .discount-highlight {
        color: var(--gp-success, #10b981) !important;
        font-weight: 700;
      }

      .discount-highlight .summary-val {
        color: var(--gp-success, #10b981) !important;
      }

      .total-row {
        border-top: 1px dashed var(--gp-surface-border, #cbd5e1);
        padding-top: 0.5rem;
        margin-top: 0.25rem;
        font-size: 1.05rem;
        font-weight: 800;
        color: var(--gp-text-color, #0f172a);
      }

      .total-row .summary-val {
        color: var(--gp-primary, #6366f1);
        font-size: 1.15rem;
      }

      .simulator-layout {
        display: grid;
        grid-template-columns: 1fr 1.2fr;
        gap: 1.5rem;
        margin-top: 1rem;
      }

      @media (max-width: 800px) {
        .simulator-layout {
          grid-template-columns: 1fr;
        }
      }

      .sim-lbl {
        display: block;
        font-size: 0.8125rem;
        font-weight: 700;
        color: var(--gp-text-color, #334155);
        margin: 0;
      }

      .sim-editor-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        min-height: 32px;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .sim-editor-title-wrap {
        display: flex;
        align-items: center;
        gap: 0.6rem;
      }

      .sim-status-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        font-size: 0.725rem;
        font-weight: 600;
        padding: 0.15rem 0.5rem;
        border-radius: 9999px;
      }

      .sim-status-badge--success {
        background: var(--gp-success-light, #dcfce7);
        color: var(--gp-success, #16a34a);
      }

      .sim-status-badge--error {
        background: var(--gp-danger-light, #fee2e2);
        color: var(--gp-danger, #dc2626);
      }

      .sim-editor-actions {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }

      .sim-textarea-wrapper {
        border-radius: var(--gp-border-radius, 8px);
        border: 1px solid var(--gp-surface-border, #cbd5e1);
        background: var(--gp-surface-card, #ffffff);
        overflow: hidden;
        transition: border-color 0.2s, box-shadow 0.2s;
      }

      .sim-textarea-wrapper:focus-within {
        border-color: var(--gp-primary, #6366f1);
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
      }

      .sim-textarea-wrapper.is-invalid {
        border-color: var(--gp-danger, #ef4444);
      }

      .sim-textarea-wrapper.is-invalid:focus-within {
        border-color: var(--gp-danger, #ef4444);
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
      }

      .sim-textarea {
        width: 100%;
        padding: 0.875rem 1rem;
        font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
        font-size: 0.8125rem;
        line-height: 1.6;
        tab-size: 2;
        color: var(--gp-text-color, #0f172a);
        background: transparent;
        border: none;
        outline: none;
        resize: vertical;
        box-sizing: border-box;
        display: block;
        min-height: 210px;
      }

      .sim-json-error {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--gp-danger-light, #fef2f2);
        color: var(--gp-danger, #dc2626);
        padding: 0.5rem 0.75rem;
        font-size: 0.75rem;
        border-radius: var(--gp-border-radius, 6px);
        border: 1px solid var(--gp-danger-border, #fecaca);
        margin-top: 0.5rem;
      }

      .sim-output-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        min-height: 32px;
      }

      .sim-btn-row {
        margin-top: 0.85rem;
        display: flex;
        align-items: center;
        gap: 0.85rem;
        flex-wrap: wrap;
      }

      .sim-run-hint {
        font-size: 0.75rem;
        color: var(--gp-text-color-secondary, #64748b);
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }

      .sim-run-hint kbd {
        background: var(--gp-surface-ground, #f1f5f9);
        border: 1px solid var(--gp-surface-border, #cbd5e1);
        border-radius: 4px;
        padding: 0.15rem 0.4rem;
        font-size: 0.7rem;
        font-family: inherit;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
      }

      .sim-result-box {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        background: var(--gp-surface-ground, #f8fafc);
        border: 1px solid var(--gp-surface-border, #e2e8f0);
        border-radius: var(--gp-border-radius, 8px);
        padding: 1rem;
      }

      .sim-meta-row {
        display: flex;
        gap: 1rem;
        font-size: 0.8125rem;
        color: var(--gp-text-color-secondary, #64748b);
        border-bottom: 1px solid var(--gp-surface-border, #e2e8f0);
        padding-bottom: 0.5rem;
      }

      .sim-diff-block pre,
      .sim-final-block pre {
        margin: 0.25rem 0 0 0;
        background: var(--gp-surface-card, #ffffff);
        padding: 0.5rem;
        border-radius: 6px;
        font-size: 0.75rem;
        border: 1px solid var(--gp-surface-border, #e2e8f0);
        overflow-x: auto;
      }

      .sim-placeholder {
        padding: 2rem 1rem;
        text-align: center;
        color: var(--gp-text-color-secondary, #64748b);
        font-size: 0.875rem;
        background: var(--gp-surface-ground, #f8fafc);
        border-radius: var(--gp-border-radius, 8px);
        border: 1px dashed var(--gp-surface-border, #cbd5e1);
      }

      .api-docs-container,
      .recipes-container {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .doc-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.875rem;
      }

      .doc-table th {
        text-align: left;
        padding: 0.75rem 1rem;
        background: var(--gp-surface-ground, #f8fafc);
        border-bottom: 1px solid var(--gp-surface-border, #e2e8f0);
        color: var(--gp-text-color, #1e293b);
        font-weight: 700;
      }

      .doc-table td {
        padding: 0.75rem 1rem;
        border-bottom: 1px solid var(--gp-surface-border, #e2e8f0);
        color: var(--gp-text-color-secondary, #475569);
      }

      .doc-table code {
        background: var(--gp-surface-ground, #f1f5f9);
        padding: 0.15rem 0.35rem;
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.8125rem;
        color: var(--gp-primary, #6366f1);
        font-weight: 600;
      }
    `
  ]
})
export class RulesDemo implements OnInit {
  private toastService = inject(GpToastService);
  private engine = inject(GpRuleEngineService);

  public readonly version = GP_UI_VERSION;
  public activeTab = signal<'demo' | 'simulator' | 'api' | 'recipes'>('demo');

  // Scenario 1 State
  public orderState = signal<{
    quantity: number;
    unitPrice: number;
    couponCode: string;
    discountPercent: number;
    subtotal: number;
    total: number;
  }>({
    quantity: 2,
    unitPrice: 50,
    couponCode: '',
    discountPercent: 0,
    subtotal: 100,
    total: 100
  });

  // Scenario 2 State
  public userSecurityState = signal<{
    password: string;
    confirmPassword: string;
    passwordScore: number;
    passwordStrength: string;
  }>({
    password: '',
    confirmPassword: '',
    passwordScore: 0,
    passwordStrength: 'weak'
  });

  // Scenario 3 State
  public paymentState = signal<{
    cardNumber: string;
    cardBrand: string;
    expectedCvvLength: number;
  }>({
    cardNumber: '',
    cardBrand: 'generic',
    expectedCvvLength: 3
  });

  // Scenario 4 State
  public contentState = signal<{
    title: string;
    slug: string;
  }>({
    title: '',
    slug: ''
  });

  // Scenario 5 State
  public countryState = signal<{ country: string; state: string | null }>({
    country: 'US',
    state: 'CA'
  });

  public countryOptions = [
    { label: 'United States', value: 'US' },
    { label: 'Canada', value: 'CA' },
    { label: 'United Kingdom', value: 'UK' },
    { label: 'Germany', value: 'DE' }
  ];

  public stateOptions = signal<Array<{ label: string; value: string }>>(STATES_BY_COUNTRY['US'] || []);

  // Simulator tab state
  private readonly defaultSimState = {
    quantity: 5,
    unitPrice: 40,
    couponCode: 'SAVE20',
    discountPercent: 0,
    subtotal: 0,
    total: 0
  };

  public simStateJson = signal<string>(JSON.stringify(this.defaultSimState, null, 2));
  public simJsonError = signal<string | null>(null);
  public isSimulating = signal<boolean>(false);
  public simulationResult = signal<GpRuleSimulationResult | null>(null);

  // Preset Rules
  public couponRule = GP_COUPON_RULE;
  public orderRules = GP_ORDER_CALCULATOR_RULES;
  public passwordStrengthRule = GP_PASSWORD_STRENGTH_RULE;
  public confirmPasswordRule = GP_CONFIRM_FIELD_RULE;
  public creditCardRule = GP_CREDIT_CARD_TYPE_RULE;
  public slugifyRule = GP_SLUGIFY_RULE;
  public countryRule = GP_DEPENDENT_COUNTRY_RULE;

  public exampleUsageCode = `<!-- Attach Business Rules to any component or input -->
<gp-input-text
  [(ngModel)]="couponCode"
  placeholder="Promo Code"
  [gpRule]="couponRule"
  [gpRuleState]="orderState"
/>

<!-- Live Audit Trail with Metrics & Search -->
<gp-rule-inspector />`;

  public recipe1Code = `import { GpBusinessRule } from '@generatedpixel/gp-rules';

export const confirmPasswordRule: GpBusinessRule = {
  id: 'confirm-password-match',
  name: 'Password & Confirmation Matcher',
  trigger: [{ event: 'keypress', debounce: 250, targetField: 'confirmPassword' }],
  condition: {
    field: 'confirmPassword',
    operator: 'eq',
    compareToField: 'password'
  },
  actions: [
    { type: 'clearValidationError', target: 'confirmPassword', errorKey: 'mismatch' },
    { type: 'setClass', target: 'confirmPassword', className: 'field-valid' }
  ],
  elseActions: [
    { type: 'setValidationError', target: 'confirmPassword', errorKey: 'mismatch', errorMessage: 'Passwords do not match.' },
    { type: 'setClass', target: 'confirmPassword', className: 'field-invalid' }
  ]
};`;

  public recipe2Code = `import { GpRuleSimulator } from '@generatedpixel/gp-rules';

const result = await GpRuleSimulator.simulate({
  rules: [couponRule, ...pricingRules],
  initialState: { quantity: 4, unitPrice: 25, couponCode: 'SAVE20' },
  triggerEvent: 'change'
});

console.log('Final Calculated Total:', result.finalState.total);
console.log('State Diffs:', result.stateDiff);`;

  public recipe3Code = `import { GpBusinessRule } from '@generatedpixel/gp-rules';

export const advancedPricingRule: GpBusinessRule = {
  id: 'advanced-pricing-calc',
  name: 'Tiered Pricing Formula',
  trigger: ['change', 'valueChange'],
  actions: [
    {
      type: 'compute',
      target: 'total',
      formula: 'ROUND(IF(quantity > 10, quantity * unitPrice * 0.85, quantity * unitPrice) + tax, 2)'
    }
  ]
};`;

  ngOnInit(): void {
    this.engine.registerRules([
      this.couponRule,
      ...this.orderRules,
      this.passwordStrengthRule,
      this.confirmPasswordRule,
      this.creditCardRule,
      this.slugifyRule,
      this.countryRule
    ]);
  }

  public updateOrderField(field: string, val: any): void {
    this.orderState.update((curr) => {
      const updated = { ...curr, [field]: val };
      if (field === 'couponCode' && val === 'SAVE20') {
        updated.discountPercent = 20;
      } else if (field === 'couponCode') {
        updated.discountPercent = 0;
      }
      updated.subtotal = updated.quantity * updated.unitPrice;
      updated.total = updated.subtotal * (1 - updated.discountPercent / 100);
      return updated;
    });
  }

  public updateSecurityField(field: string, val: any): void {
    this.userSecurityState.update((curr) => {
      const updated = { ...curr, [field]: val };
      if (field === 'password') {
        const pwd = String(val || '');
        let score = 0;
        if (pwd.length >= 8) {
          score += 25;
        }
        if (pwd.length >= 12) {
          score += 15;
        }
        if (/[A-Z]/.test(pwd)) {
          score += 20;
        }
        if (/[a-z]/.test(pwd)) {
          score += 10;
        }
        if (/[0-9]/.test(pwd)) {
          score += 15;
        }
        if (/[^A-Za-z0-9]/.test(pwd)) {
          score += 15;
        }
        score = Math.min(100, score);
        let level = 'weak';
        if (score >= 80) {
          level = 'strong';
        } else if (score >= 50) {
          level = 'medium';
        }
        updated.passwordScore = score;
        updated.passwordStrength = level;
      }
      return updated;
    });
  }

  public updatePaymentField(field: string, val: any): void {
    this.paymentState.update((curr) => {
      const updated = { ...curr, [field]: val };
      const raw = String(val || '').replace(/\D/g, '');
      let brand = 'generic';
      let cvvLen = 3;
      if (/^4/.test(raw)) {
        brand = 'visa';
      } else if (/^(5[1-5]|2[2-7])/.test(raw)) {
        brand = 'mastercard';
      } else if (/^3[47]/.test(raw)) {
        brand = 'amex';
        cvvLen = 4;
      } else if (/^6(?:011|5)/.test(raw)) {
        brand = 'discover';
      }
      updated.cardBrand = brand;
      updated.expectedCvvLength = cvvLen;
      return updated;
    });
  }

  public updateContentField(field: string, val: any): void {
    this.contentState.update((curr) => {
      const updated = { ...curr, [field]: val };
      if (field === 'title') {
        updated.slug = String(val || '')
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      return updated;
    });
  }

  public onCountryChange(countryVal: string): void {
    const states = STATES_BY_COUNTRY[countryVal] || [];
    this.stateOptions.set(states);
    this.countryState.set({
      country: countryVal,
      state: states.length > 0 ? states[0].value : null
    });
  }

  public onCustomRuleCreated(rule: GpBusinessRule): void {
    this.engine.registerRule(rule);
    this.toastService.success('Rule Registered', `Successfully registered rule "${rule.name || rule.id}"`);
  }

  public onSimStateChange(value: string): void {
    this.simStateJson.set(value);
    this.validateSimJson(value);
  }

  public onSimStateKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      if (!this.simJsonError() && !this.isSimulating()) {
        this.runSimulation();
      }
      return;
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      const textarea = event.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;
      const newVal = val.substring(0, start) + '  ' + val.substring(end);
      this.simStateJson.set(newVal);
      this.validateSimJson(newVal);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      });
    }
  }

  public formatSimulatorJson(): void {
    try {
      const parsed = JSON.parse(this.simStateJson());
      this.simStateJson.set(JSON.stringify(parsed, null, 2));
      this.simJsonError.set(null);
      this.toastService.success('Formatted', 'JSON state formatted cleanly with 2-space indentation.');
    } catch (err: any) {
      this.simJsonError.set(err?.message || 'Invalid JSON format');
      this.toastService.error('Format Error', 'Unable to format invalid JSON. Please correct syntax errors.');
    }
  }

  public resetSimulatorJson(): void {
    this.simStateJson.set(JSON.stringify(this.defaultSimState, null, 2));
    this.simJsonError.set(null);
    this.toastService.info('Reset', 'Mock state restored to default payload.');
  }

  private validateSimJson(val: string): boolean {
    if (!val || !val.trim()) {
      this.simJsonError.set('Initial state JSON cannot be empty.');
      return false;
    }
    try {
      JSON.parse(val);
      this.simJsonError.set(null);
      return true;
    } catch (err: any) {
      this.simJsonError.set(err?.message || 'Invalid JSON format');
      return false;
    }
  }

  public async runSimulation(): Promise<void> {
    if (!this.validateSimJson(this.simStateJson())) {
      this.toastService.error('Simulation Error', 'Please fix JSON syntax errors before running simulation.');
      return;
    }

    this.isSimulating.set(true);
    try {
      const mockState = JSON.parse(this.simStateJson());
      // Brief pause to provide visible feedback for the user
      await new Promise((resolve) => setTimeout(resolve, 150));
      const result = await GpRuleSimulator.simulate({
        rules: this.engine.rules(),
        initialState: mockState,
        triggerEvent: 'change'
      });
      this.simulationResult.set(result);
      this.toastService.info(
        'Simulation Finished',
        `Executed ${result.matchedRules.length} matching rules in ${result.durationMs}ms`
      );
    } catch (err: any) {
      this.toastService.error('Simulation Error', `Invalid JSON or execution error: ${err?.message || err}`);
    } finally {
      this.isSimulating.set(false);
    }
  }
}
