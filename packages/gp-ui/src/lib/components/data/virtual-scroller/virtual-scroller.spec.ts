import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpVirtualScroller } from './virtual-scroller';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [GpVirtualScroller],
  template: `
    <gp-virtual-scroller [items]="items" [itemSize]="50" scrollHeight="200px">
      <ng-template #item let-row>
        <div class="test-row">{{ row.name }}</div>
      </ng-template>
    </gp-virtual-scroller>
  `
})
class TestHostComponent {
  items = Array.from({ length: 500 }, (_, i) => ({ id: i, name: `Row #${i + 1}` }));
}

describe('GpVirtualScroller', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, GpVirtualScroller]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should render virtual scroller with spacer and slice of visible items', () => {
    const scroller = fixture.nativeElement.querySelector('.gp-virtual-scroller');
    const spacer = fixture.nativeElement.querySelector('.gp-virtual-scroller-spacer');
    const items = fixture.nativeElement.querySelectorAll('.test-row');

    expect(scroller).toBeTruthy();
    expect(spacer).toBeTruthy();
    expect(spacer.style.height).toBe('25000px'); // 500 * 50px
    expect(items.length).toBeGreaterThan(0);
    expect(items.length).toBeLessThan(500); // DOM virtualization is active
  });
});
