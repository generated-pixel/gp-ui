import { GpEditableBaseComponent } from '../../../base/gp-editable-base.component';
import {
  Component,
  Input,
  ContentChild,
  TemplateRef,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  computed,
  ElementRef,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gp-virtual-scroller',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './virtual-scroller.component.html',
  styleUrl: './virtual-scroller.component.scss'
})
export class GpVirtualScrollerComponent extends GpEditableBaseComponent {
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
