import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpTimeline, GpTimelineEvent } from './timeline';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [GpTimeline],
  template: `
    <gp-timeline [value]="events" layout="vertical" align="alternate" />
  `
})
class TestHostComponent {
  events: GpTimelineEvent[] = [
    { status: 'Ordered', date: '15/10/2026', icon: 'check' },
    { status: 'Delivered', date: '17/10/2026', icon: 'check-circle' }
  ];
}

describe('GpTimeline', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, GpTimeline]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should render timeline events and markers', () => {
    const timeline = fixture.nativeElement.querySelector('.gp-timeline');
    expect(timeline).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Ordered');
    expect(fixture.nativeElement.textContent).toContain('Delivered');
  });
});
