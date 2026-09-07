import { Component, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpAnalyticsBase } from './gp-analytics-base';
import { GpTranslationService } from '../../services/translation.service';

@Component({
  standalone: true,
  template: `
    <div [id]="id()" [class]="cx('test-root', 'custom-class')">
      <input [id]="inputId()" [disabled]="disabled()" />
      @if (loading()) {
        <span class="test-spinner">Loading...</span>
      }
    </div>
  `
})
class TestAnalyticsComponent extends GpAnalyticsBase {
  public initCalled = false;
  public changesCalled = false;
  public destroyCalled = false;
  public lastChanges: SimpleChanges | null = null;

  override onInit(): void {
    this.initCalled = true;
  }

  override onChanges(changes: SimpleChanges): void {
    this.changesCalled = true;
    this.lastChanges = changes;
  }

  override onDestroy(): void {
    this.destroyCalled = true;
  }
}

describe('GpAnalyticsBase', () => {
  let fixture: ComponentFixture<TestAnalyticsComponent>;
  let component: TestAnalyticsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestAnalyticsComponent],
      providers: [GpTranslationService]
    }).compileComponents();

    fixture = TestBed.createComponent(TestAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and generate deterministic unique IDs', () => {
    expect(component).toBeTruthy();
    expect(component.id()).toMatch(/^gp_ana_/);
    expect(component.inputId()).toMatch(/^gp_ana_input_/);
  });

  it('should support cx helper method combining classes and styleClass', () => {
    const classes = component.cx('card-primary', false, 'active');
    expect(classes).toBe('card-primary active');
  });

  it('should delegate lifecycle hooks to onInit and onDestroy', () => {
    expect(component.initCalled).toBe(true);

    const mockChanges: SimpleChanges = {};
    component.ngOnChanges(mockChanges);
    expect(component.changesCalled).toBe(true);
    expect(component.lastChanges).toBe(mockChanges);

    component.ngOnDestroy();
    expect(component.destroyCalled).toBe(true);
  });

  it('should provide translation service and translation helper', () => {
    expect(component.translationService).toBeTruthy();
    expect(component.i18n).toBe(component.translationService);
  });

  it('should default loading to false', () => {
    expect(component.loading()).toBe(false);
  });
});
