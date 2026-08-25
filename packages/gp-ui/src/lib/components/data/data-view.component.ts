import { Component, Input, ContentChild, TemplateRef, ChangeDetectionStrategy, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';
import { GpPaginatorComponent, GpPageState } from './paginator.component';

export type GpDataViewLayout = 'list' | 'grid';

@Component({
  selector: 'gp-data-view',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpPaginatorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="gp-dataview" [class.gp-dataview-list]="layout === 'list'" [class.gp-dataview-grid]="layout === 'grid'">
      @if (headerTemplate || layoutOptions) {
        <div class="gp-dataview-header">
          <div class="gp-dataview-header-content">
            <ng-content select="[header]" />
          </div>

          @if (layoutOptions) {
            <div class="gp-dataview-layout-options">
              <button
                type="button"
                class="gp-dataview-layout-btn"
                [class.gp-dataview-layout-btn-active]="layout === 'list'"
                (click)="setLayout('list')"
                aria-label="List view"
              >
                <gp-icon name="bars" size="0.9em" />
              </button>
              <button
                type="button"
                class="gp-dataview-layout-btn"
                [class.gp-dataview-layout-btn-active]="layout === 'grid'"
                (click)="setLayout('grid')"
                aria-label="Grid view"
              >
                <gp-icon name="window" size="0.9em" />
              </button>
            </div>
          }
        </div>
      }

      <div class="gp-dataview-content">
        @if (layout === 'list') {
          <div class="gp-dataview-list-grid">
            @for (item of displayedValue(); track $index) {
              <div class="gp-dataview-list-item">
                <ng-container *ngTemplateOutlet="listItemTemplate || itemTemplate; context: { $implicit: item }" />
              </div>
            }
          </div>
        } @else {
          <div class="gp-dataview-grid-grid">
            @for (item of displayedValue(); track $index) {
              <div class="gp-dataview-grid-item">
                <ng-container *ngTemplateOutlet="gridItemTemplate || itemTemplate; context: { $implicit: item }" />
              </div>
            }
          </div>
        }
      </div>

      @if (paginator) {
        <gp-paginator
          [totalRecords]="value.length"
          [rows]="rows"
          [first]="first()"
          (onPageChange)="onPaginationChange($event)"
        />
      }
    </div>
  `,
  styles: [`
    .gp-dataview {
      background: var(--gp-surface-card);
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .gp-dataview-header {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--gp-surface-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .gp-dataview-layout-options {
      display: inline-flex;
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius);
      overflow: hidden;
    }
    .gp-dataview-layout-btn {
      background: var(--gp-surface-card);
      border: none;
      padding: 0.4rem 0.65rem;
      cursor: pointer;
      color: var(--gp-text-color-secondary);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all var(--gp-transition-duration);
    }
    .gp-dataview-layout-btn:hover {
      background: var(--gp-surface-hover);
    }
    .gp-dataview-layout-btn-active {
      background: var(--gp-primary-light) !important;
      color: var(--gp-primary) !important;
    }
    .gp-dataview-content {
      padding: 1rem;
    }
    .gp-dataview-list-grid {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .gp-dataview-grid-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
      gap: 1rem;
    }
  `]
})
export class GpDataViewComponent {
  @Input() value: any[] = [];
  @Input() layout: GpDataViewLayout = 'list';
  @Input() layoutOptions = true;
  @Input() paginator = false;
  @Input() rows = 6;

  @ContentChild('header') headerTemplate?: TemplateRef<any>;
  @ContentChild('item') itemTemplate?: TemplateRef<any>;
  @ContentChild('listitem') listItemTemplate?: TemplateRef<any>;
  @ContentChild('griditem') gridItemTemplate?: TemplateRef<any>;

  protected first = signal<number>(0);

  public setLayout(l: GpDataViewLayout): void {
    this.layout = l;
  }

  public displayedValue = () => {
    if (!this.paginator) return this.value;
    const start = this.first();
    return this.value.slice(start, start + this.rows);
  };

  public onPaginationChange(state: GpPageState): void {
    this.first.set(state.first);
    this.rows = state.rows;
  }
}
