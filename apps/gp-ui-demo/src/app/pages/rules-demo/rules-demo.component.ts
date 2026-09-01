import { Component, OnInit, signal, inject, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  GpInputTextComponent,
  GpInputNumberComponent,
  GpSelectComponent,
  GpBadgeComponent,
  GpIconComponent,
  GpToastComponent,
  GpToastService
} from 'gp-ui';
import {
  GpRuleDirective,
  GpRuleInspectorComponent,
  GpRuleBuilderComponent,
  GpRuleEngineService,
  GpBusinessRule,
  GP_COUPON_RULE,
  GP_ORDER_CALCULATOR_RULES,
  GP_SHIPPING_VISIBILITY_RULE,
  GP_DEPENDENT_COUNTRY_RULE,
  STATES_BY_COUNTRY
} from 'gp-rules';
import { DocCodeComponent } from '../../shared/doc-code.component';

@Component({
  selector: 'app-rules-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GpInputTextComponent,
    GpInputNumberComponent,
    GpSelectComponent,
    GpBadgeComponent,
    GpIconComponent,
    GpToastComponent,
    GpRuleDirective,
    GpRuleInspectorComponent,
    GpRuleBuilderComponent,
    DocCodeComponent
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
          <gp-badge value="v0.6.0" severity="info" />
          <gp-badge value="Signals Reactive" severity="success" />
        </div>
        <h1 class="page-title">Dynamic Business Rules Engine</h1>
        <p class="page-desc">
          Super-flexible reactive rules engine for Angular and gp-ui. Execute declarative actions triggered by keypress
          (with configurable debounce), blur / focus-out, value changes, button clicks, and custom events.
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
                  <h3>1. Keypress with Debounce (Coupon & Pricing Formula)</h3>
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

            <!-- Scenario 2: Dependent Cascading Select (Country -> State) -->
            <div class="demo-card">
              <div class="demo-card-head">
                <div class="card-icon-title">
                  <gp-icon name="globe" size="1.1em" class="icon-accent" />
                  <h3>2. Dependent Dropdown Cascader (Value Change)</h3>
                </div>
                <gp-badge value="Trigger: change" severity="info" />
              </div>
              <div class="demo-card-body">
                <p class="section-hint">
                  Select a country. The business rule dynamically loads and selects matching states/provinces and
                  disables the select when none exist.
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

            <!-- Scenario 3: Blur / Lose Focus Validation -->
            <div class="demo-card">
              <div class="demo-card-head">
                <div class="card-icon-title">
                  <gp-icon name="check-circle" size="1.1em" class="icon-accent" />
                  <h3>3. Blur / Lose Focus Event Triggers</h3>
                </div>
                <gp-badge value="Trigger: blur" severity="primary" />
              </div>
              <div class="demo-card-body">
                <p class="section-hint">
                  Type an enterprise Tax ID (e.g. <code>US-998877</code>) and tab or click away to fire the blur rule.
                </p>

                <div class="form-field-item">
                  <label>Corporate Tax ID (blur to validate)</label>
                  <gp-input-text
                    [ngModel]="taxId()"
                    (ngModelChange)="taxId.set($event)"
                    placeholder="e.g. US-998877"
                    [gpRule]="blurTaxRule"
                  />
                </div>
              </div>
            </div>

            <!-- Scenario 4: Interactive Rule Builder -->
            <gp-rule-builder (ruleCreated)="onCustomRuleCreated($event)" />
          </div>

          <!-- Right: Live Audit Trail & Rule Inspector -->
          <div class="showcase-inspector-col">
            <gp-rule-inspector />
          </div>
        </div>
      }

      <!-- TAB 2: API & Operator Reference -->
      @if (activeTab() === 'api') {
        <div class="api-docs-container">
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
                    <td>Strict or loose equality</td>
                    <td>
                      <code>{{ '{' }} field: 'role', operator: 'eq', value: 'admin' {{ '}' }}</code>
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
                        >{{ '{' }} field: 'email', operator: 'matches', value: '^[\\\\w.-]+@[\\\\w.-]+\\\\.\\\\w+$'
                        {{ '}' }}</code
                      >
                    </td>
                  </tr>
                  <tr>
                    <td><code>empty</code> / <code>notEmpty</code></td>
                    <td>Null, undefined, or empty string/array check</td>
                    <td>
                      <code>{{ '{' }} field: 'phone', operator: 'notEmpty' {{ '}' }}</code>
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
                    <td><code>compute</code> / <code>calculate</code></td>
                    <td><code>target: string</code>, <code>formula: string</code></td>
                    <td>Evaluates mathematical formula referencing state variables.</td>
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

      <!-- TAB 3: TypeScript Recipes -->
      @if (activeTab() === 'recipes') {
        <div class="recipes-container">
          <div class="doc-card">
            <div class="doc-card-header">
              <gp-icon name="code" size="1em" />
              <span>Recipe 1: Live Keypress Debounce Promo Code Evaluator</span>
            </div>
            <div class="doc-card-body">
              <doc-code [code]="recipe1Code" language="typescript" />
            </div>
          </div>

          <div class="doc-card">
            <div class="doc-card-header">
              <gp-icon name="code" size="1em" />
              <span>Recipe 2: Dynamic Cascading Country-to-State Selector</span>
            </div>
            <div class="doc-card-body">
              <doc-code [code]="recipe2Code" language="typescript" />
            </div>
          </div>

          <div class="doc-card">
            <div class="doc-card-header">
              <gp-icon name="code" size="1em" />
              <span>Recipe 3: Real-Time Pricing & Tax Calculator Formula</span>
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
export class RulesDemoComponent implements OnInit {
  private toastService = inject(GpToastService);
  private engine = inject(GpRuleEngineService);

  public activeTab = signal<'demo' | 'api' | 'recipes'>('demo');

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

  public countryState = signal<{ country: string; state: string | null }>({
    country: 'US',
    state: 'CA'
  });

  public taxId = signal<string>('');

  public countryOptions = [
    { label: 'United States', value: 'US' },
    { label: 'Canada', value: 'CA' },
    { label: 'United Kingdom', value: 'UK' },
    { label: 'Germany', value: 'DE' }
  ];

  public stateOptions = signal<Array<{ label: string; value: string }>>(STATES_BY_COUNTRY['US'] || []);

  public couponRule = GP_COUPON_RULE;
  public orderRules = GP_ORDER_CALCULATOR_RULES;
  public countryRule = GP_DEPENDENT_COUNTRY_RULE;

  public blurTaxRule: GpBusinessRule = {
    id: 'tax-id-blur-checker',
    name: 'Tax ID Format Validator',
    trigger: 'blur',
    condition: {
      field: 'taxId',
      operator: 'startsWith',
      value: 'US-'
    },
    actions: [
      {
        type: 'toast',
        message: 'Valid US Corporate Tax Identification Verified!',
        severity: 'success'
      }
    ],
    elseActions: [
      {
        type: 'toast',
        message: 'Non-standard Tax ID format entered (Expected US- prefix)',
        severity: 'warning'
      }
    ]
  };

  public exampleUsageCode = `<!-- Attach Business Rules to any component or input -->
<gp-input-text
  [(ngModel)]="couponCode"
  placeholder="Promo Code"
  [gpRule]="couponRule"
  [gpRuleState]="orderState"
/>

<!-- Live Audit Trail -->
<gp-rule-inspector />`;

  public recipe1Code = `import { GpBusinessRule } from '@generatedpixel/gp-rules';

export const promoCodeRule: GpBusinessRule = {
  id: 'promo-code-validator',
  name: 'Debounced Promo Code Evaluator',
  priority: 10,
  trigger: {
    event: 'keypress',
    debounce: 300,
    targetField: 'couponCode'
  },
  condition: {
    field: 'couponCode',
    operator: 'eq',
    value: 'SAVE20'
  },
  actions: [
    { type: 'setValue', target: 'discountPercent', value: 20 },
    { type: 'toast', message: 'Promo code SAVE20 applied! (20% OFF)', severity: 'success' }
  ],
  elseActions: [
    { type: 'setValue', target: 'discountPercent', value: 0 }
  ]
};`;

  public recipe2Code = `import { GpBusinessRule } from '@generatedpixel/gp-rules';

export const countryStateCascadeRule: GpBusinessRule = {
  id: 'country-state-cascade',
  name: 'Country to State Cascader',
  trigger: ['change', 'valueChange', 'select'],
  actions: [
    {
      type: 'custom',
      execute: (context) => {
        const country = context.get('country');
        const states = STATES_BY_COUNTRY[country] || [];
        context.setOptions('state', states);
        context.set('state', states.length > 0 ? states[0].value : null);
        context.setDisabled('state', states.length === 0);
      }
    }
  ]
};`;

  public recipe3Code = `import { GpBusinessRule } from '@generatedpixel/gp-rules';

export const pricingFormulaRules: GpBusinessRule[] = [
  {
    id: 'compute-subtotal',
    name: 'Calculate Subtotal',
    trigger: ['change', 'valueChange', 'keypress', 'blur'],
    actions: [
      {
        type: 'compute',
        target: 'subtotal',
        formula: 'quantity * unitPrice'
      }
    ]
  },
  {
    id: 'compute-order-total',
    name: 'Calculate Final Total',
    trigger: ['change', 'valueChange', 'keypress', 'blur'],
    actions: [
      {
        type: 'compute',
        target: 'total',
        formula: '(quantity * unitPrice) * (1 - (discountPercent || 0) / 100) + (tax || 0)'
      }
    ]
  }
];`;

  ngOnInit(): void {
    this.engine.registerRules([this.couponRule, ...this.orderRules, this.countryRule, this.blurTaxRule]);
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
}
