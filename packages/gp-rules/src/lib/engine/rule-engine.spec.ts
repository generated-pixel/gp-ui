import { GpRuleEngineService } from './rule-engine.service';
import { GpConditionEvaluator } from './condition-evaluator';
import { GpActionExecutor } from './action-executor';
import { GpRuleContextFactory } from './rule-context';
import { GpBusinessRule } from '../types/rule.types';

describe('GpRuleEngineService & Rule Engine', () => {
  let service: GpRuleEngineService;

  beforeEach(() => {
    service = new GpRuleEngineService();
  });

  describe('GpConditionEvaluator', () => {
    it('evaluates equality, comparison, and numeric operators correctly', () => {
      const context = GpRuleContextFactory.create({
        state: { age: 25, role: 'admin', tags: ['lead', 'eng'], score: 88 },
        triggerEvent: 'change'
      });

      expect(GpConditionEvaluator.evaluate({ field: 'age', operator: 'gte', value: 18 }, context)).toBe(true);
      expect(GpConditionEvaluator.evaluate({ field: 'age', operator: 'lt', value: 21 }, context)).toBe(false);
      expect(GpConditionEvaluator.evaluate({ field: 'role', operator: 'eq', value: 'admin' }, context)).toBe(true);
      expect(GpConditionEvaluator.evaluate({ field: 'tags', operator: 'contains', value: 'lead' }, context)).toBe(true);
      expect(GpConditionEvaluator.evaluate({ field: 'score', operator: 'between', value: [80, 90] }, context)).toBe(
        true
      );
      expect(GpConditionEvaluator.evaluate({ field: 'score', operator: 'notBetween', value: [10, 50] }, context)).toBe(
        true
      );
    });

    it('evaluates compareToField dynamic field-to-field comparisons', () => {
      const context = GpRuleContextFactory.create({
        state: { password: 'SecretPassword123', confirmPassword: 'SecretPassword123', otherField: 'Mismatch' },
        triggerEvent: 'keypress'
      });

      expect(
        GpConditionEvaluator.evaluate({ field: 'confirmPassword', operator: 'eq', compareToField: 'password' }, context)
      ).toBe(true);

      expect(
        GpConditionEvaluator.evaluate({ field: 'otherField', operator: 'eq', compareToField: 'password' }, context)
      ).toBe(false);
    });

    it('evaluates date and chronological operators', () => {
      const context = GpRuleContextFactory.create({
        state: {
          startDate: '2026-01-01T00:00:00Z',
          endDate: '2026-01-10T00:00:00Z',
          sameDayDate: '2026-01-01T12:00:00Z'
        },
        triggerEvent: 'change'
      });

      expect(
        GpConditionEvaluator.evaluate({ field: 'endDate', operator: 'isAfter', compareToField: 'startDate' }, context)
      ).toBe(true);

      expect(
        GpConditionEvaluator.evaluate({ field: 'startDate', operator: 'isBefore', compareToField: 'endDate' }, context)
      ).toBe(true);

      expect(
        GpConditionEvaluator.evaluate(
          { field: 'sameDayDate', operator: 'isSameDay', compareToField: 'startDate' },
          context
        )
      ).toBe(true);
    });

    it('evaluates array and length operators', () => {
      const context = GpRuleContextFactory.create({
        state: { roles: ['user', 'editor', 'admin'], title: 'Business Rules Engine' },
        triggerEvent: 'change'
      });

      expect(
        GpConditionEvaluator.evaluate({ field: 'roles', operator: 'allIn', value: ['user', 'admin'] }, context)
      ).toBe(true);
      expect(
        GpConditionEvaluator.evaluate({ field: 'roles', operator: 'anyIn', value: ['guest', 'admin'] }, context)
      ).toBe(true);
      expect(
        GpConditionEvaluator.evaluate({ field: 'roles', operator: 'noneIn', value: ['superadmin', 'banned'] }, context)
      ).toBe(true);
      expect(GpConditionEvaluator.evaluate({ field: 'title', operator: 'lengthGt', value: 10 }, context)).toBe(true);
    });

    it('evaluates composite AND/OR/NOT conditions', () => {
      const context = GpRuleContextFactory.create({
        state: { country: 'US', tier: 'gold', score: 85 },
        triggerEvent: 'change'
      });

      const conditionAnd = {
        all: [
          { field: 'country', operator: 'eq', value: 'US' },
          { field: 'tier', operator: 'eq', value: 'gold' }
        ]
      };
      expect(GpConditionEvaluator.evaluate(conditionAnd, context)).toBe(true);

      const conditionOr = {
        any: [
          { field: 'country', operator: 'eq', value: 'UK' },
          { field: 'score', operator: 'gte', value: 80 }
        ]
      };
      expect(GpConditionEvaluator.evaluate(conditionOr, context)).toBe(true);

      const conditionNot = {
        not: { field: 'country', operator: 'eq', value: 'US' }
      };
      expect(GpConditionEvaluator.evaluate(conditionNot, context)).toBe(false);
    });

    it('evaluates expression strings', () => {
      const context = GpRuleContextFactory.create({
        state: { price: 50, quantity: 4 },
        triggerEvent: 'change'
      });

      expect(GpConditionEvaluator.evaluate({ expression: 'price * quantity >= 200' }, context)).toBe(true);
      expect(GpConditionEvaluator.evaluate({ expression: 'price * quantity > 500' }, context)).toBe(false);
    });

    it('evaluates async predicates with evaluateAsync', async () => {
      const context = GpRuleContextFactory.create({
        state: { username: 'available_user' },
        triggerEvent: 'blur'
      });

      const asyncCond = {
        asyncPredicate: async (ctx: any) => {
          await new Promise((r) => setTimeout(r, 10));
          return ctx.get('username') === 'available_user';
        }
      };

      const result = await GpConditionEvaluator.evaluateAsync(asyncCond, context);
      expect(result).toBe(true);
    });
  });

  describe('GpActionExecutor', () => {
    it('executes setValue and advanced formula calculations with math helpers', async () => {
      const state: Record<string, any> = { unitPrice: 20, quantity: 5, discount: 10, tax: 5, total: 0 };
      const context = GpRuleContextFactory.create({
        state,
        triggerEvent: 'change',
        onStateChange: (k, v) => (state[k] = v)
      });

      await GpActionExecutor.execute(
        {
          type: 'compute',
          target: 'total',
          formula: 'ROUND(SUM(unitPrice * quantity, tax) - discount, 2)'
        },
        context
      );

      expect(context.get('total')).toBe(95);
    });

    it('executes IF and string formulas', async () => {
      const state: Record<string, any> = { quantity: 15, unitPrice: 100, label: '' };
      const context = GpRuleContextFactory.create({
        state,
        triggerEvent: 'change',
        onStateChange: (k, v) => (state[k] = v)
      });

      await GpActionExecutor.execute(
        {
          type: 'compute',
          target: 'discountedPrice',
          formula: 'IF(quantity > 10, unitPrice * 0.8, unitPrice)'
        },
        context
      );

      expect(context.get('discountedPrice')).toBe(80);
    });

    it('executes value transformations (slugify, uppercase, currency, phone)', async () => {
      const state: Record<string, any> = {
        title: 'Building Enterprise Angular 19 Apps!',
        rawPhone: '1234567890',
        amount: '1250.5'
      };
      const context = GpRuleContextFactory.create({
        state,
        triggerEvent: 'change',
        onStateChange: (k, v) => (state[k] = v)
      });

      await GpActionExecutor.execute(
        { type: 'transformValue', fromField: 'title', target: 'slug', transformType: 'slugify' },
        context
      );
      await GpActionExecutor.execute(
        { type: 'transformValue', fromField: 'rawPhone', target: 'formattedPhone', transformType: 'phone' },
        context
      );
      await GpActionExecutor.execute(
        { type: 'transformValue', fromField: 'amount', target: 'formattedCurrency', transformType: 'currency' },
        context
      );

      expect(context.get('slug')).toBe('building-enterprise-angular-19-apps');
      expect(context.get('formattedPhone')).toBe('(123) 456-7890');
      expect(context.get('formattedCurrency')).toBe('$1250.50');
    });

    it('executes copyValue action', async () => {
      const state: Record<string, any> = { billingZip: '90210' };
      const context = GpRuleContextFactory.create({
        state,
        triggerEvent: 'change',
        onStateChange: (k, v) => (state[k] = v)
      });

      await GpActionExecutor.execute({ type: 'copyValue', fromField: 'billingZip', target: 'shippingZip' }, context);
      expect(context.get('shippingZip')).toBe('90210');
    });

    it('executes validation errors and class styling actions', async () => {
      const state: Record<string, any> = {};
      const context = GpRuleContextFactory.create({
        state,
        triggerEvent: 'change',
        onStateChange: (k, v) => (state[k] = v)
      });

      await GpActionExecutor.execute(
        { type: 'setValidationError', target: 'email', errorKey: 'invalidDomain', errorMessage: 'Must use work email' },
        context
      );
      await GpActionExecutor.execute({ type: 'setClass', target: 'email', className: 'has-error' }, context);

      expect(state['_error_email']).toEqual({ key: 'invalidDomain', message: 'Must use work email' });
      expect(state['_class_email']).toBe('has-error');

      await GpActionExecutor.execute(
        { type: 'clearValidationError', target: 'email', errorKey: 'invalidDomain' },
        context
      );
      expect(state['_error_email']).toBeUndefined();
    });
  });

  describe('GpRuleEngineService Execution Pipeline & Metrics', () => {
    it('dispatches events and tracks computed analytics signals', async () => {
      const state: Record<string, any> = { coupon: 'SAVE20', discount: 0 };
      const context = GpRuleContextFactory.create({
        state,
        triggerEvent: 'blur',
        triggerValue: 'SAVE20',
        onStateChange: (k, v) => (state[k] = v)
      });

      const rule: GpBusinessRule = {
        id: 'rule-coupon',
        name: 'Coupon Validator',
        trigger: 'blur',
        condition: { field: 'coupon', operator: 'eq', value: 'SAVE20' },
        actions: [{ type: 'setValue', target: 'discount', value: 20 }],
        elseActions: [{ type: 'setValue', target: 'discount', value: 0 }]
      };

      service.registerRule(rule);

      const logs = await service.dispatchEvent('blur', context);

      expect(logs.length).toBe(1);
      expect(logs[0].conditionMet).toBe(true);
      expect(context.get('discount')).toBe(20);
      expect(service.totalExecutions()).toBe(1);
      expect(service.matchedExecutions()).toBe(1);
      expect(service.successRate()).toBe(100);
      expect(service.activeRuleCount()).toBe(1);
    });

    it('exports and imports rules from JSON', () => {
      const rule: GpBusinessRule = {
        id: 'exported-rule-1',
        name: 'Exported Rule',
        trigger: 'change',
        actions: [{ type: 'setValue', target: 'active', value: true }]
      };

      service.registerRule(rule);
      const json = service.exportRulesAsJson();
      expect(json).toContain('exported-rule-1');

      service.clearRules();
      expect(service.rules().length).toBe(0);

      const validation = service.importRulesFromJson(json);
      expect(validation.valid).toBe(true);
      expect(service.rules().length).toBe(1);
      expect(service.rules()[0].id).toBe('exported-rule-1');
    });
  });
});
