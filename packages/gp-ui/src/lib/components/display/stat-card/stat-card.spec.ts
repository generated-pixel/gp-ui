import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpStatCard } from './stat-card';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [GpStatCard],
  template: `
    <gp-stat-card
      title="Active Users"
      value="12,450"
      prefix="$"
      [trend]="{ value: '14%', direction: 'up', isPositive: true }"
    />
  `
})
class TestHostComponent {}

describe('GpStatCard', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, GpStatCard]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should render stat card with title, value, and trend', () => {
    const cardEl = fixture.nativeElement.querySelector('.gp-stat-card');
    expect(cardEl).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Active Users');
    expect(fixture.nativeElement.textContent).toContain('12,450');
    expect(fixture.nativeElement.textContent).toContain('14%');
  });
});
