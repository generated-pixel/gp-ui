import { GpEditableBaseComponent } from '../../../base/gp-editable-base.component';
import {
  Component,
  input,
  contentChild,
  TemplateRef,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  computed
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
  public items = input<any[]>([]);
  public itemSize = input<number>(48);
  public scrollHeight = input<string>('20rem');
  public buffer = input<number>(5);

  public itemTemplate = contentChild<TemplateRef<any>>('item');

  protected scrollTop = signal<number>(0);
  protected viewportHeight = signal<number>(320);

  protected totalHeight = computed(() => {
    const list = this.items();
    return list ? list.length * this.itemSize() : 0;
  });

  protected startIndex = computed(() => {
    const top = this.scrollTop();
    const size = this.itemSize();
    const buf = this.buffer();
    const idx = Math.floor(top / size) - buf;
    return Math.max(0, idx);
  });

  protected endIndex = computed(() => {
    const size = this.itemSize();
    const buf = this.buffer();
    const count = Math.ceil(this.viewportHeight() / size) + buf * 2;
    const end = this.startIndex() + count;
    return Math.min((this.items() || []).length, end);
  });

  protected offsetY = computed(() => this.startIndex() * this.itemSize());

  protected visibleItems = computed(() => {
    const list = this.items() || [];
    return list.slice(this.startIndex(), this.endIndex());
  });

  public onScroll(event: Event): void {
    const el = event.target as HTMLElement;
    this.scrollTop.set(el.scrollTop);
    this.viewportHeight.set(el.clientHeight);
  }
}
