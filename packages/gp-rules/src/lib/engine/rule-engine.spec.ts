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
    it('evaluates equality and numeric operators correctly', () => {
      const context = GpRuleContextFactory.create({
        state: { age: 25, role: 'admin', tags: ['lead', 'eng'] },
        triggerEvent: 'change'
      });

      expect(GpConditionEvaluator.evaluate({ field: 'age', operator: 'gte', value: 18 }, context)).toBe(true);
      expect(GpConditionEvaluator.evaluate({ field: 'age', operator: 'lt', value: 21 }, context)).toBe(false);
      expect(GpConditionEvaluator.evaluate({ field: 'role', operator: 'eq', value: 'admin' }, context)).toBe(true);
      expect(GpConditionEvaluator.evaluate({ field: 'tags', operator: 'contains', value: 'lead' }, context)).toBe(true);
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
  });

  describe('GpActionExecutor', () => {
    it('executes setValue and formula calculation actions', async () => {
      const state: Record<string, any> = { unitPrice: 20, quantity: 5, discount: 10, total: 0 };
      const context = GpRuleContextFactory.create({
        state,
        triggerEvent: 'change',
        onStateChange: (k, v) => (state[k] = v)
      });

      await GpActionExecutor.execute(
        {
          type: 'compute',
          target: 'total',
          formula: 'unitPrice * quantity - discount'
        },
        context
      );

      expect(context.get('total')).toBe(90);
    });

    it('executes visibility and enable/disable actions', async () => {
      const state: Record<string, any> = {};
      const context = GpRuleContextFactory.create({
        state,
        triggerEvent: 'change',
        onVisibilityChange: (k, v) => (state[`_visible_${k}`] = v),
        onDisabledChange: (k, v) => (state[`_disabled_${k}`] = v)
      });

      await GpActionExecutor.execute({ type: 'show', target: 'couponSection' }, context);
      await GpActionExecutor.execute({ type: 'disable', target: 'submitBtn' }, context);

      expect(state['_visible_couponSection']).toBe(true);
      expect(state['_disabled_submitBtn']).toBe(true);
    });
  });

  describe('GpRuleEngineService Execution Pipeline', () => {
    it('dispatches events and executes matching business rules', async () => {
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
      expect(service.logs().length).toBe(1);
    });

    it('isolates scoped debounced rules by target field and cleans them up after execution', async () => {
      jasmine.clock().install();

      try {
        const rule: GpBusinessRule = {
          id: 'shared-rule',
          trigger: { event: 'input', debounce: 100 },
          actions: []
        };
        const executionLog = {
          ruleId: rule.id,
          timestamp: new Date(),
          triggerEvent: 'input',
          conditionMet: true,
          actionsExecuted: [],
          durationMs: 0
        };
        const executeSpy = spyOn(service, 'executeRule').and.resolveTo(executionLog);
        const sharedState = {};

        const firstContext = GpRuleContextFactory.create({ state: sharedState, triggerEvent: 'input' });
        const secondContext = GpRuleContextFactory.create({ state: sharedState, triggerEvent: 'input' });

        await service.dispatchEvent('input', firstContext, 'fieldA', [rule]);
        await service.dispatchEvent('input', secondContext, 'fieldB', [rule]);

        expect((service as any).debouncers.size).toBe(2);

        jasmine.clock().tick(100);
        await Promise.resolve();
        await Promise.resolve();

        expect(executeSpy).toHaveBeenCalledTimes(2);
        expect(executeSpy.calls.allArgs().map((args) => args[3]).sort()).toEqual(['fieldA', 'fieldB']);
        expect((service as any).debouncers.size).toBe(0);
      } finally {
        jasmine.clock().uninstall();
      }
    });
  });
});
