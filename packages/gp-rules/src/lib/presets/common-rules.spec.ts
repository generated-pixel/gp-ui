import {
  GP_COUPON_RULE,
  GP_ORDER_CALCULATOR_RULES,
  GP_SHIPPING_VISIBILITY_RULE,
  GP_CONFIRM_FIELD_RULE,
  GP_PASSWORD_STRENGTH_RULE,
  GP_CREDIT_CARD_TYPE_RULE,
  GP_DATE_RANGE_RULE,
  GP_SLUGIFY_RULE
} from './common-rules';
import { GP_DEPENDENT_COUNTRY_RULE, STATES_BY_COUNTRY } from './dependent-dropdown-rules';
import { GpRuleSimulator } from '../engine/rule-simulator';

describe('Common Business Rule Presets', () => {
  it('evaluates GP_COUPON_RULE for valid and invalid promo codes', async () => {
    const validSim = await GpRuleSimulator.simulate({
      rules: [GP_COUPON_RULE],
      initialState: { couponCode: 'SAVE20', discountPercent: 0 },
      triggerEvent: 'keypress'
    });
    expect(validSim.finalState['discountPercent']).toBe(20);
    expect(validSim.finalState['couponStatus']).toBe('valid');

    const invalidSim = await GpRuleSimulator.simulate({
      rules: [GP_COUPON_RULE],
      initialState: { couponCode: 'INVALID', discountPercent: 20 },
      triggerEvent: 'keypress'
    });
    expect(invalidSim.finalState['discountPercent']).toBe(0);
    expect(invalidSim.finalState['couponStatus']).toBe('none');
  });

  it('evaluates GP_ORDER_CALCULATOR_RULES pricing formulas', async () => {
    const sim = await GpRuleSimulator.simulate({
      rules: GP_ORDER_CALCULATOR_RULES,
      initialState: { quantity: 3, unitPrice: 50, discountPercent: 20, tax: 10, subtotal: 0, total: 0 },
      triggerEvent: 'change'
    });
    expect(sim.finalState['subtotal']).toBe(150);
    expect(sim.finalState['total']).toBe(130);
  });

  it('evaluates GP_CONFIRM_FIELD_RULE match and mismatch', async () => {
    const matchSim = await GpRuleSimulator.simulate({
      rules: [GP_CONFIRM_FIELD_RULE],
      initialState: { password: 'SecretPassword99', confirmPassword: 'SecretPassword99' },
      triggerEvent: 'keypress',
      targetField: 'confirmPassword'
    });
    expect(matchSim.finalState['_class_confirmPassword']).toContain('field-valid');

    const mismatchSim = await GpRuleSimulator.simulate({
      rules: [GP_CONFIRM_FIELD_RULE],
      initialState: { password: 'SecretPassword99', confirmPassword: 'DifferentPassword' },
      triggerEvent: 'keypress',
      targetField: 'confirmPassword'
    });
    expect(mismatchSim.finalState['_error_confirmPassword']).toBeDefined();
    expect(mismatchSim.finalState['_class_confirmPassword']).toContain('field-invalid');
  });

  it('evaluates GP_PASSWORD_STRENGTH_RULE score and levels', async () => {
    const weakSim = await GpRuleSimulator.simulate({
      rules: [GP_PASSWORD_STRENGTH_RULE],
      initialState: { password: 'abc' },
      triggerEvent: 'keypress',
      targetField: 'password'
    });
    expect(weakSim.finalState['passwordStrength']).toBe('weak');

    const strongSim = await GpRuleSimulator.simulate({
      rules: [GP_PASSWORD_STRENGTH_RULE],
      initialState: { password: 'P@ssw0rdSecure!2026' },
      triggerEvent: 'keypress',
      targetField: 'password'
    });
    expect(strongSim.finalState['passwordStrength']).toBe('strong');
    expect(strongSim.finalState['passwordScore']).toBeGreaterThanOrEqual(80);
  });

  it('evaluates GP_CREDIT_CARD_TYPE_RULE for major card brands', async () => {
    const visaSim = await GpRuleSimulator.simulate({
      rules: [GP_CREDIT_CARD_TYPE_RULE],
      initialState: { cardNumber: '4111 2222 3333 4444' },
      triggerEvent: 'keypress',
      targetField: 'cardNumber'
    });
    expect(visaSim.finalState['cardBrand']).toBe('visa');
    expect(visaSim.finalState['expectedCvvLength']).toBe(3);

    const amexSim = await GpRuleSimulator.simulate({
      rules: [GP_CREDIT_CARD_TYPE_RULE],
      initialState: { cardNumber: '3782 822463 10005' },
      triggerEvent: 'keypress',
      targetField: 'cardNumber'
    });
    expect(amexSim.finalState['cardBrand']).toBe('amex');
    expect(amexSim.finalState['expectedCvvLength']).toBe(4);
  });

  it('evaluates GP_DATE_RANGE_RULE chronology check', async () => {
    const validSim = await GpRuleSimulator.simulate({
      rules: [GP_DATE_RANGE_RULE],
      initialState: { startDate: '2026-05-01', endDate: '2026-05-10' },
      triggerEvent: 'change'
    });
    expect(validSim.finalState['_error_endDate']).toBeUndefined();

    const invalidSim = await GpRuleSimulator.simulate({
      rules: [GP_DATE_RANGE_RULE],
      initialState: { startDate: '2026-05-10', endDate: '2026-05-01' },
      triggerEvent: 'change'
    });
    expect(invalidSim.finalState['_error_endDate']).toBeDefined();
    expect(invalidSim.finalState['_error_endDate'].key).toBe('chronologyError');
  });

  it('evaluates GP_SLUGIFY_RULE title transformation', async () => {
    const sim = await GpRuleSimulator.simulate({
      rules: [GP_SLUGIFY_RULE],
      initialState: { title: 'Modern Angular 19 Architecture Guide!' },
      triggerEvent: 'keypress',
      targetField: 'title'
    });
    expect(sim.finalState['slug']).toBe('modern-angular-19-architecture-guide');
  });

  it('evaluates GP_DEPENDENT_COUNTRY_RULE cascading options', async () => {
    const sim = await GpRuleSimulator.simulate({
      rules: [GP_DEPENDENT_COUNTRY_RULE],
      initialState: { country: 'CA', state: null },
      triggerEvent: 'change'
    });
    expect(sim.finalState['_options_state']).toEqual(STATES_BY_COUNTRY['CA']);
    expect(sim.finalState['state']).toBe('ON');
  });
});
