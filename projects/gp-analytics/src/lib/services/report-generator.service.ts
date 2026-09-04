import { inject, Injectable } from '@angular/core';
import {
  ColumnFormat,
  DesignerSelectionState,
  evaluateFieldFilter,
  Field,
  FieldFilter,
  GeneratedReport,
  ReportColumn,
  ReportDataPoint,
  ReportRow,
  resolveFieldLabel,
  resolveLocalizedText,
  SelectedField,
} from '../models';
import { LocalizationService } from './localization.service';

@Injectable({
  providedIn: 'root',
})
export class ReportGeneratorService {
  private readonly localization = inject(LocalizationService);

  /**
   * Generates a complete report artifact from a designer specification and dataset.
   */
  generateReport(
    definition: DesignerSelectionState,
    rawRecords: Record<string, unknown>[],
  ): GeneratedReport {
    const reportId = `rep-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const selected = definition.fields;
    const activeLocale = definition.locale || this.localization.activeLocale();

    // 1. Separate GroupBy dimensions and Aggregation measures
    const dimensions = selected.filter((f) => f.groupBy);
    const measures = selected.filter((f) => !f.groupBy);

    // 2. Define Output Columns
    const columns: ReportColumn[] = selected.map((f) => {
      const aliasKey = f.alias ? resolveLocalizedText(f.alias, activeLocale) : undefined;
      return {
        key: aliasKey ?? f.field.name,
        label: aliasKey ?? resolveFieldLabel(f.field, activeLocale),
        dataType: f.field.dataType,
        format: f.columnFormat ?? f.field.defaultFormat ?? 'default',
        aggregation: f.aggregation,
        field: f.field,
      };
    });

    // 3. Process Rows (Grouping & Aggregation with Filter Evaluation)
    let processedRows: ReportRow[] = [];

    if (dimensions.length > 0) {
      // Grouping map
      const groups = new Map<
        string,
        { keyRecord: Record<string, unknown>; items: Record<string, unknown>[] }
      >();

      for (const record of rawRecords) {
        // Evaluate filter if specified (locale-aware)
        if (!this.matchesFilters(record, selected, definition.filters, activeLocale)) {
          continue;
        }

        const groupKey = dimensions
          .map((d) => String(record[d.field.name] ?? ''))
          .join('|||');

        if (!groups.has(groupKey)) {
          const keyRecord: Record<string, unknown> = {};
          dimensions.forEach((d) => {
            const outKey = d.alias
              ? resolveLocalizedText(d.alias, activeLocale)
              : d.field.name;
            keyRecord[outKey] = record[d.field.name];
          });
          groups.set(groupKey, { keyRecord, items: [] });
        }
        groups.get(groupKey)!.items.push(record);
      }

      // Aggregate each group
      groups.forEach(({ keyRecord, items }) => {
        const row: ReportRow = { ...keyRecord };

        for (const m of measures) {
          const outKey = m.alias
            ? resolveLocalizedText(m.alias, activeLocale)
            : m.field.name;
          row[outKey] = this.computeAggregation(items, m.field.name, m.aggregation);
        }

        processedRows.push(row);
      });
    } else {
      // No group by dimensions: aggregate entire dataset or output flat rows
      const filtered = rawRecords.filter((r) =>
        this.matchesFilters(r, selected, definition.filters, activeLocale),
      );

      if (measures.length > 0 && measures.some((m) => m.aggregation !== 'none')) {
        const summaryRow: ReportRow = {};
        for (const m of measures) {
          const outKey = m.alias
            ? resolveLocalizedText(m.alias, activeLocale)
            : m.field.name;
          summaryRow[outKey] = this.computeAggregation(filtered, m.field.name, m.aggregation);
        }
        processedRows.push(summaryRow);
      } else {
        processedRows = filtered.map((r) => {
          const row: ReportRow = {};
          for (const f of selected) {
            const outKey = f.alias
              ? resolveLocalizedText(f.alias, activeLocale)
              : f.field.name;
            row[outKey] = r[f.field.name];
          }
          return row;
        });
      }
    }

    // 4. Apply Sorting
    const sortField = selected.find((f) => f.sortDirection);
    if (sortField) {
      const sortKey = sortField.alias
        ? resolveLocalizedText(sortField.alias, activeLocale)
        : sortField.field.name;
      const isAsc = sortField.sortDirection === 'asc';
      processedRows.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return isAsc ? valA - valB : valB - valA;
        }
        return isAsc
          ? String(valA ?? '').localeCompare(String(valB ?? ''))
          : String(valB ?? '').localeCompare(String(valA ?? ''));
      });
    }

    // 5. Generate Data Points for Graphs and KPI Cards
    const dataPoints: ReportDataPoint[] = this.buildDataPoints(
      definition,
      processedRows,
      columns,
      activeLocale,
    );

    // 6. Metrics Summary
    const metricsSummary: Record<string, number | string> = {};
    measures.forEach((m) => {
      const outKey = m.alias
        ? resolveLocalizedText(m.alias, activeLocale)
        : m.field.name;
      const values = processedRows.map((r) => Number(r[outKey]) || 0);
      const total = values.reduce((sum, v) => sum + v, 0);
      metricsSummary[outKey] = this.formatValue(total, m.columnFormat, m.field, activeLocale);
    });

    return {
      id: reportId,
      title: resolveLocalizedText(definition.title, activeLocale, 'Untitled Report'),
      description: resolveLocalizedText(definition.description, activeLocale, ''),
      artifactType: definition.artifactType,
      graphType: definition.graphType,
      generatedAt: new Date(),
      columns,
      rows: processedRows,
      dataPoints,
      summary: {
        totalRows: processedRows.length,
        metricsSummary,
      },
      locale: activeLocale,
    };
  }

  /**
   * Evaluates if a record satisfies all configured field filters,
   * taking into account localized display values and active locale.
   */
  matchesFilters(
    record: Record<string, unknown>,
    fields: SelectedField[],
    customFilters: FieldFilter[] | undefined,
    locale: string,
  ): boolean {
    // 1. Evaluate selected field inline filters
    for (const f of fields) {
      if (f.filterValue === undefined || f.filterValue === null || f.filterValue === '') {
        continue;
      }
      const rawVal = record[f.field.name];
      const satisfies = evaluateFieldFilter(
        rawVal,
        {
          fieldName: f.field.name,
          operator: f.filterOperator ?? 'eq',
          value: f.filterValue,
          matchTarget: f.filterMatchTarget ?? 'both',
          locale,
        },
        {
          mapping: f.field.valueMapping,
          customResolver: f.field.getDisplayValue,
          activeLocale: locale,
        },
      );
      if (!satisfies) return false;
    }

    // 2. Evaluate explicit definition filters if any
    if (customFilters && customFilters.length > 0) {
      for (const filter of customFilters) {
        const rawVal = record[filter.fieldName];
        const fieldDef = fields.find((s) => s.field.name === filter.fieldName)?.field;
        const satisfies = evaluateFieldFilter(rawVal, filter, {
          mapping: fieldDef?.valueMapping,
          customResolver: fieldDef?.getDisplayValue,
          activeLocale: locale,
        });
        if (!satisfies) return false;
      }
    }

    return true;
  }

  /**
   * Computes an aggregation for a numeric or distinct field.
   */
  computeAggregation(
    items: Record<string, unknown>[],
    fieldName: string,
    type: SelectedField['aggregation'],
  ): number {
    if (items.length === 0) return 0;

    switch (type) {
      case 'count':
        return items.length;
      case 'countDistinct':
        return new Set(items.map((i) => i[fieldName])).size;
      case 'sum':
        return items.reduce((acc, i) => acc + (Number(i[fieldName]) || 0), 0);
      case 'avg': {
        const sum = items.reduce((acc, i) => acc + (Number(i[fieldName]) || 0), 0);
        return Math.round((sum / items.length) * 100) / 100;
      }
      case 'min':
        return Math.min(...items.map((i) => Number(i[fieldName]) || 0));
      case 'max':
        return Math.max(...items.map((i) => Number(i[fieldName]) || 0));
      case 'none':
      default:
        return Number(items[0]?.[fieldName]) || 0;
    }
  }

  /**
   * Builds chart/KPI data points from aggregated rows.
   */
  private buildDataPoints(
    definition: DesignerSelectionState,
    rows: ReportRow[],
    columns: ReportColumn[],
    locale: string,
  ): ReportDataPoint[] {
    const dimCol = columns.find((c) =>
      definition.fields.some((f) => f.groupBy && (f.alias ?? f.field.name) === c.key),
    );
    const measureCol = columns.find((c) =>
      definition.fields.some((f) => !f.groupBy && (f.alias ?? f.field.name) === c.key),
    );

    if (!measureCol) {
      return [];
    }

    const colors = [
      '#3b82f6',
      '#10b981',
      '#8b5cf6',
      '#f59e0b',
      '#ec4899',
      '#06b6d4',
      '#f97316',
      '#6366f1',
    ];

    if (!dimCol) {
      // Single overall metric (e.g. Executive KPI card)
      const primaryValue = rows.length > 0 ? rows[0][measureCol.key] : 0;
      const numVal = typeof primaryValue === 'number' ? primaryValue : Number(primaryValue) || 0;
      return [
        {
          key: 'primary',
          label: measureCol.label,
          value: numVal,
          formattedValue: this.formatValue(numVal, measureCol.format, measureCol.field, locale),
          color: colors[0],
        },
      ];
    }

    const points: ReportDataPoint[] = [];
    rows.forEach((row, idx) => {
      const rawVal = row[dimCol.key];
      const label = dimCol.field
        ? this.localization.resolveDisplayValue(rawVal, dimCol.field)
        : String(rawVal ?? '');
      const numVal = Number(row[measureCol.key]) || 0;

      points.push({
        key: `pt-${idx}`,
        label,
        value: numVal,
        displayValue: label,
        formattedValue: this.formatValue(numVal, measureCol.format, measureCol.field, locale),
        color: colors[idx % colors.length],
      });
    });

    return points;
  }

  /**
   * Formats a raw value based on ColumnFormat and active locale.
   */
  formatValue(
    value: unknown,
    format?: ColumnFormat,
    field?: Field,
    locale?: string,
  ): string {
    if (locale && locale !== this.localization.activeLocale()) {
      // Temporarily override locale or use Intl directly
      const prev = this.localization.activeLocale();
      this.localization.setLocale(locale);
      const res = this.localization.formatValue(value, format, field);
      this.localization.setLocale(prev);
      return res;
    }
    return this.localization.formatValue(value, format, field);
  }

  /**
   * Exports report to formatted CSV string.
   */
  exportToCsv(report: GeneratedReport): string {
    const header = report.columns.map((c) => `"${c.label.replace(/"/g, '""')}"`).join(',');
    const rows = report.rows.map((r) =>
      report.columns
        .map((c) => {
          const val = r[c.key];
          const formatted = this.formatValue(val, c.format, c.field, report.locale);
          return `"${String(formatted).replace(/"/g, '""')}"`;
        })
        .join(','),
    );
    return [header, ...rows].join('\r\n');
  }

  /**
   * Exports report to formatted JSON string.
   */
  exportToJson(report: GeneratedReport): string {
    return JSON.stringify(
      {
        id: report.id,
        title: report.title,
        generatedAt: report.generatedAt,
        locale: report.locale,
        summary: report.summary,
        columns: report.columns.map((c) => ({ key: c.key, label: c.label, format: c.format })),
        rows: report.rows,
      },
      null,
      2,
    );
  }

  /**
   * Initiates browser download for exported report file.
   */
  downloadFile(content: string, filename: string, mimeType: string): void {
    if (typeof document === 'undefined') return;
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}
