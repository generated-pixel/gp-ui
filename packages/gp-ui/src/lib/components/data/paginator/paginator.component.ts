import { GpBaseComponent } from '../../../base/gp-base.component';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  computed,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpTranslationService } from '../../../config/gp-config.service';

export interface GpPageState {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

@Component({
  selector: 'gp-paginator',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class GpPaginatorComponent extends GpBaseComponent {
  protected translationService = inject(GpTranslationService);

  private _totalRecords = signal<number>(0);
  private _rows = signal<number>(10);
  private _first = signal<number>(0);
  private _pageLinkSize = signal<number>(5);

  @Input()
  public set totalRecords(val: number) {
    this._totalRecords.set(Number(val) || 0);
  }
  public get totalRecords(): number {
    return this._totalRecords();
  }

  @Input()
  public set rows(val: number) {
    this._rows.set(Number(val) || 10);
  }
  public get rows(): number {
    return this._rows();
  }

  @Input()
  public set first(val: number) {
    this._first.set(Number(val) || 0);
  }
  public get first(): number {
    return this._first();
  }

  @Input()
  public set pageLinkSize(val: number) {
    this._pageLinkSize.set(Number(val) || 5);
  }
  public get pageLinkSize(): number {
    return this._pageLinkSize();
  }

  @Input() rowsPerPageOptions: number[] = [];
  @Input() showCurrentPageReport = true;

  @Output() onPageChange = new EventEmitter<GpPageState>();

  protected pageCount = computed(() => {
    const total = this._totalRecords();
    const r = this._rows() || 1;
    return Math.max(1, Math.ceil(total / r));
  });

  protected page = computed(() => {
    const f = this._first();
    const r = this._rows() || 1;
    return Math.max(0, Math.floor(f / r));
  });

  protected isFirstPage = computed(() => this.page() <= 0);
  protected isLastPage = computed(() => this.page() >= this.pageCount() - 1);

  protected pageReport = computed(() => {
    const total = this._totalRecords();
    const f = this._first();
    const r = this._rows();
    const firstRec = total === 0 ? 0 : f + 1;
    const lastRec = Math.min(f + r, total);
    const template =
      this.translationService.get('pagination')?.pageReport ||
      'Showing {first} to {last} of {totalRecords} entries';
    return template
      .replace('{first}', String(firstRec))
      .replace('{last}', String(lastRec))
      .replace('{totalRecords}', String(total));
  });

  protected visiblePages = computed<number[]>(() => {
    const count = this.pageCount();
    const current = this.page();
    const size = Math.min(this._pageLinkSize(), count);

    let start = Math.max(0, current - Math.floor(size / 2));
    let end = start + size - 1;

    if (end >= count) {
      end = count - 1;
      start = Math.max(0, end - size + 1);
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  });

  public changePage(p: number): void {
    const maxPage = this.pageCount() - 1;
    const targetPage = Math.max(0, Math.min(p, maxPage));
    if (targetPage === this.page()) return;

    const r = this._rows();
    const nextFirst = targetPage * r;
    this._first.set(nextFirst);

    this.onPageChange.emit({
      first: nextFirst,
      rows: r,
      page: targetPage,
      pageCount: this.pageCount()
    });
  }

  public onRppChange(event: Event): void {
    const newRows = parseInt((event.target as HTMLSelectElement).value, 10);
    this._rows.set(newRows);
    this._first.set(0);
    this.onPageChange.emit({
      first: 0,
      rows: newRows,
      page: 0,
      pageCount: this.pageCount()
    });
  }
}
