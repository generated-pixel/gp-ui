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
  templateUrl: './rules-demo.html',
  styleUrl: './rules-demo.scss'
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
