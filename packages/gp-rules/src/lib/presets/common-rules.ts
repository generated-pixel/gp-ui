/**
 * @file common-rules.ts
 * Ready-to-use business rule presets for enterprise UI patterns.
 */

import { GpBusinessRule } from '../types/rule.types';

/**
 * Live coupon / discount code validator triggered on keypress with debounce.
 */
export const GP_COUPON_RULE: GpBusinessRule = {
  id: 'coupon-code-validator',
  name: 'Debounced Promo Code Evaluator',
  description: 'Applies 20% discount on promo code "SAVE20" with 300ms keypress debounce.',
  category: 'pricing',
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
    { type: 'setValue', target: 'couponStatus', value: 'valid' },
    { type: 'toast', message: 'Promo code "SAVE20" applied! 20% OFF', severity: 'success' }
  ],
  elseActions: [
    { type: 'setValue', target: 'discountPercent', value: 0 },
    { type: 'setValue', target: 'couponStatus', value: 'none' }
  ]
};

/**
 * Order total auto-calculation rules.
 * Formula: subtotal = quantity * unitPrice; total = subtotal * (1 - discountPercent / 100) + tax
 */
export const GP_ORDER_CALCULATOR_RULES: GpBusinessRule[] = [
  {
    id: 'calculate-subtotal',
    name: 'Calculate Subtotal',
    category: 'pricing',
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
    id: 'calculate-total',
    name: 'Calculate Final Total',
    category: 'pricing',
    trigger: ['change', 'valueChange', 'keypress', 'blur'],
    actions: [
      {
        type: 'compute',
        target: 'total',
        formula: 'ROUND((quantity * unitPrice) * (1 - (discountPercent || 0) / 100) + (tax || 0), 2)'
      }
    ]
  }
];

/**
 * Conditional shipping address visibility rule.
 */
export const GP_SHIPPING_VISIBILITY_RULE: GpBusinessRule = {
  id: 'shipping-address-toggle',
  name: 'Toggle Shipping Address',
  description: 'Shows shipping address inputs only when separate shipping address is checked.',
  category: 'ui',
  trigger: ['change', 'valueChange', 'click'],
  condition: {
    field: 'sameAsBilling',
    operator: 'eq',
    value: false
  },
  actions: [
    { type: 'show', target: 'shippingAddressSection' },
    { type: 'enable', target: 'shippingAddress' }
  ],
  elseActions: [
    { type: 'hide', target: 'shippingAddressSection' },
    { type: 'disable', target: 'shippingAddress' }
  ]
};

/**
 * Dynamic Password & Confirmation Match Validator using compareToField.
 */
export const GP_CONFIRM_FIELD_RULE: GpBusinessRule = {
  id: 'confirm-password-validator',
  name: 'Confirm Password Match Validator',
  description: 'Validates that confirmPassword matches password and sets validation errors accordingly.',
  category: 'validation',
  priority: 20,
  trigger: [
    { event: 'keypress', debounce: 250, targetField: 'confirmPassword' },
    { event: 'blur', targetField: 'confirmPassword' },
    { event: 'change', targetField: 'confirmPassword' }
  ],
  condition: {
    field: 'confirmPassword',
    operator: 'eq',
    compareToField: 'password'
  },
  actions: [
    { type: 'clearValidationError', target: 'confirmPassword', errorKey: 'mismatch' },
    { type: 'setClass', target: 'confirmPassword', className: 'field-valid', removeClassName: 'field-invalid' }
  ],
  elseActions: [
    {
      type: 'setValidationError',
      target: 'confirmPassword',
      errorKey: 'mismatch',
      errorMessage: 'Passwords do not match.'
    },
    { type: 'setClass', target: 'confirmPassword', className: 'field-invalid', removeClassName: 'field-valid' }
  ]
};

/**
 * Live Password Strength & Complexity Evaluator.
 */
export const GP_PASSWORD_STRENGTH_RULE: GpBusinessRule = {
  id: 'password-strength-evaluator',
  name: 'Password Strength Evaluator',
  description: 'Evaluates password complexity score across length, casing, numbers, and symbols.',
  category: 'validation',
  priority: 15,
  trigger: {
    event: 'keypress',
    debounce: 200,
    targetField: 'password'
  },
  actions: [
    {
      type: 'custom',
      execute: (context) => {
        const pwd = String(context.get('password') || '');
        let score = 0;
        if (pwd.length >= 8) score += 25;
        if (pwd.length >= 12) score += 15;
        if (/[A-Z]/.test(pwd)) score += 20;
        if (/[a-z]/.test(pwd)) score += 10;
        if (/[0-9]/.test(pwd)) score += 15;
        if (/[^A-Za-z0-9]/.test(pwd)) score += 15;

        score = Math.min(100, score);
        let level = 'weak';
        if (score >= 80) level = 'strong';
        else if (score >= 50) level = 'medium';

        context.set('passwordScore', score);
        context.set('passwordStrength', level);
      }
    }
  ]
};

/**
 * Auto Credit Card Type & Brand Detection Rule.
 */
export const GP_CREDIT_CARD_TYPE_RULE: GpBusinessRule = {
  id: 'credit-card-type-detector',
  name: 'Credit Card Brand Detector',
  description: 'Detects Visa, Mastercard, American Express, and Discover from card number prefix.',
  category: 'payment',
  priority: 10,
  trigger: {
    event: 'keypress',
    debounce: 100,
    targetField: 'cardNumber'
  },
  actions: [
    {
      type: 'custom',
      execute: (context) => {
        const raw = String(context.get('cardNumber') || '').replace(/\D/g, '');
        let brand = 'generic';
        let cvvLen = 3;

        if (/^4/.test(raw)) {
          brand = 'visa';
          cvvLen = 3;
        } else if (/^(5[1-5]|2[2-7])/.test(raw)) {
          brand = 'mastercard';
          cvvLen = 3;
        } else if (/^3[47]/.test(raw)) {
          brand = 'amex';
          cvvLen = 4;
        } else if (/^6(?:011|5)/.test(raw)) {
          brand = 'discover';
          cvvLen = 3;
        }

        context.set('cardBrand', brand);
        context.set('expectedCvvLength', cvvLen);
      }
    }
  ]
};

/**
 * Date Range Validator Rule (Ensures End Date is after Start Date).
 */
export const GP_DATE_RANGE_RULE: GpBusinessRule = {
  id: 'date-range-validator',
  name: 'Start/End Date Chronology Validator',
  description: 'Verifies that booking/reservation end date is chronologically after start date.',
  category: 'validation',
  priority: 10,
  trigger: ['change', 'valueChange', 'blur'],
  condition: {
    field: 'endDate',
    operator: 'isAfter',
    compareToField: 'startDate'
  },
  actions: [
    { type: 'clearValidationError', target: 'endDate', errorKey: 'chronologyError' }
  ],
  elseActions: [
    {
      type: 'setValidationError',
      target: 'endDate',
      errorKey: 'chronologyError',
      errorMessage: 'End date must be after start date.'
    }
  ]
};

/**
 * Auto-Slugify Rule.
 */
export const GP_SLUGIFY_RULE: GpBusinessRule = {
  id: 'auto-slug-generator',
  name: 'Auto URL Slug Generator',
  description: 'Transforms article or page title into a clean URL slug.',
  category: 'content',
  trigger: {
    event: 'keypress',
    debounce: 300,
    targetField: 'title'
  },
  actions: [
    {
      type: 'transformValue',
      fromField: 'title',
      target: 'slug',
      transformType: 'slugify'
    }
  ]
};
