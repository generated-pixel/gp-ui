import { Component, ChangeDetectionStrategy, ViewEncapsulation, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpAvatarComponent, GpBadgeComponent, GpButtonComponent, GpIconComponent, GpBadgeSeverity } from '@generatedpixel/gp-ui';
import { GpTableWidgetData, GpGridTableColumn } from '../../models/grid-widget.model';
import { GpGridItem } from '../../models/grid-item.model';

@Component({
  selector: 'gp-grid-table-widget',
  standalone: true,
  imports: [CommonModule, GpAvatarComponent, GpBadgeComponent, GpButtonComponent, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './grid-table-widget.component.html',
  styleUrl: './grid-table-widget.component.scss',
  host: {
    class: 'gp-grid-table-widget-host'
  }
})
export class GpGridTableWidgetComponent {
  public data = input<GpTableWidgetData | undefined>(undefined);
  public item = input<GpGridItem | undefined>(undefined);
  public title = input<string>('');
  public columns = input<GpGridTableColumn[]>([]);
  public rows = input<Record<string, any>[]>([]);
  public exportBtnLabel = input<string>('Export');

  public rowClick = output<Record<string, any>>();
  public exportClick = output<void>();

  public effectiveTitle = computed(() => this.title() || this.data()?.title || this.item()?.title || 'Data Records');
  public effectiveColumns = computed<GpGridTableColumn[]>(() => {
    if (this.columns() && this.columns().length > 0) return this.columns();
    if (this.data()?.columns && this.data()!.columns.length > 0) return this.data()!.columns;
    return [
      { field: 'name', header: 'Name', type: 'avatar' },
      { field: 'category', header: 'Category', type: 'text' },
      { field: 'value', header: 'Value', type: 'currency' },
      { field: 'status', header: 'Status', type: 'badge' }
    ];
  });
  public effectiveRows = computed<Record<string, any>[]>(() => {
    if (this.rows() && this.rows().length > 0) return this.rows();
    if (this.data()?.rows && this.data()!.rows.length > 0) return this.data()!.rows;
    return [];
  });

  public getBadgeSeverity(row: Record<string, any>, col: GpGridTableColumn): GpBadgeSeverity {
    if (col.badgeSeverityField && row[col.badgeSeverityField]) {
      return row[col.badgeSeverityField] as GpBadgeSeverity;
    }
    if (col.badgeSeverity) return col.badgeSeverity;
    const val = String(row[col.field] || '').toLowerCase();
    if (val.includes('active') || val.includes('completed') || val.includes('paid') || val.includes('success')) return 'success';
    if (val.includes('pending') || val.includes('processing') || val.includes('warning')) return 'warning';
    if (val.includes('danger') || val.includes('failed') || val.includes('error')) return 'danger';
    return 'primary';
  }
}
