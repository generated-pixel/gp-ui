import { GpRuleSimulator } from './rule-simulator';
import { GpBusinessRule } from '../types/rule.types';

describe('GpRuleSimulator', () => {
  it('simulates rule execution and calculates before/after diffs cleanly without modifying input state', async () => {
    const initialState = {
      quantity: 5,
      unitPrice: 20,
      couponCode: 'SAVE20',
      discountPercent: 0,
      subtotal: 0,
      total: 0
    };

    const rules: GpBusinessRule[] = [
      {
        id: 'coupon-rule',
        name: 'Coupon Check',
        trigger: 'change',
        condition: { field: 'couponCode', operator: 'eq', value: 'SAVE20' },
        actions: [{ type: 'setValue', target: 'discountPercent', value: 20 }]
      },
      {
        id: 'calc-total-rule',
        name: 'Total Calculation',
        trigger: 'change',
        actions: [
          { type: 'compute', target: 'subtotal', formula: 'quantity * unitPrice' },
          { type: 'compute', target: 'total', formula: 'ROUND(quantity * unitPrice * (1 - discountPercent / 100), 2)' }
        ]
      }
    ];

    const result = await GpRuleSimulator.simulate({
      rules,
      initialState,
      triggerEvent: 'change'
    });

    expect(result.matchedRules).toContain('coupon-rule');
    expect(result.matchedRules).toContain('calc-total-rule');
    expect(result.finalState['discountPercent']).toBe(20);
    expect(result.finalState['subtotal']).toBe(100);
    expect(result.finalState['total']).toBe(80);

    // Initial state object is not mutated
    expect(initialState['total']).toBe(0);

    // State diff contains changed fields
    expect(result.stateDiff.changed['total']).toBeDefined();
    expect(result.stateDiff.changed['total'].before).toBe(0);
    expect(result.stateDiff.changed['total'].after).toBe(80);
  });
});
