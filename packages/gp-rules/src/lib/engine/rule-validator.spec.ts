import { GpRuleValidator } from './rule-validator';
import { GpBusinessRule } from '../types/rule.types';

describe('GpRuleValidator', () => {
  it('validates correct rules as valid', () => {
    const validRule: GpBusinessRule = {
      id: 'valid-rule',
      name: 'Valid Business Rule',
      trigger: 'change',
      condition: { field: 'age', operator: 'gte', value: 18 },
      actions: [{ type: 'setValue', target: 'canVote', value: true }]
    };

    const result = GpRuleValidator.validate(validRule);
    expect(result.valid).toBe(true);
    expect(result.errors.length).toBe(0);
  });

  it('detects invalid triggers, missing IDs, and malformed formulas', () => {
    const invalidRule: GpBusinessRule = {
      id: '',
      trigger: '',
      actions: [{ type: 'compute', target: 'total', formula: '((quantity * unitPrice' }]
    };

    const result = GpRuleValidator.validate(invalidRule);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.code === 'INVALID_RULE_ID')).toBe(true);
    expect(result.errors.some((e) => e.code === 'INVALID_TRIGGER_EVENT')).toBe(true);
    expect(result.errors.some((e) => e.code === 'MALFORMED_FORMULA')).toBe(true);
  });

  it('detects duplicate IDs and cyclic dependencies', () => {
    const ruleA: GpBusinessRule = {
      id: 'rule-A',
      trigger: 'change',
      dependsOn: ['rule-B'],
      actions: [{ type: 'setValue', target: 'a', value: 1 }]
    };

    const ruleB: GpBusinessRule = {
      id: 'rule-B',
      trigger: 'change',
      dependsOn: ['rule-A'],
      actions: [{ type: 'setValue', target: 'b', value: 2 }]
    };

    const result = GpRuleValidator.validate([ruleA, ruleB]);
    expect(result.valid).toBe(false);
    expect(result.cyclicDependencies).toBeDefined();
    expect(result.errors.some((e) => e.code === 'CYCLIC_DEPENDENCY')).toBe(true);
  });
});
