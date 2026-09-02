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
    expect(created?.id).toBe('my-custom-rule');
    expect(created?.condition?.field).toBe('discountCode');
    expect(created?.condition?.value).toBe('PROMO50');
    expect(created?.condition?.compareToField).toBeUndefined();
  });

  it('should emit rule with compareToField when compareMode is compareToField', () => {
    let created: GpBusinessRule | null = null;
    component.ruleCreated.subscribe((r) => (created = r));

    component.conditionField.set('confirmPassword');
    component.compareMode.set('compareToField');
    component.compareToField.set('password');
    component.actionType.set('setValidationError');
    component.actionValue.set('Passwords must match');
    fixture.detectChanges();

    component.onCreateRule();

    expect(created).toBeTruthy();
    expect(created?.condition?.compareToField).toBe('password');
    expect(created?.actions[0].type).toBe('setValidationError');
    expect(created?.actions[0].errorKey).toBe('ruleError');
  });

  it('should support else actions configuration', () => {
    let created: GpBusinessRule | null = null;
    component.ruleCreated.subscribe((r) => (created = r));

    component.enableElseAction.set(true);
    component.elseActionType.set('setValue');
    component.elseActionTarget.set('discount');
    component.elseActionValue.set('0');
    fixture.detectChanges();

    component.onCreateRule();

    expect(created).toBeTruthy();
    expect(created?.elseActions).toBeDefined();
    expect(Array.isArray(created?.elseActions)).toBe(true);
    expect((created?.elseActions as any)[0].type).toBe('setValue');
  });
});
