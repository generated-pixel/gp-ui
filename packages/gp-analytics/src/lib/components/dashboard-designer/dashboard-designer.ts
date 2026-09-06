import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GpAnalyticsComponent } from '../base/gp-analytics-component';
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
} from '../../models/dashboard.model';
import { GpMeasureQuery } from '../../models/query.model';

import { GpButton, GpTag, GpSwitch } from '@generatedpixel/gp-ui';

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
  ],
  templateUrl: './dashboard-designer.html',
  styleUrl: './dashboard-designer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GpDashboardDesigner extends GpAnalyticsComponent {
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

  // Active view mode: 'design' enables layout drag/resize & toolbar; 'preview' shows end-user experience
  readonly activeMode = signal<'design' | 'preview'>('design');

  // Currently selected widget ID for inspection
  readonly selectedWidgetId = signal<string | null>(null);

  // UI state toggles
  readonly isInspectorOpen = signal<boolean>(false);
  readonly isSettingsModalOpen = signal<boolean>(false);
  readonly isJsonModalOpen = signal<boolean>(false);
  readonly isAddMenuOpen = signal<boolean>(false);
  readonly jsonModalTab = signal<'export' | 'import'>('export');
  readonly jsonBuffer = signal<string>('');
  readonly jsonError = signal<string | null>(null);
  readonly saveNotification = signal<string | null>(null);

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
        label: this.formatLabel(key),
      }));
    }
    return [
      { fieldId: 'total', label: 'Total' },
      { fieldId: 'quantity', label: 'Quantity' },
      { fieldId: 'customer_name', label: 'Customer Name' },
      { fieldId: 'status', label: 'Status' },
      { fieldId: 'region', label: 'Region' },
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
    return this.effectiveFields().map((f) => f.fieldId).join(', ');
  });

  updateTableDimensions(text: string): void {
    const dims = text.split(',').map((s) => s.trim()).filter(Boolean);
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

    let newWidget: GpDashboardWidgetConfig;

    switch (type) {
      case 'kpi': {
        newWidget = {
          id: uniqueId,
          type: 'kpi',
          title: `New KPI Metric`,
          icon: '📈',
          grid: { x: 0, y: maxY, w: 4, h: 2, minW: 3, minH: 2 },
          measure: { fieldId: numField, aggregation: 'sum' },
          formatCurrency: true,
          comparePrevious: true,
          severity: 'info',
        };
        break;
      }
      case 'chart': {
        newWidget = {
          id: uniqueId,
          type: 'chart',
          title: `${this.formatLabel(chartType)} Analysis`,
          chartType,
          grid: { x: 0, y: maxY, w: 6, h: 4, minW: 4, minH: 3 },
          dimension: dimField,
          measure: { fieldId: numField, aggregation: 'sum', alias: 'val' },
          sortOrder: 'desc',
          limit: 8,
        };
        break;
      }
      case 'table': {
        newWidget = {
          id: uniqueId,
          type: 'table',
          title: 'Analytical Table Rollup',
          subtitle: 'Hierarchical aggregation',
          grid: { x: 0, y: maxY, w: 12, h: 5, minW: 6, minH: 4 },
          dimensions: [dimField],
          measures: [{ fieldId: numField, aggregation: 'sum', alias: 'total_val' }],
          showSubtotals: true,
          showGrandTotal: true,
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
          grid: { x: 0, y: maxY, w: 12, h: 5, minW: 6, minH: 4 },
          rowDimension: dimField,
          colDimension: colField,
          measure: { fieldId: numField, aggregation: 'sum' },
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
          grid: { x: 0, y: maxY, w: 6, h: 3, minW: 3, minH: 2 },
          content: 'Add custom insights, instructions, or operational highlights here.',
        };
        break;
      }
    }

    const updatedConfig: GpDashboardConfig = {
      ...this.config(),
      widgets: [...currentWidgets, newWidget],
    };

    this.config.set(updatedConfig);
    this.openWidgetInspector(newWidget);
  }

  // Duplicate Widget
  duplicateWidget(w: GpDashboardWidgetConfig): void {
    const currentWidgets = this.config().widgets;
    const cloned: GpDashboardWidgetConfig = JSON.parse(JSON.stringify(w));
    cloned.id = `widget-${w.type}-${Date.now().toString(36)}`;
    cloned.title = `${w.title} (Copy)`;
    // Offset position downwards
    cloned.grid.y = (cloned.grid.y ?? 0) + (cloned.grid.h ?? 2);

    this.config.set({
      ...this.config(),
      widgets: [...currentWidgets, cloned],
    });

    this.openWidgetInspector(cloned);
  }

  // Delete Widget
  deleteWidget(id: string): void {
    const currentWidgets = this.config().widgets;
    const updated = currentWidgets.filter((w) => w.id !== id);
    this.config.set({
      ...this.config(),
      widgets: updated,
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
        if (
          w.grid.x !== match.x ||
          w.grid.y !== match.y ||
          w.grid.w !== match.w ||
          w.grid.h !== match.h
        ) {
          modified = true;
          return {
            ...w,
            grid: {
              ...w.grid,
              x: match.x,
              y: match.y,
              w: match.w,
              h: match.h,
            },
          };
        }
      }
      return w;
    });

    if (modified) {
      this.config.set({
        ...this.config(),
        widgets: updatedWidgets,
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
      const copy = [...currentWidgets];
      copy[index] = updated;
      this.config.set({
        ...this.config(),
        widgets: copy,
      });
    }
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
      alias: `${numField}_sum_${table.measures.length + 1}`,
    };
    this.updateSelectedWidget({
      measures: [...table.measures, newMeasure],
    } as any);
  }

  removeTableMeasure(index: number): void {
    const w = this.selectedWidget();
    if (!w || w.type !== 'table') return;
    const table = w as GpTableWidgetConfig;
    this.updateSelectedWidget({
      measures: table.measures.filter((_, i) => i !== index),
    } as any);
  }

  // Load Presets
  loadTemplate(templateKey: 'executive' | 'operations' | 'blank'): void {
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
    this.config.set({
      ...this.config(),
      ...patch,
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

  private showToast(msg: string): void {
    this.saveNotification.set(msg);
    setTimeout(() => {
      this.saveNotification.set(null);
    }, 3000);
  }

  private formatLabel(str: string): string {
    return str
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
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
