/**
 * @file common-rules.ts
 * Ready-to-use business rule presets for common UI patterns.
 */

import { GpBusinessRule } from '../types/rule.types';

/**
 * Live coupon / discount code validator triggered on keypress with debounce.
 */
export const GP_COUPON_RULE: GpBusinessRule = {
  id: 'coupon-code-validator',
  name: 'Debounced Promo Code Evaluator',
  description: 'Applies 20% discount on promo code "SAVE20" with 300ms keypress debounce.',
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
 * Order total auto-calculation rule.
 * Formula: subtotal = quantity * unitPrice; total = subtotal * (1 - discountPercent / 100) + tax
 */
export const GP_ORDER_CALCULATOR_RULES: GpBusinessRule[] = [
  {
    id: 'calculate-subtotal',
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
    id: 'calculate-total',
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
];

/**
 * Conditional shipping address visibility rule.
 */
export const GP_SHIPPING_VISIBILITY_RULE: GpBusinessRule = {
  id: 'shipping-address-toggle',
  name: 'Toggle Shipping Address',
  description: 'Shows shipping address inputs only when separate shipping address is checked.',
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
