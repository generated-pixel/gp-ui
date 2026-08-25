import { Component, Input, ContentChild, TemplateRef, ChangeDetectionStrategy, ViewEncapsulation, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';

@Component({
  selector: 'gp-carousel',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="gp-carousel" role="region" aria-roledescription="carousel">
      <div class="gp-carousel-content">
        <button
          type="button"
          class="gp-carousel-nav-btn gp-carousel-prev"
          (click)="prev()"
          [disabled]="circular ? false : activeIndex() === 0"
          aria-label="Previous slide"
        >
          <gp-icon name="chevron-left" size="1.2em" />
        </button>

        <div class="gp-carousel-items-container">
          <div
            class="gp-carousel-items-slider"
            [style.transform]="'translateX(-' + (activeIndex() * 100) + '%)'"
          >
            @for (item of value; track $index) {
              <div class="gp-carousel-item" role="group" [attr.aria-label]="'Slide ' + ($index + 1)">
                <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }" />
              </div>
            }
          </div>
        </div>

        <button
          type="button"
          class="gp-carousel-nav-btn gp-carousel-next"
          (click)="next()"
          [disabled]="circular ? false : activeIndex() >= (value.length - 1)"
          aria-label="Next slide"
        >
          <gp-icon name="chevron-right" size="1.2em" />
        </button>
      </div>

      @if (showIndicators && value.length > 1) {
        <div class="gp-carousel-indicators">
          @for (item of value; track $index) {
            <button
              type="button"
              class="gp-carousel-indicator"
              [class.gp-carousel-indicator-active]="activeIndex() === $index"
              (click)="selectSlide($index)"
              [attr.aria-label]="'Go to slide ' + ($index + 1)"
            ></button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .gp-carousel {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    .gp-carousel-content {
      display: flex;
      align-items: center;
      position: relative;
    }
    .gp-carousel-items-container {
      overflow: hidden;
      width: 100%;
    }
    .gp-carousel-items-slider {
      display: flex;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      width: 100%;
    }
    .gp-carousel-item {
      flex: 0 0 100%;
      box-sizing: border-box;
      padding: 0.5rem;
    }
    .gp-carousel-nav-btn {
      background: var(--gp-surface-card);
      border: 1px solid var(--gp-surface-border);
      color: var(--gp-text-color-secondary);
      border-radius: 50%;
      width: 2.5rem;
      height: 2.5rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: var(--gp-shadow-md);
      z-index: 2;
      transition: all var(--gp-transition-duration);
    }
    .gp-carousel-nav-btn:hover:not(:disabled) {
      background: var(--gp-surface-hover);
      color: var(--gp-primary);
    }
    .gp-carousel-nav-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .gp-carousel-indicators {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem 0;
    }
    .gp-carousel-indicator {
      width: 0.65rem;
      height: 0.65rem;
      border-radius: 50%;
      border: none;
      background: var(--gp-surface-border);
      cursor: pointer;
      transition: all var(--gp-transition-duration);
      padding: 0;
    }
    .gp-carousel-indicator:hover {
      background: var(--gp-input-border-hover);
    }
    .gp-carousel-indicator-active {
      background: var(--gp-primary);
      width: 1.5rem;
      border-radius: var(--gp-border-radius-full);
    }
  `]
})
export class GpCarouselComponent implements OnInit, OnDestroy {
  @Input() value: any[] = [];
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
