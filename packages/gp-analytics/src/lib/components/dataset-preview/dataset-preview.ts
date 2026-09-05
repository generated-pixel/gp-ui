import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { GpBadge, GpTag } from '@generatedpixel/gp-ui';
import { GpAnalyticsComponent } from '../base/gp-analytics-component';
import { DatasetField, getDatasetFieldDisplayLabel } from '../../models';

export interface PreviewColumn {
  fieldId: string;
  datasetFieldId: string;
  header: string;
  dataType: string;
  sortable: boolean;
  filterable: boolean;
  aggregationType: string;
  isGrouped?: boolean;
}

export interface RowGroupSection {
  groupKey: string;
  groupValue: string;
  columnHeader: string;
  count: number;
  rows: Record<string, any>[];
}

@Component({
  selector: 'gp-dataset-preview',
  standalone: true,
  templateUrl: './dataset-preview.html',
  styleUrl: './dataset-preview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GpDatasetPreview extends GpAnalyticsComponent {
  /**
   * The list of dataset fields forming the columns of this table preview.
   */
  readonly fields = input<DatasetField[]>([]);

  /**
   * Dataset name displayed on the header.
   */
  readonly datasetName = input<string>('Custom Dataset');

  /**
   * Optional custom/real dataset records. If null, simulated data is rendered.
   */
  readonly customData = input<Record<string, any>[] | null>(null);

  /**
   * Number of preview rows to simulate.
   */
  readonly rowCount = signal<number>(6);

  /**
   * Refresh trigger seed for simulated data.
   */
  protected readonly refreshSeed = signal<number>(0);

  /**
   * Currently sorted column and order (1 = asc, -1 = desc).
   */
  protected readonly sortColumn = signal<string | null>(null);
  protected readonly sortOrder = signal<number>(1);

  /**
   * Toggle for visual grouping of rows by primary grouped dimension.
   */
  readonly showGroupingView = signal<boolean>(true);

  /**
   * Filtered dataset fields ensuring only visible fields are rendered in preview.
   */
  readonly visibleFields = computed<DatasetField[]>(() => {
    return this.fields().filter(
      (f) => f.visible !== false && (f.baseField ? f.baseField.visible !== false : true),
    );
  });

  /**
   * Computed columns for the table.
   */
  readonly columns = computed<PreviewColumn[]>(() => {
    const locale = this.i18n.locale();
    return this.visibleFields().map((f) => ({
      fieldId: f.fieldId,
      datasetFieldId: f.datasetFieldId,
      header: getDatasetFieldDisplayLabel(f, locale),
      dataType: f.dataType,
      sortable: f.sortable,
      filterable: f.filterable,
      aggregationType: f.aggregationType,
      isGrouped: f.isGrouped,
    }));
  });

  /**
   * Primary grouped dimension column.
   * Automagically returns the first column explicitly marked with isGrouped: true,
   * or null if nothing is selected for grouping.
   */
  readonly primaryGroupColumn = computed<PreviewColumn | null>(() => {
    const cols = this.columns();
    return cols.find((c) => Boolean(c.isGrouped)) ?? null;
  });

  /**
   * Automagically indicates if grouping by dimension is active:
   * True if something is selected for grouping, false if nothing is selected.
   */
  readonly hasActiveGrouping = computed<boolean>(() => {
    return Boolean(this.primaryGroupColumn());
  });

  /**
   * Computed rows: uses customData if provided, otherwise generates realistic clustered simulated rows.
   */
  readonly rows = computed<Record<string, any>[]>(() => {
    // Read seed for reactivity
    const _seed = this.refreshSeed();
    const provided = this.customData();
    if (provided && provided.length > 0) {
      return this.applySorting(provided);
    }

    const currentFields = this.visibleFields();
    if (currentFields.length === 0) {
      return [];
    }

    const count = this.rowCount();
    const simulated: Record<string, any>[] = [];

    const mockCustomerProfiles = [
      { name: 'Northwind Trading', city: 'London', code: 'CUST-LON-01' },
      { name: 'Acme Industrial Corp', city: 'New York', code: 'CUST-NYC-02' },
      { name: 'Starlight Solutions', city: 'Paris', code: 'CUST-PAR-03' },
      { name: 'Helios Technologies', city: 'Berlin', code: 'CUST-BER-04' },
      { name: 'Apex Logistics', city: 'Tokyo', code: 'CUST-TYO-05' },
      { name: 'Vanguard Retail', city: 'Toronto', code: 'CUST-TOR-06' },
      { name: 'Summit Holdings', city: 'Zurich', code: 'CUST-ZUR-07' },
    ];

    const clusterSizes = [2, 2, 3, 2, 3, 2, 3];

    for (let i = 0; i < count; i++) {
      let remaining = i;
      let pIdx = 0;
      while (remaining >= clusterSizes[pIdx % clusterSizes.length]) {
        remaining -= clusterSizes[pIdx % clusterSizes.length];
        pIdx++;
      }
      const profile = mockCustomerProfiles[pIdx % mockCustomerProfiles.length];
      const subOrderIdx = remaining;

      const row: Record<string, any> = { _id: `row-${i + 1}`, _groupKey: profile.name };

      for (const f of currentFields) {
        row[f.datasetFieldId] = this.generateSampleValue(f, i, profile, subOrderIdx, pIdx);
      }

      simulated.push(row);
    }

    return this.applySorting(simulated);
  });

  /**
   * Groups rows into sections based on the primary grouped column.
   */
  readonly groupedRowSections = computed<RowGroupSection[]>(() => {
    const allRows = this.rows();
    const primaryCol = this.primaryGroupColumn();

    // Automagic: if nothing is selected for grouping, show flat table
    if (!this.hasActiveGrouping() || !primaryCol || allRows.length === 0) {
      return [
        {
          groupKey: 'all',
          groupValue: '',
          columnHeader: '',
          count: allRows.length,
          rows: allRows,
        },
      ];
    }

    const map = new Map<string, Record<string, any>[]>();
    for (const row of allRows) {
      const val = String(row[primaryCol.datasetFieldId] ?? 'N/A');
      if (!map.has(val)) {
        map.set(val, []);
      }
      map.get(val)!.push(row);
    }

    return Array.from(map.entries()).map(([val, rows]) => ({
      groupKey: val,
      groupValue: val,
      columnHeader: primaryCol.header,
      count: rows.length,
      rows,
    }));
  });

  protected refreshData(): void {
    this.refreshSeed.update((s) => s + 1);
  }

  setRowCount(count: number): void {
    this.rowCount.set(count);
  }

  toggleGroupingView(): void {
    this.showGroupingView.update((v) => !v);
  }

  protected onHeaderClick(col: PreviewColumn): void {
    if (!col.sortable) {
      return;
    }

    if (this.sortColumn() === col.datasetFieldId) {
      this.sortOrder.update((o) => -o);
    } else {
      this.sortColumn.set(col.datasetFieldId);
      this.sortOrder.set(1);
    }
  }

  private applySorting(data: Record<string, any>[]): Record<string, any>[] {
    const col = this.sortColumn();
    if (!col) {
      return data;
    }
    const order = this.sortOrder();

    return [...data].sort((a, b) => {
      const valA = a[col];
      const valB = b[col];

      if (valA === valB) return 0;
      if (valA == null) return 1;
      if (valB == null) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return (valA - valB) * order;
      }
      return String(valA).localeCompare(String(valB)) * order;
    });
  }

  private generateSampleValue(
    field: DatasetField,
    index: number,
    profile: { name: string; city: string; code: string },
    subOrderIdx: number,
    profileIdx: number,
  ): any {
    const idLower = (field.fieldId || '').toLowerCase();
    const tableLower = (field.tableId || '').toLowerCase();
    const nameLower = (field.fieldName || '').toLowerCase();
    const displayLower = (
      field.fieldDisplayName?.displayValue?.[this.i18n.locale()] ??
      (field.fieldDisplayName?.value != null ? String(field.fieldDisplayName.value) : '')
    ).toLowerCase();
    const textAll = `${idLower} ${tableLower} ${nameLower} ${displayLower}`;

    // Aggregations formatting
    if (field.aggregationType && field.aggregationType !== 'none') {
      if (field.aggregationType === 'count' || field.aggregationType === 'count-distinct') {
        return profileIdx * 3 + subOrderIdx + 2;
      }
      if (field.aggregationType === 'sum') {
        const baseVal = (profileIdx + 1) * 2400 + (subOrderIdx + 1) * 650;
        return baseVal.toLocaleString('en-US', {
          style: field.dataType === 'currency' ? 'currency' : 'decimal',
          currency: 'USD',
          minimumFractionDigits: 2,
        });
      }
      if (field.aggregationType === 'average') {
        const baseVal = (profileIdx + 1) * 450 + (subOrderIdx + 1) * 75;
        return baseVal.toLocaleString('en-US', {
          style: field.dataType === 'currency' ? 'currency' : 'decimal',
          currency: 'USD',
          minimumFractionDigits: 2,
        });
      }
      if (field.aggregationType === 'min') {
        const baseVal = (profileIdx + 1) * 320;
        return `$${baseVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      }
      if (field.aggregationType === 'max') {
        const baseVal = (profileIdx + 1) * 3200;
        return `$${baseVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      }
    }

    // Check specific fields by semantic meaning
    if (textAll.includes('customer') && (textAll.includes('name') || textAll.includes('nom'))) {
      return profile.name;
    }
    if (textAll.includes('code') && textAll.includes('customer')) {
      return profile.code;
    }
    if (textAll.includes('city') || textAll.includes('ville')) {
      return profile.city;
    }
    if (textAll.includes('product') || textAll.includes('item') || textAll.includes('produit')) {
      const mockProducts = [
        'Enterprise Analytics Suite',
        'Cloud Data Pipeline',
        'IoT Sensor Hub',
        'AI Recommendation Engine',
        'Security Gateway Pro',
        'High-Speed Stream Broker',
      ];
      return mockProducts[(profileIdx * 2 + subOrderIdx) % mockProducts.length];
    }
    if (textAll.includes('status') || textAll.includes('statut')) {
      const statuses = ['Completed', 'Completed', 'Processing', 'Delivered'];
      return statuses[(profileIdx + subOrderIdx) % statuses.length];
    }
    if (textAll.includes('qty') || textAll.includes('quantity') || textAll.includes('quantité')) {
      return ((profileIdx * 2 + subOrderIdx) % 5) + 1;
    }

    switch (field.dataType) {
      case 'currency': {
        const val = ((profileIdx + 1) * 1250 + (subOrderIdx + 1) * 385.5).toFixed(2);
        return `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      }
      case 'number':
      case 'integer':
      case 'decimal': {
        return (profileIdx + 1) * 10 + (subOrderIdx + 1) * 3;
      }
      case 'date':
      case 'datetime': {
        const d = new Date(2026, 2, 10 + profileIdx * 4 + subOrderIdx);
        return d.toISOString().split('T')[0];
      }
      case 'boolean': {
        return subOrderIdx % 2 === 0;
      }
      case 'guid': {
        return `uuid-${profileIdx + 1}00${subOrderIdx + 1}`;
      }
      default: {
        return `${field.fieldName}_${profileIdx + 1}.${subOrderIdx + 1}`;
      }
    }
  }

  protected getDataTypeIcon(dataType: string): string {
    switch (dataType) {
      case 'currency':
        return '$';
      case 'number':
      case 'integer':
      case 'decimal':
        return '#';
      case 'date':
      case 'datetime':
        return '📅';
      case 'boolean':
        return '◩';
      case 'guid':
        return '🔑';
      default:
        return 'Aa';
    }
  }
}
