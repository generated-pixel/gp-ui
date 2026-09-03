import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpRuleBuilder } from './rule-builder';
import { GpBusinessRule } from '../../types/rule.types';

describe('GpRuleBuilder', () => {
  let component: GpRuleBuilder;
  let fixture: ComponentFixture<GpRuleBuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpRuleBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(GpRuleBuilder);
    component = fixture.componentInstance;
  });

  it('should create the rule builder component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit ruleCreated event on onCreateRule with static value condition', () => {
    let created: GpBusinessRule | null = null;
    component.ruleCreated.subscribe((r) => (created = r));

    component.ruleId.set('my-custom-rule');
    component.conditionField.set('discountCode');
    component.conditionValue.set('PROMO50');
    component.compareMode.set('staticValue');
    fixture.detectChanges();

    component.onCreateRule();

    expect(created).toBeTruthy();
    const rule1 = created as unknown as any;
    expect(rule1?.id).toBe('my-custom-rule');
    expect(rule1?.condition?.field).toBe('discountCode');
    expect(rule1?.condition?.value).toBe('PROMO50');
    expect(rule1?.condition?.compareToField).toBeUndefined();
  });

  it('should emit rule with compareToField when compareMode is compareToField', () => {
    let created: GpBusinessRule | null = null;
    component.ruleCreated.subscribe((r: GpBusinessRule) => (created = r));

    component.conditionField.set('confirmPassword');
    component.compareMode.set('compareToField');
    component.compareToField.set('password');
    component.actionType.set('setValidationError');
    component.actionValue.set('Passwords must match');
    fixture.detectChanges();

    component.onCreateRule();

    expect(created).toBeTruthy();
    const rule2 = created as unknown as any;
    expect(rule2?.condition?.compareToField).toBe('password');
    expect(rule2?.actions[0].type).toBe('setValidationError');
    expect(rule2?.actions[0].errorKey).toBe('ruleError');
  });

  it('should support else actions configuration', () => {
    let created: GpBusinessRule | null = null;
    component.ruleCreated.subscribe((r: GpBusinessRule) => (created = r));

    component.enableElseAction.set(true);
    component.elseActionType.set('setValue');
    component.elseActionTarget.set('discount');
    component.elseActionValue.set('0');
    fixture.detectChanges();

    component.onCreateRule();

    expect(created).toBeTruthy();
    const rule3 = created as unknown as any;
    expect(rule3?.elseActions).toBeDefined();
    expect(Array.isArray(rule3?.elseActions)).toBe(true);
    expect(rule3?.elseActions[0].type).toBe('setValue');
  });
});
