import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { GpRuleDirective } from './rule.directive';
import { GpRuleGroupDirective } from './rule-group.directive';
import { GpBusinessRule } from '../types/rule.types';
import { GpRuleEngineService } from '../engine/rule-engine.service';

@Component({
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, GpRuleDirective, GpRuleGroupDirective],
  template: `
    <div [gpRuleGroup]="groupRules" [gpRuleState]="groupState">
      <input
        id="test-input"
        type="text"
        [gpRule]="testRule"
        [gpRuleState]="state"
        [formControl]="formCtrl"
        (ruleExecuted)="onExecuted($event)"
      />
    </div>
  `
})
class TestHost {
  public state: Record<string, any> = { promo: 'SAVE20' };
  public groupState: Record<string, any> = { groupVal: 'GROUP' };
  public formCtrl = new FormControl('');
  public lastResult: any = null;

  public testRule: GpBusinessRule = {
    id: 'test-click-rule',
    trigger: ['click', 'blur', 'input', 'keydown', 'keyup', 'change'],
    condition: { field: 'promo', operator: 'eq', value: 'SAVE20' },
    actions: [{ type: 'setValue', target: 'discount', value: 50 }]
  };

  public groupRules: GpBusinessRule[] = [
    {
      id: 'group-rule-1',
      trigger: 'click',
      actions: [{ type: 'setValue', target: 'groupLogged', value: true }]
    }
  ];

  public onExecuted(res: any): void {
    this.lastResult = res;
  }
}

describe('GpRuleDirective & GpRuleGroupDirective', () => {
  let fixture: ComponentFixture<TestHost>;
  let host: TestHost;
  let engine: GpRuleEngineService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    host = fixture.componentInstance;
    engine = TestBed.inject(GpRuleEngineService);
  });

  it('should initialize and dispatch init event', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(engine.logs().length).toBeGreaterThanOrEqual(1);
  });

  it('should dispatch click event trigger on host click and emit ruleExecuted', async () => {
    fixture.detectChanges();
    const inputEl = fixture.nativeElement.querySelector('#test-input') as HTMLInputElement;
    inputEl.click();
    await fixture.whenStable();

    expect(engine.logs().length).toBeGreaterThanOrEqual(1);
    expect(host.lastResult).toBeTruthy();
    expect(host.lastResult.ruleId).toBe('test-click-rule');
    expect(host.lastResult.conditionMet).toBe(true);
  });

  it('should dispatch blur, focus, input, and keydown events', async () => {
    fixture.detectChanges();
    const inputEl = fixture.nativeElement.querySelector('#test-input') as HTMLInputElement;

    inputEl.dispatchEvent(new Event('focus'));
    inputEl.dispatchEvent(new Event('blur'));
    inputEl.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    inputEl.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    inputEl.dispatchEvent(new Event('input'));
    inputEl.dispatchEvent(new Event('change'));

    await fixture.whenStable();
    expect(engine.logs().length).toBeGreaterThanOrEqual(2);
  });

  it('should respond to reactive form control valueChanges', async () => {
    fixture.detectChanges();
    host.formCtrl.setValue('NEW_VAL');
    await fixture.whenStable();

    expect(engine.logs().some((l) => l.triggerEvent === 'valueChange')).toBe(true);
  });
});
