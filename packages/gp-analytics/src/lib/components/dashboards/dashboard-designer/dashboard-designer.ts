import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  input,
  model,
  OnDestroy,
  output,
  signal
} from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GpAnalyticsComponent } from '../../base/gp-analytics-component';
import { GpAnalyticsDashboard } from '../analytics-dashboard/analytics-dashboard';
import { GpGridItem } from '@generatedpixel/gp-grid';
import {
  GpDashboardConfig,
  GpDashboardWidgetConfig,
  GpDashboardWidgetType,
  GpKpiWidgetConfig,
  GpChartWidgetConfig,
  GpTableWidgetConfig,
  GpPivotWidgetConfig,
  GpCustomWidgetConfig,
  createDefaultDashboardConfig,
  createBlankDashboardConfig,
  createOperationsDashboardConfig,
  GpWidgetDataSourceConfig
} from '../../../models/dashboard.model';
import { GpMeasureQuery } from '../../../models/query.model';

import { GpButton, GpTag, GpSwitch, GpSelect, GpInputTextDirective } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-dashboard-designer',
  standalone: true,
  imports: [
    FormsModule,
    UpperCasePipe,
    GpAnalyticsDashboard,
    GpButton,
    GpTag,
    GpSwitch,
    GpSelect,
    GpInputTextDirective
  ],
  templateUrl: './dashboard-designer.html',
  styleUrl: './dashboard-designer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GpDashboardDesigner extends GpAnalyticsComponent implements OnDestroy {
  readonly autoRefreshOptions = [
    { label: 'Refresh: Off', value: 0 },
    { label: 'Every 5s', value: 5 },
    { label: 'Every 15s', value: 15 },
    { label: 'Every 30s', value: 30 },
    { label: 'Every 60s', value: 60 }
  ];

  readonly widgetTypeOptions = [
    { label: 'KPI Metric Card', value: 'kpi' },
    { label: 'Analytical Chart', value: 'chart' },
    { label: 'Tabular Report', value: 'table' },
    { label: '2D Pivot Matrix', value: 'pivot' },
    { label: 'Custom Info Card', value: 'custom' }
  ];

  readonly aggregationOptions = [
    { label: 'Sum', value: 'sum' },
    { label: 'Average', value: 'avg' },
    { label: 'Count', value: 'count' },
    { label: 'Min', value: 'min' },
    { label: 'Max', value: 'max' }
  ];

  readonly severityOptions = [
    { label: 'Default (Primary)', value: 'info' },
    { label: 'Success (Green)', value: 'success' },
    { label: 'Info (Blue)', value: 'info' },
    { label: 'Warning (Amber)', value: 'warning' },
    { label: 'Danger (Red)', value: 'danger' }
  ];

  readonly chartTypeOptions = [
    { label: 'Bar Chart', value: 'bar' },
    { label: 'Donut Chart', value: 'donut' },
    { label: 'Line Trend Chart', value: 'line' }
  ];

  readonly sortOrderOptions = [
    { label: 'High to Low', value: 'desc' },
    { label: 'Low to High', value: 'asc' }
  ];

  readonly compactTypeOptions = [
    { label: 'Vertical Packing (Pack and snap upwards automatically)', value: 'vertical' },
    { label: 'Free Placement (Items stay exactly where dropped)', value: 'none' }
  ];
  /**
   * Two-way bound dashboard configuration.
   */
  readonly config = model<GpDashboardConfig>(createDefaultDashboardConfig());

  /**
   * Dataset records used to render live previews in the designer canvas.
   */
  readonly records = input<Record<string, any>[]>([]);

  /**
   * Available fields from the active domain schema or dataset.
   */
  readonly availableFields = input<{ fieldId: string; label: string; type?: string }[]>([]);

  /**
   * Emitted when user clicks the Save button.
   */
  readonly save = output<GpDashboardConfig>();

  /**
   * Emitted when user clicks Cancel or Exit.
   */
  readonly cancel = output<void>();

  /**
   * Emitted when dashboard auto-refreshes or manual refresh is triggered.
   */
  readonly refresh = output<void>();

  // Auto-refresh interval (in seconds, 0 = disabled)
  readonly autoRefreshInterval = signal<number>(0);
  readonly isRefreshing = signal<boolean>(false);
  readonly lastRefreshedAt = signal<Date>(new Date());
  protected autoRefreshTimer: any = null;

  // Active view mode: 'design' enables layout drag/resize & toolbar; 'preview' shows end-user experience
  readonly activeMode = signal<'design' | 'preview'>('design');

  // Currently selected widget ID for inspection
  readonly selectedWidgetId = signal<string | null>(null);

  // UI state toggles
  readonly isInspectorOpen = signal<boolean>(false);
  readonly isSettingsModalOpen = signal<boolean>(false);
  readonly isJsonModalOpen = signal<boolean>(false);
  readonly isAddMenuOpen = signal<boolean>(false);
  readonly isFullscreen = signal<boolean>(false);
  readonly jsonModalTab = signal<'export' | 'import'>('export');
  readonly jsonBuffer = signal<string>('');
  readonly jsonError = signal<string | null>(null);
  readonly saveNotification = signal<string | null>(null);

  /**
   * Toggles distraction-free fullscreen presentation mode.
   */
  toggleFullscreen(): void {
    const next = !this.isFullscreen();
    this.isFullscreen.set(next);
    if (next) {
      this.activeMode.set('preview');
      this.closeWidgetInspector();
      this.closeAddMenu();
    }
  }

  // History state stacks for undo / redo
  readonly undoStack = signal<GpDashboardConfig[]>([]);
  readonly redoStack = signal<GpDashboardConfig[]>([]);
  readonly canUndo = computed<boolean>(() => this.undoStack().length > 0);
  readonly canRedo = computed<boolean>(() => this.redoStack().length > 0);

  /**
   * Pushes a deep clone of previous config state onto the undo stack.
   */
  pushHistory(prevConfig: GpDashboardConfig): void {
    const cloned: GpDashboardConfig = JSON.parse(JSON.stringify(prevConfig));
    this.undoStack.update((stack) => [...stack.slice(-25), cloned]);
    this.redoStack.set([]);
  }

  /**
   * Reverts to the previous state on the undo stack.
   */
  undo(): void {
    const stack = this.undoStack();
    if (stack.length === 0) return;
    const prev = stack[stack.length - 1];
    this.undoStack.set(stack.slice(0, -1));
    const current: GpDashboardConfig = JSON.parse(JSON.stringify(this.config()));
    this.redoStack.update((r) => [...r, current]);
    this.config.set(prev);
    this.selectedWidgetId.set(null);
  }

  /**
   * Re-applies the next state on the redo stack.
   */
  redo(): void {
    const stack = this.redoStack();
    if (stack.length === 0) return;
    const next = stack[stack.length - 1];
    this.redoStack.set(stack.slice(0, -1));
    const current: GpDashboardConfig = JSON.parse(JSON.stringify(this.config()));
    this.undoStack.update((u) => [...u, current]);
    this.config.set(next);
    this.selectedWidgetId.set(null);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardShortcuts(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.isFullscreen()) {
      event.preventDefault();
      this.isFullscreen.set(false);
      return;
    }

    if (this.activeMode() !== 'design') return;
    const isCtrl = event.ctrlKey || event.metaKey;
    if (isCtrl && event.key.toLowerCase() === 'z') {
      if (event.shiftKey) {
        event.preventDefault();
        this.redo();
      } else {
        event.preventDefault();
        this.undo();
      }
    } else if (isCtrl && event.key.toLowerCase() === 'y') {
      event.preventDefault();
      this.redo();
    }
  }

  /**
   * Currently inspected widget object.
   */
  readonly selectedWidget = computed<GpDashboardWidgetConfig | null>(() => {
    const id = this.selectedWidgetId();
    if (!id) return null;
    return this.config().widgets.find((w) => w.id === id) ?? null;
  });

  /**
   * Fallback fields computed from records if availableFields is empty.
   */
  readonly effectiveFields = computed<{ fieldId: string; label: string }[]>(() => {
    const fields = this.availableFields();
    if (fields && fields.length > 0) {
      return fields;
    }
    const recs = this.records();
    if (recs && recs.length > 0) {
      return Object.keys(recs[0]).map((key) => ({
        fieldId: key,
        label: this.formatLabel(key)
      }));
    }
    return [
      { fieldId: 'total', label: 'Total' },
      { fieldId: 'quantity', label: 'Quantity' },
      { fieldId: 'customer_name', label: 'Customer Name' },
      { fieldId: 'status', label: 'Status' },
      { fieldId: 'region', label: 'Region' }
    ];
  });

  /**
   * Numeric fields suitable for measures.
   */
  readonly numericFields = computed<{ fieldId: string; label: string }[]>(() => {
    const recs = this.records();
    const eff = this.effectiveFields();
    if (!recs || recs.length === 0) return eff;
    const sample = recs[0];
    return eff.filter((f) => typeof sample[f.fieldId] === 'number');
  });

  /**
   * Categorical fields suitable for dimensions.
   */
  readonly dimensionFields = computed<{ fieldId: string; label: string }[]>(() => {
    const recs = this.records();
    const eff = this.effectiveFields();
    if (!recs || recs.length === 0) return eff;
    const sample = recs[0];
    return eff.filter((f) => typeof sample[f.fieldId] !== 'number');
  });

  /**
   * Comma-separated list of available field IDs.
   */
  readonly availableFieldNames = computed(() => {
    return this.effectiveFields()
      .map((f) => f.fieldId)
      .join(', ');
  });

  updateTableDimensions(text: string): void {
    const dims = text
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    this.updateSelectedWidget({ dimensions: dims });
  }

  updateMeasureField(m: GpMeasureQuery, fieldId: string): void {
    m.fieldId = fieldId;
    const w = this.selectedWidget();
    if (w && w.type === 'table') {
      this.updateSelectedWidget({ measures: [...(w as GpTableWidgetConfig).measures] });
    }
  }

  updateMeasureAggregation(m: GpMeasureQuery, agg: any): void {
    m.aggregation = agg;
    const w = this.selectedWidget();
    if (w && w.type === 'table') {
      this.updateSelectedWidget({ measures: [...(w as GpTableWidgetConfig).measures] });
    }
  }

  // Mode Switcher
  setMode(mode: 'design' | 'preview'): void {
    this.activeMode.set(mode);
    this.isAddMenuOpen.set(false);
    if (mode === 'preview') {
      this.isInspectorOpen.set(false);
    }
  }

  // Widget Selection & Inspection
  selectWidget(w: GpDashboardWidgetConfig): void {
    this.selectedWidgetId.set(w.id);
  }

  openWidgetInspector(w: GpDashboardWidgetConfig): void {
    this.selectedWidgetId.set(w.id);
    this.isInspectorOpen.set(true);
    this.isAddMenuOpen.set(false);
  }

  closeWidgetInspector(): void {
    this.isInspectorOpen.set(false);
  }

  // Add Widget
  toggleAddMenu(): void {
    this.isAddMenuOpen.update((v) => !v);
  }

  closeAddMenu(): void {
    this.isAddMenuOpen.set(false);
  }

  addWidget(type: GpDashboardWidgetType, chartType: 'bar' | 'donut' | 'line' = 'bar'): void {
    this.closeAddMenu();
    const currentWidgets = this.config().widgets;

    // Find smart starting Y coordinate below all existing widgets
    let maxY = 0;
    for (const w of currentWidgets) {
      const bottom = (w.grid.y ?? 0) + (w.grid.h ?? 2);
      if (bottom > maxY) maxY = bottom;
    }

    const uniqueId = `widget-${type}-${Date.now().toString(36)}`;
    const numField = this.numericFields()[0]?.fieldId || 'total';
    const dimField = this.dimensionFields()[0]?.fieldId || 'customer_name';
    const cols = this.config().columns || 12;

    let targetW = 6;
    let targetH = 3;
    let minW = 3;
    let minH = 2;

    switch (type) {
      case 'kpi':
        targetW = 4;
        targetH = 2;
        minW = 3;
        minH = 2;
        break;
      case 'chart':
        targetW = 6;
        targetH = 4;
        minW = 4;
        minH = 3;
        break;
      case 'table':
      case 'pivot':
        targetW = 12;
        targetH = 5;
        minW = 6;
        minH = 4;
        break;
      case 'custom':
      default:
        targetW = 6;
        targetH = 3;
        minW = 3;
        minH = 2;
        break;
    }

    const pos = this.findAvailableGridPosition(targetW, targetH, cols);
    let newWidget: GpDashboardWidgetConfig;

    switch (type) {
      case 'kpi': {
        newWidget = {
          id: uniqueId,
          type: 'kpi',
          title: `New KPI Metric`,
          icon: '📈',
          grid: { x: pos.x, y: pos.y, w: targetW, h: targetH, minW, minH },
          measure: { fieldId: numField, aggregation: 'sum' },
          formatCurrency: true,
          comparePrevious: true,
          severity: 'info'
        };
        break;
      }
      case 'chart': {
        newWidget = {
          id: uniqueId,
          type: 'chart',
          title: `${this.formatLabel(chartType)} Analysis`,
          chartType,
          grid: { x: pos.x, y: pos.y, w: targetW, h: targetH, minW, minH },
          dimension: dimField,
          measure: { fieldId: numField, aggregation: 'sum', alias: 'val' },
          sortOrder: 'desc',
          limit: 8
        };
        break;
      }
      case 'table': {
        newWidget = {
          id: uniqueId,
          type: 'table',
          title: 'Analytical Table Rollup',
          subtitle: 'Hierarchical aggregation',
          grid: { x: pos.x, y: pos.y, w: targetW, h: targetH, minW, minH },
          dimensions: [dimField],
          measures: [{ fieldId: numField, aggregation: 'sum', alias: 'total_val' }],
          showSubtotals: true,
          showGrandTotal: true
        };
        break;
      }
      case 'pivot': {
        const colField = this.dimensionFields()[1]?.fieldId || 'status';
        newWidget = {
          id: uniqueId,
          type: 'pivot',
          title: 'Cross-Tabulation Matrix',
          subtitle: '2D breakdown matrix',
          grid: { x: pos.x, y: pos.y, w: targetW, h: targetH, minW, minH },
          rowDimension: dimField,
          colDimension: colField,
          measure: { fieldId: numField, aggregation: 'sum' }
        };
        break;
      }
      case 'custom':
      default: {
        newWidget = {
          id: uniqueId,
          type: 'custom',
          title: 'Information Card',
          subtitle: 'Operational notes',
          icon: '💡',
          grid: { x: pos.x, y: pos.y, w: targetW, h: targetH, minW, minH },
          content: 'Add custom insights, instructions, or operational highlights here.'
        };
        break;
      }
    }

    this.pushHistory(this.config());
    const updatedConfig: GpDashboardConfig = {
      ...this.config(),
      widgets: [...currentWidgets, newWidget]
    };

    this.config.set(updatedConfig);
    this.openWidgetInspector(newWidget);
  }

  /**
   * Intelligently scans grid space to find the first non-overlapping (x, y) slot.
   */
  findAvailableGridPosition(width: number, height: number, cols = 12): { x: number; y: number } {
    const widgets = this.config().widgets;
    if (!widgets || widgets.length === 0) {
      return { x: 0, y: 0 };
    }

    let maxY = 0;
    for (const w of widgets) {
      const b = (w.grid.y ?? 0) + (w.grid.h ?? 1);
      if (b > maxY) maxY = b;
    }

    for (let y = 0; y <= maxY + 1; y++) {
      for (let x = 0; x <= cols - width; x++) {
        const overlaps = widgets.some((w) => {
          const wx = w.grid.x ?? 0;
          const wy = w.grid.y ?? 0;
          const ww = w.grid.w ?? 1;
          const wh = w.grid.h ?? 1;
          return x < wx + ww && x + width > wx && y < wy + wh && y + height > wy;
        });

        if (!overlaps) {
          return { x, y };
        }
      }
    }

    return { x: 0, y: maxY };
  }

  // Duplicate Widget with intelligent auto-placement
  duplicateWidget(w: GpDashboardWidgetConfig): void {
    this.pushHistory(this.config());
    const currentWidgets = this.config().widgets;
    const cloned: GpDashboardWidgetConfig = JSON.parse(JSON.stringify(w));
    cloned.id = `widget-${w.type}-${Date.now().toString(36)}`;
    cloned.title = `${w.title} (Copy)`;

    const width = cloned.grid.w ?? 4;
    const height = cloned.grid.h ?? 2;
    const cols = this.config().columns || 12;

    // Check if space immediately to the right is free
    const candidateX = (w.grid.x ?? 0) + width;
    const candidateY = w.grid.y ?? 0;
    const isRightFree =
      candidateX + width <= cols &&
      !currentWidgets.some((cw) => {
        const wx = cw.grid.x ?? 0;
        const wy = cw.grid.y ?? 0;
        const ww = cw.grid.w ?? 1;
        const wh = cw.grid.h ?? 1;
        return candidateX < wx + ww && candidateX + width > wx && candidateY < wy + wh && candidateY + height > wy;
      });

    if (isRightFree) {
      cloned.grid.x = candidateX;
      cloned.grid.y = candidateY;
    } else {
      const bestSlot = this.findAvailableGridPosition(width, height, cols);
      cloned.grid.x = bestSlot.x;
      cloned.grid.y = bestSlot.y;
    }

    this.config.set({
      ...this.config(),
      widgets: [...currentWidgets, cloned]
    });

    this.openWidgetInspector(cloned);
    this.showToast(`Duplicated widget to (${cloned.grid.x}, ${cloned.grid.y})`);
  }

  // Delete Widget
  deleteWidget(id: string): void {
    this.pushHistory(this.config());
    const currentWidgets = this.config().widgets;
    const updated = currentWidgets.filter((w) => w.id !== id);
    this.config.set({
      ...this.config(),
      widgets: updated
    });
    if (this.selectedWidgetId() === id) {
      this.closeWidgetInspector();
      this.selectedWidgetId.set(null);
    }
  }

  // Synchronize Drag/Resize changes from gp-grid
  onLayoutChange(updatedItems: GpGridItem[]): void {
    const currentWidgets = this.config().widgets;
    let modified = false;

    const updatedWidgets = currentWidgets.map((w) => {
      const match = updatedItems.find((item) => item.id === w.id);
      if (match) {
        if (w.grid.x !== match.x || w.grid.y !== match.y || w.grid.w !== match.w || w.grid.h !== match.h) {
          modified = true;
          return {
            ...w,
            grid: {
              ...w.grid,
              x: match.x,
              y: match.y,
              w: match.w,
              h: match.h
            }
          };
        }
      }
      return w;
    });

    if (modified) {
      this.pushHistory(this.config());
      this.config.set({
        ...this.config(),
        widgets: updatedWidgets
      });
    }
  }

  // Update Individual Widget Config
  updateSelectedWidget(patch: Partial<GpDashboardWidgetConfig>): void {
    const current = this.selectedWidget();
    if (!current) return;

    const updated = { ...current, ...patch } as GpDashboardWidgetConfig;
    const currentWidgets = this.config().widgets;
    const index = currentWidgets.findIndex((w) => w.id === updated.id);
    if (index >= 0) {
      this.pushHistory(this.config());
      const copy = [...currentWidgets];
      copy[index] = updated;
      this.config.set({
        ...this.config(),
        widgets: copy
      });
    }
  }

  // Update Data Source for Selected Widget
  updateWidgetDataSource(patch: Partial<GpWidgetDataSourceConfig>): void {
    const current = this.selectedWidget();
    if (!current) return;
    const currentDs: GpWidgetDataSourceConfig = current.dataSource ?? { type: 'inherited' };
    this.updateSelectedWidget({
      dataSource: { ...currentDs, ...patch }
    });
  }

  // Table Measures builder helpers
  addTableMeasure(): void {
    const w = this.selectedWidget();
    if (!w || w.type !== 'table') return;
    const table = w as GpTableWidgetConfig;
    const numField = this.numericFields()[0]?.fieldId || 'total';
    const newMeasure: GpMeasureQuery = {
      fieldId: numField,
      aggregation: 'sum',
      alias: `${numField}_sum_${table.measures.length + 1}`
    };
    this.updateSelectedWidget({
      measures: [...table.measures, newMeasure]
    } as any);
  }

  removeTableMeasure(index: number): void {
    const w = this.selectedWidget();
    if (!w || w.type !== 'table') return;
    const table = w as GpTableWidgetConfig;
    this.updateSelectedWidget({
      measures: table.measures.filter((_, i) => i !== index)
    } as any);
  }

  // Load Presets
  loadTemplate(templateKey: 'executive' | 'operations' | 'blank'): void {
    this.pushHistory(this.config());
    if (templateKey === 'executive') {
      this.config.set(createDefaultDashboardConfig());
    } else if (templateKey === 'operations') {
      this.config.set(createOperationsDashboardConfig());
    } else {
      this.config.set(createBlankDashboardConfig());
    }
    this.closeWidgetInspector();
    this.selectedWidgetId.set(null);
  }

  // Dashboard Settings Modal
  openSettingsModal(): void {
    this.isSettingsModalOpen.set(true);
  }

  closeSettingsModal(): void {
    this.isSettingsModalOpen.set(false);
  }

  updateDashboardSettings(patch: Partial<GpDashboardConfig>): void {
    this.pushHistory(this.config());
    this.config.set({
      ...this.config(),
      ...patch
    });
  }

  // JSON Import & Export
  openJsonModal(tab: 'export' | 'import' = 'export'): void {
    this.jsonModalTab.set(tab);
    this.jsonBuffer.set(JSON.stringify(this.config(), null, 2));
    this.jsonError.set(null);
    this.isJsonModalOpen.set(true);
  }

  closeJsonModal(): void {
    this.isJsonModalOpen.set(false);
    this.jsonError.set(null);
  }

  copyJsonToClipboard(): void {
    navigator.clipboard?.writeText(this.jsonBuffer());
    this.showToast('JSON copied to clipboard!');
  }

  applyImportedJson(): void {
    try {
      const parsed = JSON.parse(this.jsonBuffer());
      if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.widgets)) {
        throw new Error('Invalid dashboard JSON: Root object must contain a "widgets" array.');
      }
      this.config.set(parsed);
      this.closeJsonModal();
      this.showToast('Dashboard configuration loaded!');
    } catch (err: any) {
      this.jsonError.set(err.message || 'Failed to parse JSON.');
    }
  }

  // Save Dashboard
  saveDashboard(): void {
    this.save.emit(this.config());
    this.showToast('Dashboard saved successfully!');
  }

  /**
   * Configures automatic data refresh timer interval.
   */
  setAutoRefresh(intervalSeconds: number): void {
    this.autoRefreshInterval.set(intervalSeconds);
    if (this.autoRefreshTimer) {
      clearInterval(this.autoRefreshTimer);
      this.autoRefreshTimer = null;
    }
    if (intervalSeconds > 0) {
      this.autoRefreshTimer = setInterval(() => {
        this.triggerRefresh();
      }, intervalSeconds * 1000);
      this.showToast(`Auto-refresh set to every ${intervalSeconds}s`);
    } else {
      this.showToast('Auto-refresh disabled');
    }
  }

  /**
   * Triggers an immediate refresh cycle and emits refresh event.
   */
  triggerRefresh(): void {
    this.isRefreshing.set(true);
    this.lastRefreshedAt.set(new Date());
    this.refresh.emit();
    setTimeout(() => {
      this.isRefreshing.set(false);
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.autoRefreshTimer) {
      clearInterval(this.autoRefreshTimer);
      this.autoRefreshTimer = null;
    }
  }

  private showToast(msg: string): void {
    this.saveNotification.set(msg);
    setTimeout(() => {
      this.saveNotification.set(null);
    }, 3000);
  }

  private formatLabel(str: string): string {
    return str.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  }

  // Type-casting helpers for template
  asKpi(w: GpDashboardWidgetConfig | null): GpKpiWidgetConfig | null {
    return w?.type === 'kpi' ? (w as GpKpiWidgetConfig) : null;
  }

  asChart(w: GpDashboardWidgetConfig | null): GpChartWidgetConfig | null {
    return w?.type === 'chart' ? (w as GpChartWidgetConfig) : null;
  }

  asTable(w: GpDashboardWidgetConfig | null): GpTableWidgetConfig | null {
    return w?.type === 'table' ? (w as GpTableWidgetConfig) : null;
  }

  asPivot(w: GpDashboardWidgetConfig | null): GpPivotWidgetConfig | null {
    return w?.type === 'pivot' ? (w as GpPivotWidgetConfig) : null;
  }

  asCustom(w: GpDashboardWidgetConfig | null): GpCustomWidgetConfig | null {
    return w?.type === 'custom' ? (w as GpCustomWidgetConfig) : null;
  }
}
