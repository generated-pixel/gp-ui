import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpRuleBuilderComponent } from './rule-builder.component';
import { GpBusinessRule } from '../../types/rule.types';

describe('GpRuleBuilderComponent', () => {
  let component: GpRuleBuilderComponent;
  let fixture: ComponentFixture<GpRuleBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpRuleBuilderComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpRuleBuilderComponent);
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
