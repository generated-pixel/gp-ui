import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpButtonGroup } from './button-group';
import { Component, signal } from '@angular/core';
import { GpButton } from '../button/button';

@Component({
  standalone: true,
  imports: [GpButtonGroup, GpButton],
  template: `
    <gp-button-group [vertical]="isVertical()">
      <gp-button label="One" />
      <gp-button label="Two" />
      <gp-button label="Three" />
    </gp-button-group>
  `
})
class TestHostComponent {
  isVertical = signal(false);
}

describe('GpButtonGroup', () => {
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

  it('should create and render button group container', () => {
    const groupEl = fixture.nativeElement.querySelector('.gp-button-group');
    expect(groupEl).toBeTruthy();
    expect(groupEl.getAttribute('role')).toBe('group');
  });

  it('should apply vertical class when vertical is true', () => {
    hostComponent.isVertical.set(true);
    fixture.detectChanges();

    const groupEl = fixture.nativeElement.querySelector('.gp-button-group');
    expect(groupEl.classList.contains('gp-button-group--vertical')).toBe(true);
  });
});
