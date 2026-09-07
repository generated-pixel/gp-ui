import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { GpBlockUI, GpButton, GpInputTextDirective, GpTag } from '@generatedpixel/gp-ui';
import { GpAnalyticsComponent } from '../../base/gp-analytics-component';
import {
  DatasetField,
  getDatasetFieldDisplayLabel,
  getLookupValueDisplayLabel,
  DatasetDataSourceConfig,
  LoadedDataResult,
  CustomDataLoaderFn,
  GpFilterCondition,
  GpFilterOperator
} from '../../../models';
import { GpDatasetDataLoaderService } from '../../../services/dataset-data-loader.service';
import { GpDataEngineService } from '../../../services/data-engine.service';
import { GpLocaleFormatterService } from '../../../services/locale-formatter.service';

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

export interface ColumnSummaryStats {
  fieldId: string;
  totalCount: number;
  distinctCount: number;
  nullCount: number;
  isNumeric: boolean;
  min?: number;
  max?: number;
  avg?: number;
  sum?: number;
}

@Component({
  selector: 'gp-dataset-preview',
  standalone: true,
  imports: [GpButton, GpTag, GpBlockUI, GpInputTextDirective],
  templateUrl: './dataset-preview.html',
  styleUrl: './dataset-preview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GpDatasetPreview extends GpAnalyticsComponent {
  protected readonly dataLoader = inject(GpDatasetDataLoaderService);
  protected readonly localeFormatter = inject(GpLocaleFormatterService);

  readonly showSummaryStats = input<boolean>(true);
  readonly isStatsExpanded = signal<boolean>(false);

  toggleStatsExpanded(): void {
    this.isStatsExpanded.update((v) => !v);
  }

  /**
   * The list of dataset fields forming the columns of this table preview.
   */
  readonly fields = input<DatasetField[]>([]);

  /**
   * Dataset name displayed on the header.
   */
  readonly datasetName = input<string>('Custom Dataset');

  /**
   * Optional custom/real dataset records. If null and no source loaded, simulated data is rendered.
   */
  readonly customData = input<Record<string, any>[] | null>(null);

  /**
   * Optional custom data loader function for specialized or authenticated fetching.
   */
  readonly customDataLoader = input<CustomDataLoaderFn | null>(null);

  /**
   * Optional initial or pre-configured data source.
   */
  readonly dataSourceConfig = input<DatasetDataSourceConfig | null>(null);

  /**
   * Dataset-level filters applied to records in preview.
   */
  readonly filters = input<GpFilterCondition[]>([]);

  /**
   * Event emitted when custom data is loaded from a source.
   */
  readonly dataSourceLoaded = output<LoadedDataResult>();

  /**
   * Event emitted when the preview is reset to simulated data.
   */
  readonly dataSourceReset = output<void>();

  /**
   * Event emitted when a filter chip is removed.
   */
  readonly filterRemove = output<number>();

  /**
   * Event emitted when all filters are cleared.
   */
  readonly filtersClear = output<void>();

  protected readonly dataEngine = inject(GpDataEngineService);

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

  // --- Generic Data Source Modal & State ---
  readonly isSourceModalOpen = signal<boolean>(false);
  readonly activeTab = signal<'file' | 'api' | 'json'>('file');
  readonly selectedFile = signal<File | null>(null);
  readonly apiUrlInput = signal<string>('');
  readonly dataPathInput = signal<string>('');
  readonly rawJsonInput = signal<string>('');
  readonly isLoadingSource = signal<boolean>(false);
  readonly sourceError = signal<string | null>(null);
  readonly loadedSourceResult = signal<LoadedDataResult | null>(null);
  protected readonly internalLoadedRecords = signal<Record<string, any>[] | null>(null);

  /**
   * Whether a custom data source (via input, loader, or modal) is currently active.
   */
  readonly isCustomSourceActive = computed<boolean>(() => {
    return Boolean(
      (this.customData() && this.customData()!.length > 0) ||
      (this.internalLoadedRecords() && this.internalLoadedRecords()!.length > 0) ||
      this.loadedSourceResult()
    );
  });

  /**
   * Filtered dataset fields ensuring only visible fields are rendered in preview.
   */
  readonly visibleFields = computed<DatasetField[]>(() => {
    return this.fields().filter((f) => f.visible !== false && (f.baseField ? f.baseField.visible !== false : true));
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
      isGrouped: f.isGrouped
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
   * Computed rows: uses customData/internalLoadedRecords if available, otherwise generates realistic clustered simulated rows.
   */
  readonly rows = computed<Record<string, any>[]>(() => {
    // Read seed for reactivity
    const _seed = this.refreshSeed();
    const provided = this.customData();
    const internal = this.internalLoadedRecords();
    const activeRecords = provided ?? internal;

    if (activeRecords && activeRecords.length > 0) {
      const mapped = this.dataLoader.mapRecordsToDatasetFields(activeRecords, this.visibleFields());
      return this.applySorting(mapped);
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
      { name: 'Summit Holdings', city: 'Zurich', code: 'CUST-ZUR-07' }
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
   * Filtered rows: applies dataset filters to the active (simulated or custom) rows.
   */
  readonly filteredRows = computed<Record<string, any>[]>(() => {
    const all = this.rows();
    const f = this.filters();
    return this.dataEngine.applyFilters(all, f);
  });

  /**
   * Computes comprehensive column profile statistics (distinct, null count, min/max/avg/sum).
   */
  readonly columnStatistics = computed<Record<string, ColumnSummaryStats>>(() => {
    const rows = this.filteredRows();
    const cols = this.columns();
    const stats: Record<string, ColumnSummaryStats> = {};

    for (const col of cols) {
      const key = col.datasetFieldId;
      const values = rows.map((r) => r[key]);
      const nonNulls = values.filter((v) => v !== null && v !== undefined && v !== '');
      const nullCount = values.length - nonNulls.length;
      const distinctSet = new Set(nonNulls);

      const isNum =
        ['number', 'integer', 'float', 'decimal', 'currency'].includes(col.dataType.toLowerCase()) ||
        (nonNulls.length > 0 && nonNulls.every((v) => typeof v === 'number'));

      const colStat: ColumnSummaryStats = {
        fieldId: key,
        totalCount: values.length,
        distinctCount: distinctSet.size,
        nullCount,
        isNumeric: isNum
      };

      if (isNum && nonNulls.length > 0) {
        const numValues = nonNulls
          .map((v) => (typeof v === 'number' ? v : parseFloat(String(v))))
          .filter((n) => !isNaN(n));
        if (numValues.length > 0) {
          const sum = numValues.reduce((acc, v) => acc + v, 0);
          colStat.sum = Number(sum.toFixed(2));
          colStat.min = Number(Math.min(...numValues).toFixed(2));
          colStat.max = Number(Math.max(...numValues).toFixed(2));
          colStat.avg = Number((sum / numValues.length).toFixed(2));
        }
      }

      stats[key] = colStat;
    }

    return stats;
  });

  /**
   * Groups rows into sections based on the primary grouped column.
   */
  readonly groupedRowSections = computed<RowGroupSection[]>(() => {
    const allRows = this.filteredRows();
    const primaryCol = this.primaryGroupColumn();

    // Automagic: if nothing is selected for grouping, show flat table
    if (!this.hasActiveGrouping() || !primaryCol || allRows.length === 0) {
      return [
        {
          groupKey: 'all',
          groupValue: '',
          columnHeader: '',
          count: allRows.length,
          rows: allRows
        }
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
      rows
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

  openSourceModal(): void {
    this.sourceError.set(null);
    this.isSourceModalOpen.set(true);
  }

  closeSourceModal(): void {
    this.isSourceModalOpen.set(false);
    this.sourceError.set(null);
  }

  setActiveTab(tab: 'file' | 'api' | 'json'): void {
    this.activeTab.set(tab);
    this.sourceError.set(null);
  }

  onFileSelected(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    if (inputEl.files && inputEl.files.length > 0) {
      this.selectedFile.set(inputEl.files[0]);
      this.sourceError.set(null);
    }
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.name.endsWith('.json') || file.type.includes('json')) {
        this.selectedFile.set(file);
        this.sourceError.set(null);
      } else {
        this.sourceError.set('Please drop a valid .json file');
      }
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onApiUrlChange(val: string): void {
    this.apiUrlInput.set(val);
  }

  onDataPathChange(val: string): void {
    this.dataPathInput.set(val);
  }

  onRawJsonChange(val: string): void {
    this.rawJsonInput.set(val);
  }

  async loadSourceData(): Promise<void> {
    const tab = this.activeTab();
    const dataPath = this.dataPathInput().trim() || undefined;
    const currentFields = this.visibleFields();

    this.isLoadingSource.set(true);
    this.sourceError.set(null);

    try {
      let config: DatasetDataSourceConfig;

      if (tab === 'file') {
        const file = this.selectedFile();
        if (!file) {
          throw new Error(this.i18n.translate('noFileSelected'));
        }
        config = {
          type: 'file',
          file,
          fileName: file.name,
          dataPath
        };
      } else if (tab === 'api') {
        const url = this.apiUrlInput().trim();
        if (!url || (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/'))) {
          throw new Error(this.i18n.translate('enterValidUrl'));
        }
        config = {
          type: 'api',
          url,
          dataPath
        };
      } else {
        const rawJson = this.rawJsonInput().trim();
        if (!rawJson) {
          throw new Error(this.i18n.translate('enterValidJson'));
        }
        config = {
          type: 'json',
          rawJson,
          dataPath
        };
      }

      // Check if custom loader function was passed
      const customFn = this.customDataLoader();
      let result: LoadedDataResult;

      if (customFn) {
        const rawOrResult = await customFn(config, { fields: currentFields });
        if (Array.isArray(rawOrResult)) {
          const mapped = this.dataLoader.mapRecordsToDatasetFields(rawOrResult, currentFields);
          const analysis = this.dataLoader.analyzeFieldMatching(rawOrResult, currentFields);
          result = {
            sourceType: config.type,
            sourceName: 'Custom Loader',
            records: mapped,
            totalRecords: mapped.length,
            matchedFields: analysis.matchedFields,
            unmatchedFields: analysis.unmatchedFields,
            timestamp: new Date().toISOString()
          };
        } else {
          result = rawOrResult;
        }
      } else {
        result = await this.dataLoader.loadData(config, currentFields);
      }

      this.internalLoadedRecords.set(result.records);
      this.loadedSourceResult.set(result);
      this.dataSourceLoaded.emit(result);
      this.isSourceModalOpen.set(false);
    } catch (err: any) {
      this.sourceError.set(err.message || 'Failed to load data from source');
    } finally {
      this.isLoadingSource.set(false);
    }
  }

  resetToSimulatedData(): void {
    this.internalLoadedRecords.set(null);
    this.loadedSourceResult.set(null);
    this.selectedFile.set(null);
    this.apiUrlInput.set('');
    this.rawJsonInput.set('');
    this.dataPathInput.set('');
    this.sourceError.set(null);
    this.refreshData();
    this.dataSourceReset.emit();
  }

  loadPreset(records: Record<string, any>[], sourceName: string): void {
    const mapped = this.dataLoader.mapRecordsToDatasetFields(records, this.visibleFields());
    const analysis = this.dataLoader.analyzeFieldMatching(records, this.visibleFields());

    const result: LoadedDataResult = {
      sourceType: 'json',
      sourceName,
      records: mapped,
      totalRecords: mapped.length,
      matchedFields: analysis.matchedFields,
      unmatchedFields: analysis.unmatchedFields,
      timestamp: new Date().toISOString()
    };

    this.internalLoadedRecords.set(result.records);
    this.loadedSourceResult.set(result);
    this.dataSourceLoaded.emit(result);
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
    profileIdx: number
  ): any {
    const idLower = (field.fieldId || '').toLowerCase();
    const tableLower = (field.tableId || '').toLowerCase();
    const nameLower = (field.fieldName || '').toLowerCase();
    const displayLower = (
      field.fieldDisplayName?.displayValue?.[this.i18n.locale()] ??
      (field.fieldDisplayName?.value != null ? String(field.fieldDisplayName.value) : '')
    ).toLowerCase();
    const textAll = `${idLower} ${tableLower} ${nameLower} ${displayLower}`;

    // If field defines lookup values, pick deterministically from lookupValues
    if (field.lookupValues && field.lookupValues.length > 0) {
      const idx = (profileIdx + subOrderIdx) % field.lookupValues.length;
      return field.lookupValues[idx].value;
    }

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
          minimumFractionDigits: 2
        });
      }
      if (field.aggregationType === 'average') {
        const baseVal = (profileIdx + 1) * 450 + (subOrderIdx + 1) * 75;
        return baseVal.toLocaleString('en-US', {
          style: field.dataType === 'currency' ? 'currency' : 'decimal',
          currency: 'USD',
          minimumFractionDigits: 2
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
        'High-Speed Stream Broker'
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

  formatCellValue(col: PreviewColumn, val: any, row?: Record<string, any>): string {
    if (val == null) {
      return '-';
    }
    const field = this.fields().find((f) => f.datasetFieldId === col.datasetFieldId || f.fieldId === col.fieldId);
    if (field?.lookupValues && field.lookupValues.length > 0) {
      return getLookupValueDisplayLabel(field, val, this.i18n.locale());
    }

    // Currency formatting with per-row/per-table resolution
    if (col.dataType === 'currency' || field?.dataType === 'currency') {
      const num = Number(val);
      if (!isNaN(num)) {
        let currencyCode = field?.currencyCode;
        if (field?.currencyField && row && row[field.currencyField]) {
          currencyCode = String(row[field.currencyField]);
        } else if (row && row['currency']) {
          currencyCode = String(row['currency']);
        } else if (row && row['currencyCode']) {
          currencyCode = String(row['currencyCode']);
        }
        return this.localeFormatter.formatCurrency(num, currencyCode);
      }
    }

    // Standard number / decimal / integer formatting
    if (col.dataType === 'number' || col.dataType === 'decimal' || col.dataType === 'integer') {
      const num = Number(val);
      if (!isNaN(num)) {
        return this.localeFormatter.formatNumber(num);
      }
    }

    // Date / Datetime formatting
    if (col.dataType === 'date' || col.dataType === 'datetime') {
      return this.localeFormatter.formatDate(val);
    }

    return String(val);
  }

  getFilterFieldLabel(fieldId: string): string {
    const f = this.fields().find(
      (item) => item.datasetFieldId === fieldId || item.fieldId === fieldId || item.fieldName === fieldId
    );
    return f ? getDatasetFieldDisplayLabel(f, this.i18n.locale()) : fieldId;
  }

  getFilterOperatorLabel(operator: GpFilterOperator): string {
    switch (operator) {
      case 'eq':
        return '=';
      case 'neq':
        return '!=';
      case 'gt':
        return '>';
      case 'gte':
        return '>=';
      case 'lt':
        return '<';
      case 'lte':
        return '<=';
      case 'in':
        return this.i18n.translate('inList');
      case 'contains':
        return this.i18n.translate('contains');
      case 'startsWith':
        return this.i18n.translate('startsWith');
      case 'isNull':
        return this.i18n.translate('isNull');
      case 'isNotNull':
        return this.i18n.translate('isNotNull');
      default:
        return operator;
    }
  }

  getFilterValueDisplay(condition: GpFilterCondition): string {
    if (condition.operator === 'isNull' || condition.operator === 'isNotNull') {
      return '';
    }
    const field = this.fields().find(
      (f) =>
        f.datasetFieldId === condition.fieldId || f.fieldId === condition.fieldId || f.fieldName === condition.fieldId
    );
    const locale = this.i18n.locale();
    if (Array.isArray(condition.value)) {
      return condition.value.map((v) => getLookupValueDisplayLabel(field, v, locale)).join(', ');
    }
    return getLookupValueDisplayLabel(field, condition.value, locale);
  }

  removeFilter(index: number): void {
    this.filterRemove.emit(index);
  }

  clearAllFilters(): void {
    this.filtersClear.emit();
  }
}
