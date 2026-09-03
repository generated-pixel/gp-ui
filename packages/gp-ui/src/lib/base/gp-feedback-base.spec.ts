import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpFeedbackBase } from './gp-feedback-base';

@Component({
  standalone: true,
  template: '<div>{{ severity() }} - {{ defaultIcon() }}</div>'
})
class TestFeedbackHost extends GpFeedbackBase {}

describe('GpFeedbackBase', () => {
  let fixture: ComponentFixture<TestFeedbackHost>;
  let component: TestFeedbackHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestFeedbackHost]
    }).compileComponents();

    fixture = TestBed.createComponent(TestFeedbackHost);
    component = fixture.componentInstance;
  });

  it('should initialize with default info severity and icon', () => {
    expect(component.severity()).toBe('info');
    expect(component.defaultIcon()).toBe('info-circle');
    expect(component.visible()).toBe(true);
  });

  it('should compute icons according to severity', () => {
    fixture.componentRef.setInput('severity', 'success');
    expect(component.defaultIcon()).toBe('check-circle');

    fixture.componentRef.setInput('severity', 'warning');
    expect(component.defaultIcon()).toBe('exclamation-triangle');

    fixture.componentRef.setInput('severity', 'danger');
    expect(component.defaultIcon()).toBe('times-circle');
  });

  it('should close and emit onClose', () => {
    let closed = false;
    component.onClose.subscribe(() => (closed = true));

    component.close();
    expect(component.visible()).toBe(false);
    expect(closed).toBe(true);
  });
});
