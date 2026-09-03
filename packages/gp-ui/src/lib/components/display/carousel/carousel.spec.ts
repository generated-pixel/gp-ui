import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpCarousel } from './carousel';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [GpCarousel],
  template: `
    <gp-carousel [value]="slides" [circular]="true">
      <ng-template #item let-slide>
        <div class="test-slide">{{ slide.title }}</div>
      </ng-template>
    </gp-carousel>
  `
})
class TestHostComponent {
  slides = [{ title: 'Slide 1' }, { title: 'Slide 2' }, { title: 'Slide 3' }];
}

describe('GpCarousel', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let carousel: GpCarousel;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, GpCarousel]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    carousel = fixture.debugElement.children[0].componentInstance;
  });

  it('should render carousel with indicators and controls', () => {
    const el = fixture.nativeElement.querySelector('.gp-carousel');
    expect(el).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('.gp-carousel-indicator').length).toBe(3);
  });

  it('should advance slide on next()', () => {
    expect((carousel as any).activeIndex()).toBe(0);
    carousel.next();
    fixture.detectChanges();
    expect((carousel as any).activeIndex()).toBe(1);
  });
});
