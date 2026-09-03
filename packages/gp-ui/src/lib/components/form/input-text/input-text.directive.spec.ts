import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { GpInputTextDirective } from './input-text.directive';

@Component({
  standalone: true,
  imports: [GpInputTextDirective],
  template: ' <input gpInputText size="sm" [invalid]="isInvalid()" [disabled]="isDisabled()" /> '
})
class TestHostComponent {
  isInvalid = signal(false);
  isDisabled = signal(false);
}

describe('GpInputTextDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should apply gp-inputtext and size classes', () => {
    const inputEl = fixture.nativeElement.querySelector('input');
    expect(inputEl.classList.contains('gp-inputtext')).toBeTrue();
    expect(inputEl.classList.contains('gp-inputtext-sm')).toBeTrue();
  });

  it('should apply invalid and disabled classes when signals update', () => {
    hostComponent.isInvalid.set(true);
    hostComponent.isDisabled.set(true);
    fixture.detectChanges();

    const inputEl = fixture.nativeElement.querySelector('input');
    expect(inputEl.classList.contains('gp-input-invalid')).toBeTrue();
    expect(inputEl.classList.contains('gp-input-disabled')).toBeTrue();
  });
});
