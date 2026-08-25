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
  template: `
    <div class="gp-paginator" role="navigation" aria-label="Pagination">
      @if (showCurrentPageReport) {
        <span class="gp-paginator-report">{{ pageReport() }}</span>
      }

      <button
        type="button"
        class="gp-paginator-btn"
        [disabled]="isFirstPage()"
        (click)="changePage(0)"
        [attr.aria-label]="translationService.get('pagination')?.firstPage || 'First Page'"
      >
        <gp-icon name="angle-double-left" size="0.85em" />
      </button>

      <button
        type="button"
        class="gp-paginator-btn"
        [disabled]="isFirstPage()"
        (click)="changePage(page() - 1)"
        [attr.aria-label]="translationService.get('pagination')?.prevPage || 'Previous Page'"
      >
        <gp-icon name="chevron-left" size="0.85em" />
      </button>

      <div class="gp-paginator-pages">
        @for (p of visiblePages(); track p) {
          <button
            type="button"
            class="gp-paginator-page"
            [class.gp-paginator-page-active]="p === page()"
            (click)="changePage(p)"
            [attr.aria-current]="p === page() ? 'page' : null"
          >
            {{ p + 1 }}
          </button>
        }
      </div>

      <button
        type="button"
        class="gp-paginator-btn"
        [disabled]="isLastPage()"
        (click)="changePage(page() + 1)"
        [attr.aria-label]="translationService.get('pagination')?.nextPage || 'Next Page'"
      >
        <gp-icon name="chevron-right" size="0.85em" />
      </button>

      <button
        type="button"
        class="gp-paginator-btn"
        [disabled]="isLastPage()"
        (click)="changePage(pageCount() - 1)"
        [attr.aria-label]="translationService.get('pagination')?.lastPage || 'Last Page'"
      >
        <gp-icon name="angle-double-right" size="0.85em" />
      </button>

      @if (rowsPerPageOptions && rowsPerPageOptions.length > 0) {
        <div class="gp-paginator-rpp">
          <select
            [value]="rows"
            (change)="onRppChange($event)"
            class="gp-paginator-rpp-select"
            aria-label="Rows per page"
          >
            @for (opt of rowsPerPageOptions; track opt) {
              <option [value]="opt">{{ opt }} / page</option>
            }
          </select>
        </div>
      }
    </div>
  `,
  styles: [`
    .gp-paginator {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      gap: 0.35rem;
      padding: 0.5rem 1rem;
      background: var(--gp-surface-card);
      border-top: 1px solid var(--gp-surface-border);
      color: var(--gp-text-color-secondary);
      font-size: var(--gp-font-size-sm);
    }
    .gp-paginator-btn, .gp-paginator-page {
      min-width: 2.25rem;
      height: 2.25rem;
      padding: 0 0.5rem;
      border: 1px solid transparent;
      border-radius: var(--gp-border-radius);
      background: transparent;
      color: var(--gp-text-color);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: inherit;
      font-size: var(--gp-font-size-sm);
      transition: all var(--gp-transition-duration);
    }
    .gp-paginator-btn:hover:not(:disabled), .gp-paginator-page:hover {
      background: var(--gp-surface-hover);
    }
    .gp-paginator-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .gp-paginator-page-active {
      background: var(--gp-primary-light) !important;
      color: var(--gp-primary) !important;
      font-weight: 700;
      border-color: var(--gp-primary-border);
    }
    .gp-paginator-pages {
      display: inline-flex;
      gap: 0.25rem;
    }
    .gp-paginator-report {
      margin-right: auto;
      font-size: var(--gp-font-size-xs);
    }
    .gp-paginator-rpp-select {
      background: var(--gp-input-bg);
      border: 1px solid var(--gp-input-border);
      border-radius: var(--gp-border-radius);
      padding: 0.25rem 0.5rem;
      color: var(--gp-text-color);
      font-size: var(--gp-font-size-xs);
      outline: none;
    }
  `]
})
export class GpPaginatorComponent {
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
