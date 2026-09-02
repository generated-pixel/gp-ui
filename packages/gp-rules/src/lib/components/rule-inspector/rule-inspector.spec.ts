import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpRuleInspector } from './rule-inspector';
import { GpRuleEngineService } from '../../engine/rule-engine.service';

describe('GpRuleInspector', () => {
  let component: GpRuleInspector;
  let fixture: ComponentFixture<GpRuleInspector>;
  let engine: GpRuleEngineService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpRuleInspector]
    }).compileComponents();

    fixture = TestBed.createComponent(GpRuleInspector);
    component = fixture.componentInstance;
    engine = TestBed.inject(GpRuleEngineService);
  });

  it('should create the rule inspector component', () => {
    expect(component).toBeTruthy();
  });

  it('should filter logs by search query and match status', () => {
    engine.logs.set([
      {
        ruleId: 'coupon-rule',
        ruleName: 'Coupon Validator',
        timestamp: new Date(),
        triggerEvent: 'keypress',
        conditionMet: true,
        actionsExecuted: ['setValue(discount = 20)'],
        durationMs: 1.5
      },
      {
        ruleId: 'shipping-rule',
        ruleName: 'Shipping Address Toggle',
        timestamp: new Date(),
        triggerEvent: 'change',
        conditionMet: false,
        actionsExecuted: [],
        durationMs: 0.8
      }
    ]);
    fixture.detectChanges();

    expect(component.filteredLogs().length).toBe(2);

    // Filter by search query
    component.filterQuery.set('coupon');
    expect(component.filteredLogs().length).toBe(1);
    expect(component.filteredLogs()[0].ruleId).toBe('coupon-rule');

    // Reset query and filter by status
    component.filterQuery.set('');
    component.statusFilter.set('matched');
    expect(component.filteredLogs().length).toBe(1);
    expect(component.filteredLogs()[0].ruleId).toBe('coupon-rule');

    component.statusFilter.set('unmatched');
    expect(component.filteredLogs().length).toBe(1);
    expect(component.filteredLogs()[0].ruleId).toBe('shipping-rule');
  });

  it('should clear logs when clear button is invoked', () => {
    engine.logs.set([
      {
        ruleId: 'r1',
        timestamp: new Date(),
        triggerEvent: 'click',
        conditionMet: true,
        actionsExecuted: ['setValue()'],
        durationMs: 1.2
      }
    ]);
    fixture.detectChanges();

    component.onClear();
    expect(engine.logs().length).toBe(0);
  });
});
