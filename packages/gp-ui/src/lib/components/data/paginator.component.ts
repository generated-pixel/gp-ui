import { GpBaseComponent } from '../../base/gp-base.component';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';
import { GpTranslationService } from '../../config/gp-config.service';

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

  @Input() totalRecords = 0;
  @Input() rows = 10;
  @Input() first = 0;
  @Input() pageLinkSize = 5;
  @Input() rowsPerPageOptions: number[] = [];
  @Input() showCurrentPageReport = true;

  @Output() onPageChange = new EventEmitter<GpPageState>();

  protected pageCount = computed(() => Math.ceil(this.totalRecords / (this.rows || 1)) || 1);
  protected page = computed(() => Math.floor(this.first / (this.rows || 1)));

  protected isFirstPage = computed(() => this.page() === 0);
  protected isLastPage = computed(() => this.page() >= this.pageCount() - 1);

  protected pageReport = computed(() => {
    const firstRec = this.totalRecords === 0 ? 0 : this.first + 1;
    const lastRec = Math.min(this.first + this.rows, this.totalRecords);
    const template = this.translationService.get('pagination')?.pageReport || 'Showing {first} to {last} of {totalRecords} entries';
    return template
      .replace('{first}', String(firstRec))
      .replace('{last}', String(lastRec))
      .replace('{totalRecords}', String(this.totalRecords));
  });

  protected visiblePages = computed<number[]>(() => {
    const count = this.pageCount();
    const current = this.page();
    const size = Math.min(this.pageLinkSize, count);

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
    if (p < 0 || p >= this.pageCount() || p === this.page()) return;
    const nextFirst = p * this.rows;
    this.first = nextFirst;
    this.onPageChange.emit({
      first: nextFirst,
      rows: this.rows,
      page: p,
      pageCount: this.pageCount()
    });
  }

  public onRppChange(event: Event): void {
    const newRows = parseInt((event.target as HTMLSelectElement).value, 10);
    this.rows = newRows;
    this.first = 0;
    this.onPageChange.emit({
      first: 0,
      rows: newRows,
      page: 0,
      pageCount: this.pageCount()
    });
  }
}
