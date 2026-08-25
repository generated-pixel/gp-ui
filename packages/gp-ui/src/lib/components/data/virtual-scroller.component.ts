import { Component, Input, ContentChild, TemplateRef, ChangeDetectionStrategy, ViewEncapsulation, signal, computed, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gp-virtual-scroller',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      class="gp-virtual-scroller"
      [style.height]="scrollHeight"
      (scroll)="onScroll($event)"
      tabindex="0"
    >
      <div class="gp-virtual-scroller-spacer" [style.height.px]="totalHeight()"></div>
      <div class="gp-virtual-scroller-content" [style.transform]="'translateY(' + offsetY() + 'px)'">
        @for (item of visibleItems(); track $index) {
          <div class="gp-virtual-scroller-item" [style.height.px]="itemSize">
            <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item }" />
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .gp-virtual-scroller {
      position: relative;
      overflow-y: auto;
      background: var(--gp-surface-card);
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius);
    }
    .gp-virtual-scroller-spacer {
      width: 100%;
    }
    .gp-virtual-scroller-content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
    }
  `]
})
export class GpVirtualScrollerComponent {
  @Input() items: any[] = [];
  @Input() itemSize = 48;
  @Input() scrollHeight = '20rem';
  @Input() buffer = 5;

  @ContentChild('item') itemTemplate?: TemplateRef<any>;

  protected scrollTop = signal<number>(0);
  protected viewportHeight = signal<number>(320);

  protected totalHeight = computed(() => (this.items ? this.items.length * this.itemSize : 0));

  protected startIndex = computed(() => {
    const top = this.scrollTop();
    const idx = Math.floor(top / this.itemSize) - this.buffer;
    return Math.max(0, idx);
  });

  protected endIndex = computed(() => {
    const top = this.scrollTop();
    const count = Math.ceil(this.viewportHeight() / this.itemSize) + this.buffer * 2;
    const end = this.startIndex() + count;
    return Math.min((this.items || []).length, end);
  });

  protected offsetY = computed(() => this.startIndex() * this.itemSize);

  protected visibleItems = computed(() => {
    const list = this.items || [];
    return list.slice(this.startIndex(), this.endIndex());
  });

  public onScroll(event: Event): void {
    const el = event.target as HTMLElement;
    this.scrollTop.set(el.scrollTop);
    this.viewportHeight.set(el.clientHeight);
  }
}
