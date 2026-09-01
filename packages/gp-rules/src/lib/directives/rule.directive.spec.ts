import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpRuleDirective } from './rule.directive';
import { GpBusinessRule } from '../types/rule.types';
import { GpRuleEngineService } from '../engine/rule-engine.service';

@Component({
  standalone: true,
  imports: [GpRuleDirective],
  template: `
    <input
      type="text"
      [gpRule]="testRule"
      [gpRuleState]="state"
      (ruleExecuted)="onExecuted($event)"
    />
  `
})
class TestHostComponent {
  public state: Record<string, any> = { value: 'VIP' };
  public lastResult: any = null;

  public testRule: GpBusinessRule = {
    id: 'test-click-rule',
    trigger: 'click',
    actions: [{ type: 'setValue', target: 'discount', value: 50 }]
  };

  public onExecuted(res: any): void {
    this.lastResult = res;
  }
}

describe('GpRuleDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let engine: GpRuleEngineService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    engine = TestBed.inject(GpRuleEngineService);
  });

  it('should dispatch click event trigger on host click', async () => {
    fixture.detectChanges();
    const inputEl = fixture.nativeElement.querySelector('input');
    inputEl.click();
    await fixture.whenStable();

    expect(engine.logs().length).toBeGreaterThanOrEqual(1);
  });
});
