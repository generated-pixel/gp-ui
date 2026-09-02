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
