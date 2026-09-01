import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  output,
  computed,
  signal,
  Signal
} from '@angular/core';

import {
  GpAvatarComponent,
  GpBadgeComponent,
  GpButtonComponent,
  GpIconComponent,
  GpBadgeSeverity,
  GpSkeletonComponent
} from '@generatedpixel/gp-ui';
import { GpTableWidgetData, GpGridTableColumn, GpGridTableRow } from '../../models/grid-widget.model';
import { normalizeTableWidgetData } from '../../services/widget-data-resolver';
import { GpGridWidgetBase } from '../../base/gp-grid-widget.base';

@Component({
  selector: 'gp-grid-table-widget',
  standalone: true,
  imports: [GpAvatarComponent, GpBadgeComponent, GpButtonComponent, GpIconComponent, GpSkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './grid-table-widget.component.html',
  styleUrl: './grid-table-widget.component.scss',
  host: {
    class: 'gp-grid-table-widget-host'
  }
})
export class GpGridTableWidgetComponent extends GpGridWidgetBase<GpTableWidgetData> {
  public title = input<string>('');
  public columns = input<GpGridTableColumn[]>([]);
  public rows = input<Record<string, any>[]>([]);
  public exportBtnLabel = input<string>('Export');
  public filterable = input<boolean>(false);
  public filterPlaceholder = input<string>('Filter rows...');

  public rowClick = output<Record<string, any>>();
  public exportClick = output<void>();

  public filterQuery = signal<string>('');

  public override normalizedData: Signal<GpTableWidgetData> = computed(() => {
    return normalizeTableWidgetData(this.rawData());
  });

  public effectiveTitle = computed(
    () => this.title() || this.normalizedData().title || this.item()?.title || 'Data Records'
  );

  public effectiveColumns = computed<GpGridTableColumn[]>(() => {
    if (this.columns() && this.columns().length > 0) return this.columns();
    if (this.normalizedData().columns && this.normalizedData().columns!.length > 0) {
      return this.normalizedData().columns!;
    }
    return [
      { field: 'name', header: 'Name', type: 'avatar' },
      { field: 'category', header: 'Category', type: 'text' },
      { field: 'value', header: 'Value', type: 'currency' },
      { field: 'status', header: 'Status', type: 'badge' }
    ];
  });

  public effectiveRows = computed<Record<string, any>[]>(() => {
    let list: Record<string, any>[] = [];
    if (this.rows() && this.rows().length > 0) {
      list = this.rows();
    } else if (this.normalizedData().rows && this.normalizedData().rows!.length > 0) {
      list = this.normalizedData().rows!;
    }

    const q = this.filterQuery().trim().toLowerCase();
    if (!q) return list;

    return list.filter((row) => {
      return Object.values(row).some((val) =>
        String(val ?? '')
          .toLowerCase()
          .includes(q)
      );
    });
  });

  public getBadgeSeverity(row: Record<string, any>, col: GpGridTableColumn): GpBadgeSeverity {
    if (col.badgeSeverityField && row[col.badgeSeverityField]) {
      return row[col.badgeSeverityField] as GpBadgeSeverity;
    }
    if (col.badgeSeverity) return col.badgeSeverity;
    const val = String(row[col.field] || '').toLowerCase();
    if (val.includes('active') || val.includes('completed') || val.includes('paid') || val.includes('success'))
      return 'success';
    if (val.includes('pending') || val.includes('processing') || val.includes('warning')) return 'warning';
    if (val.includes('danger') || val.includes('failed') || val.includes('error')) return 'danger';
    return 'primary';
  }

  public onRowClicked(row: GpGridTableRow, event?: Event): void {
    const navLink = row.routerLink || (row['routerLinkField'] ? row[row['routerLinkField']] : undefined);
    if (navLink) {
      const navConfig = {
        routerLink: navLink,
        queryParams: row.queryParams
      };
      this.executeNavigation(navConfig, event);
    }

    if (this.normalizedData().onRowClick) {
      this.normalizedData().onRowClick!(row);
    }

    this.rowClick.emit(row);
  }
}
