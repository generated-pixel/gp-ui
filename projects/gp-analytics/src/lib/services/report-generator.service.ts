import { Injectable } from '@angular/core';
import {
  ColumnFormat,
  DesignerSelectionState,
  GeneratedReport,
  ReportColumn,
  ReportDataPoint,
  ReportRow,
  SelectedField,
} from '../models/designer.models';

@Injectable({
  providedIn: 'root',
})
export class ReportGeneratorService {
  /**
   * Generates a complete report artifact from a designer specification and dataset.
   */
  generateReport(
    definition: DesignerSelectionState,
    rawRecords: Record<string, unknown>[],
  ): GeneratedReport {
    const reportId = `rep-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const selected = definition.fields;

    // 1. Separate GroupBy dimensions and Aggregation measures
    const dimensions = selected.filter((f) => f.groupBy);
    const measures = selected.filter((f) => !f.groupBy);

    // 2. Define Output Columns
    const columns: ReportColumn[] = selected.map((f) => ({
      key: f.alias ?? f.field.name,
      label: f.alias ?? f.field.label ?? f.field.name,
      dataType: f.field.dataType,
      format: f.columnFormat ?? f.field.defaultFormat ?? 'default',
      aggregation: f.aggregation,
    }));

    // 3. Process Rows (Grouping & Aggregation)
    let processedRows: ReportRow[] = [];

    if (dimensions.length > 0) {
      // Grouping map
      const groups = new Map<string, { keyRecord: Record<string, unknown>; items: Record<string, unknown>[] }>();

      for (const record of rawRecords) {
        // Evaluate filter if specified
        if (!this.matchesFilters(record, selected)) {
          continue;
        }

        const groupKey = dimensions.map((d) => String(record[d.field.name] ?? '')).join('|||');
        if (!groups.has(groupKey)) {
          const keyRecord: Record<string, unknown> = {};
          dimensions.forEach((d) => {
            const outKey = d.alias ?? d.field.name;
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
          const outKey = m.alias ?? m.field.name;
          row[outKey] = this.computeAggregation(items, m.field.name, m.aggregation);
        }

        processedRows.push(row);
      });
    } else {
      // No group by dimensions: aggregate entire dataset or output flat rows
      const filtered = rawRecords.filter((r) => this.matchesFilters(r, selected));

      if (measures.length > 0 && measures.some((m) => m.aggregation !== 'none')) {
        const summaryRow: ReportRow = {};
        for (const m of measures) {
          const outKey = m.alias ?? m.field.name;
          summaryRow[outKey] = this.computeAggregation(filtered, m.field.name, m.aggregation);
        }
        processedRows.push(summaryRow);
      } else {
        processedRows = filtered.map((r) => {
          const row: ReportRow = {};
          for (const f of selected) {
            const outKey = f.alias ?? f.field.name;
            row[outKey] = r[f.field.name];
          }
          return row;
        });
      }
    }

    // 4. Apply Sorting
    const sortField = selected.find((f) => f.sortDirection);
    if (sortField) {
      const sortKey = sortField.alias ?? sortField.field.name;
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
    const dataPoints: ReportDataPoint[] = this.buildDataPoints(definition, processedRows, columns);

    // 6. Metrics Summary
    const metricsSummary: Record<string, number | string> = {};
    measures.forEach((m) => {
      const outKey = m.alias ?? m.field.name;
      const values = processedRows.map((r) => Number(r[outKey]) || 0);
      const total = values.reduce((sum, v) => sum + v, 0);
      metricsSummary[outKey] = this.formatValue(total, m.columnFormat);
    });

    return {
      id: reportId,
      title: definition.title || 'Untitled Report',
      description: definition.description,
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
      rawDefinition: definition,
    };
  }

  /**
   * Evaluates if a record satisfies all configured field filters.
   */
  private matchesFilters(record: Record<string, unknown>, fields: SelectedField[]): boolean {
    for (const f of fields) {
      if (f.filterValue === undefined || f.filterValue === null || f.filterValue === '') {
        continue;
      }

      const val = record[f.field.name];
      const op = f.filterOperator ?? 'eq';
      const target = f.filterValue;

      switch (op) {
        case 'eq':
          if (String(val).toLowerCase() !== String(target).toLowerCase()) return false;
          break;
        case 'neq':
          if (String(val).toLowerCase() === String(target).toLowerCase()) return false;
          break;
        case 'contains':
          if (!String(val).toLowerCase().includes(String(target).toLowerCase())) return false;
          break;
        case 'gt':
          if (Number(val) <= Number(target)) return false;
          break;
        case 'lt':
          if (Number(val) >= Number(target)) return false;
          break;
        case 'gte':
          if (Number(val) < Number(target)) return false;
          break;
        case 'lte':
          if (Number(val) > Number(target)) return false;
          break;
      }
    }
    return true;
  }

  /**
   * Computes an aggregation for a numeric or distinct field.
   */
  private computeAggregation(items: Record<string, unknown>[], fieldName: string, type: SelectedField['aggregation']): number {
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
   * Constructs visualization data points.
   */
  private buildDataPoints(
    definition: DesignerSelectionState,
    rows: ReportRow[],
    columns: ReportColumn[],
  ): ReportDataPoint[] {
    const points: ReportDataPoint[] = [];
    const dimCol = columns.find((c) => c.dataType === 'string' || c.dataType === 'date') ?? columns[0];
    const measureCol = columns.find((c) => c.dataType === 'number') ?? columns[1] ?? columns[0];

    if (!dimCol || !measureCol) return points;

    const colors = [
      '#38bdf8', '#818cf8', '#34d399', '#f472b6',
      '#fb923c', '#a78bfa', '#facc15', '#4ade80'
    ];

    rows.forEach((row, idx) => {
      const label = String(row[dimCol.key] ?? `Row ${idx + 1}`);
      const rawVal = row[measureCol.key];
      const numVal = Number(rawVal) || 0;
      points.push({
        key: `pt-${idx}`,
        label,
        value: numVal,
        formattedValue: this.formatValue(numVal, measureCol.format),
        color: colors[idx % colors.length],
      });
    });

    return points;
  }

  /**
   * Formats a raw value based on ColumnFormat.
   */
  formatValue(value: unknown, format?: ColumnFormat): string {
    if (value === null || value === undefined) return '-';
    const num = Number(value);

    switch (format) {
      case 'currency':
        return isNaN(num)
          ? String(value)
          : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
      case 'percent':
        return isNaN(num)
          ? String(value)
          : `${(num * (num <= 1 ? 100 : 1)).toFixed(1)}%`;
      case 'number-0':
        return isNaN(num) ? String(value) : Math.round(num).toLocaleString();
      case 'number-2':
        return isNaN(num) ? String(value) : num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      case 'date-short':
        return new Date(String(value)).toLocaleDateString();
      case 'date-long':
        return new Date(String(value)).toLocaleDateString(undefined, { dateStyle: 'long' });
      case 'default':
      default:
        return typeof value === 'number' ? value.toLocaleString() : String(value);
    }
  }

  /**
   * Exports report to CSV string.
   */
  exportToCsv(report: GeneratedReport): string {
    const header = report.columns.map((c) => `"${c.label.replace(/"/g, '""')}"`).join(',');
    const rows = report.rows.map((r) =>
      report.columns
        .map((c) => {
          const val = r[c.key];
          const formatted = this.formatValue(val, c.format);
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
