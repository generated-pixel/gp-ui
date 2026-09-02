import { GpBase } from '../../../base/gp-base';
import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  computed,
  effect,
  inject
} from '@angular/core';

import { GpIcon } from '../../../icons/icon';
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
  imports: [GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './paginator.html',
  styleUrl: './paginator.scss'
})
export class GpPaginator extends GpBase {
  public totalRecords = input<number>(0);
  public rows = input<number>(10);
  public first = input<number>(0);
  public pageLinkSize = input<number>(5);
  public rowsPerPageOptions = input<number[]>([]);
  public showCurrentPageReport = input<boolean>(true);

  public onPageChange = output<GpPageState>();

  protected internalFirst = signal<number>(0);
  protected internalRows = signal<number>(10);

  constructor() {
    super();
    effect(() => {
      this.internalFirst.set(this.first());
    });
    effect(() => {
      this.internalRows.set(this.rows());
    });
  }

  protected pageCount = computed(() => {
    const total = this.totalRecords();
    const r = this.internalRows() || 1;
    return Math.max(1, Math.ceil(total / r));
  });

  protected page = computed(() => {
    const f = this.internalFirst();
    const r = this.internalRows() || 1;
    return Math.max(0, Math.floor(f / r));
  });

  protected isFirstPage = computed(() => this.page() <= 0);
  protected isLastPage = computed(() => this.page() >= this.pageCount() - 1);

  protected pageReport = computed(() => {
    const total = this.totalRecords();
    const f = this.internalFirst();
    const r = this.internalRows();
    const firstRec = total === 0 ? 0 : f + 1;
    const lastRec = Math.min(f + r, total);
    const template =
      this.translationService.get('pagination')?.pageReport || 'Showing {first} to {last} of {totalRecords} entries';
    return template
      .replace('{first}', String(firstRec))
      .replace('{last}', String(lastRec))
      .replace('{totalRecords}', String(total));
  });

  protected visiblePages = computed<number[]>(() => {
    const count = this.pageCount();
    const current = this.page();
    const size = Math.min(this.pageLinkSize(), count);

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
    if (targetPage === this.page()) {
      return;
    }

    const r = this.internalRows();
    const nextFirst = targetPage * r;
    this.internalFirst.set(nextFirst);

    this.onPageChange.emit({
      first: nextFirst,
      rows: r,
      page: targetPage,
      pageCount: this.pageCount()
    });
  }

  public onRppChange(event: Event): void {
    const newRows = parseInt((event.target as HTMLSelectElement).value, 10);
    this.internalRows.set(newRows);
    this.internalFirst.set(0);
    this.onPageChange.emit({
      first: 0,
      rows: newRows,
      page: 0,
      pageCount: this.pageCount()
    });
  }
}
