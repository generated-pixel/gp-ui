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

  it('should emit ruleCreated event on onCreateRule', () => {
    let created: GpBusinessRule | null = null;
    component.ruleCreated.subscribe((r) => (created = r));

    component.ruleId.set('my-custom-rule');
    component.conditionField.set('discountCode');
    component.conditionValue.set('PROMO50');
    fixture.detectChanges();

    component.onCreateRule();

    expect(created).toBeTruthy();
    expect(created?.id).toBe('my-custom-rule');
    expect(created?.condition?.field).toBe('discountCode');
  });
});
