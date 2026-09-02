import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpFieldset } from './fieldset';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [GpFieldset],
  template: `
    <gp-fieldset legend="User Information" [toggleable]="true">
      <p>Fieldset body content</p>
    </gp-fieldset>
  `
})
class TestHostComponent {}

describe('GpFieldset', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, GpFieldset]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should render fieldset with legend and content', () => {
    const fieldset = fixture.nativeElement.querySelector('.gp-fieldset');
    expect(fieldset).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('User Information');
    expect(fixture.nativeElement.textContent).toContain('Fieldset body content');
  });
});
