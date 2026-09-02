import { GpBase } from '../../../base/gp-base';
import {
  Component,
  input,
  contentChild,
  TemplateRef,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIcon } from '../../../icons/icon';

@Component({
  selector: 'gp-carousel',
  standalone: true,
  imports: [CommonModule, GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './carousel.html',
  styleUrl: './carousel.scss'
})
export class GpCarousel extends GpBase {
  public value = input<any[]>([]);
  public circular = input<boolean>(true);
  public autoplayInterval = input<number>(0);
  public showIndicators = input<boolean>(true);

  public itemTemplate = contentChild<TemplateRef<any>>('item');

  protected activeIndex = signal<number>(0);
  private intervalId?: any;

  override onInit(): void {
    const interval = this.autoplayInterval();
    if (interval > 0) {
      this.intervalId = setInterval(() => this.next(), interval);
    }
  }

  override onDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  public next(): void {
    const val = this.value();
    const total = val ? val.length : 0;
    if (total === 0) {
      return;
    }
    const current = this.activeIndex();
    if (current < total - 1) {
      this.activeIndex.set(current + 1);
    } else if (this.circular()) {
      this.activeIndex.set(0);
    }
  }

  public prev(): void {
    const val = this.value();
    const total = val ? val.length : 0;
    if (total === 0) {
      return;
    }
    const current = this.activeIndex();
    if (current > 0) {
      this.activeIndex.set(current - 1);
    } else if (this.circular()) {
      this.activeIndex.set(total - 1);
    }
  }

  public selectSlide(index: number): void {
    this.activeIndex.set(index);
  }
}
