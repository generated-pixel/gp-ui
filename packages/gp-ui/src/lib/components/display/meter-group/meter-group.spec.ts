import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpMeterGroup, GpMeterItem } from './meter-group';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [GpMeterGroup],
  template: `
    <gp-meter-group [value]="meters" [max]="100" />
  `
})
class TestHostComponent {
  meters: GpMeterItem[] = [
    { label: 'Storage', value: 40, color: '#6366f1' },
    { label: 'Bandwidth', value: 30, color: '#10b981' }
  ];
}

describe('GpMeterGroup', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, GpMeterGroup]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should render meter bars and labels', () => {
    const groupEl = fixture.nativeElement.querySelector('.gp-metergroup');
    expect(groupEl).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Storage');
    expect(fixture.nativeElement.textContent).toContain('Bandwidth');
  });
});
