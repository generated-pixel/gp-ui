import { GpEditableBaseComponent } from '../../base/gp-editable-base.component';
import { Component, Input, ContentChild, TemplateRef, ChangeDetectionStrategy, ViewEncapsulation, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';

@Component({
  selector: 'gp-carousel',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class GpCarouselComponent extends GpEditableBaseComponent implements OnInit, OnDestroy {
  @Input() override value: any[] = [];
  @Input() circular = true;
  @Input() autoplayInterval = 0;
  @Input() showIndicators = true;

  @ContentChild('item') itemTemplate?: TemplateRef<any>;

  protected activeIndex = signal<number>(0);
  private intervalId?: any;

  ngOnInit(): void {
    if (this.autoplayInterval > 0) {
      this.intervalId = setInterval(() => this.next(), this.autoplayInterval);
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  public next(): void {
    const total = this.value ? this.value.length : 0;
    if (total === 0) return;
    const current = this.activeIndex();
    if (current < total - 1) {
      this.activeIndex.set(current + 1);
    } else if (this.circular) {
      this.activeIndex.set(0);
    }
  }

  public prev(): void {
    const total = this.value ? this.value.length : 0;
    if (total === 0) return;
    const current = this.activeIndex();
    if (current > 0) {
      this.activeIndex.set(current - 1);
    } else if (this.circular) {
      this.activeIndex.set(total - 1);
    }
  }

  public selectSlide(index: number): void {
    this.activeIndex.set(index);
  }
}
