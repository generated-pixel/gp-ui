import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpRuleInspectorComponent } from './rule-inspector.component';
import { GpRuleEngineService } from '../../engine/rule-engine.service';

describe('GpRuleInspectorComponent', () => {
  let component: GpRuleInspectorComponent;
  let fixture: ComponentFixture<GpRuleInspectorComponent>;
  let engine: GpRuleEngineService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpRuleInspectorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpRuleInspectorComponent);
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
