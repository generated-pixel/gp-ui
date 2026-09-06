import { Injectable } from '@angular/core';
import {
  GpAnalyticalQuerySpec,
  GpAggregationResult,
  GpFilterCondition,
  GpKpiMetricResult,
  GpMeasureQuery,
  GpPivotMatrix,
  GpSortSpec,
} from '../models/query.model';

@Injectable({ providedIn: 'root' })
export class GpDataEngineService {
  /**
   * Executes an analytical query against an in-memory dataset of records.
   * Performs filtering, multi-dimensional grouping, measure aggregation,
   * subtotal rollups, grand totals, and sorting.
   */
  executeQuery(
    records: Record<string, any>[],
    spec: GpAnalyticalQuerySpec,
  ): GpAggregationResult {
    const startTime = performance.now();

    if (!records || records.length === 0) {
      return {
        rows: [],
        totalCount: 0,
        subtotals: [],
        grandTotal: {},
        querySpec: spec,
        executionTimeMs: 0,
      };
    }

    // 1. Filter Records
    let filtered = this.applyFilters(records, spec.filters);

    // 2. Grouping & Aggregations
    let aggregatedRows: Record<string, any>[];
    let subtotals: Record<string, any>[] = [];

    if (spec.dimensions && spec.dimensions.length > 0) {
      const groupedMap = new Map<string, Record<string, any>[]>();

      for (const rec of filtered) {
        const groupKey = spec.dimensions.map((d) => String(rec[d] ?? 'N/A')).join('___');
        if (!groupedMap.has(groupKey)) {
          groupedMap.set(groupKey, []);
        }
        groupedMap.get(groupKey)!.push(rec);
      }

      aggregatedRows = [];
      for (const [key, groupRows] of groupedMap.entries()) {
        const row: Record<string, any> = {
          _id: `group-${key}`,
          _count: groupRows.length,
        };

        // Populate dimension values from the first record
        for (const dim of spec.dimensions) {
          row[dim] = groupRows[0][dim];
        }

        // Compute measures
        for (const measure of spec.measures) {
          const alias = measure.alias || `${measure.fieldId}_${measure.aggregation}`;
          row[alias] = this.computeMeasure(groupRows, measure);
        }

        aggregatedRows.push(row);
      }

      // Compute Subtotals if multi-dimensional
      if (spec.dimensions.length > 1) {
        subtotals = this.computeSubtotals(filtered, spec);
      }
    } else {
      // No dimensions -> Aggregate entire dataset into single row
      const singleRow: Record<string, any> = {
        _id: 'summary-row',
        _count: filtered.length,
      };
      for (const measure of spec.measures) {
        const alias = measure.alias || `${measure.fieldId}_${measure.aggregation}`;
        singleRow[alias] = this.computeMeasure(filtered, measure);
      }
      aggregatedRows = [singleRow];
    }

    // 3. Compute Grand Total
    const grandTotal: Record<string, any> = {
      _id: 'grand-total',
      _count: filtered.length,
    };
    for (const measure of spec.measures) {
      const alias = measure.alias || `${measure.fieldId}_${measure.aggregation}`;
      grandTotal[alias] = this.computeMeasure(filtered, measure);
    }

    // 4. Sort Aggregated Rows
    if (spec.sorts && spec.sorts.length > 0) {
      aggregatedRows = this.applySorting(aggregatedRows, spec.sorts);
    }

    // 5. Pagination
    const totalCount = aggregatedRows.length;
    let paginatedRows = aggregatedRows;
    if (spec.pagination) {
      const start = (spec.pagination.page - 1) * spec.pagination.pageSize;
      paginatedRows = aggregatedRows.slice(start, start + spec.pagination.pageSize);
    }

    const executionTimeMs = Number((performance.now() - startTime).toFixed(2));

    return {
      rows: paginatedRows,
      totalCount,
      subtotals,
      grandTotal,
      querySpec: spec,
      executionTimeMs,
    };
  }

  /**
   * Computes an Executive KPI Metric Result with variance, trend, target progress, and sparkline points.
   */
  computeKpiMetric(
    records: Record<string, any>[],
    measure: GpMeasureQuery,
    title: string,
    options?: {
      previousRecords?: Record<string, any>[];
      targetValue?: number;
      timeFieldId?: string;
      formatCurrency?: boolean;
    },
  ): GpKpiMetricResult {
    const currentVal = this.computeMeasure(records, measure);
    let prevVal: number | undefined = undefined;
    let varianceAbs: number | undefined = undefined;
    let variancePct: number | undefined = undefined;
    let trend: 'up' | 'down' | 'neutral' = 'neutral';
    let trendSeverity: 'success' | 'danger' | 'info' | 'warning' = 'info';

    if (options?.previousRecords && options.previousRecords.length > 0) {
      prevVal = this.computeMeasure(options.previousRecords, measure);
      varianceAbs = Number((currentVal - prevVal).toFixed(2));
      if (prevVal !== 0) {
        variancePct = Number((((currentVal - prevVal) / Math.abs(prevVal)) * 100).toFixed(1));
      } else {
        variancePct = currentVal > 0 ? 100 : 0;
      }

      if (variancePct > 0) {
        trend = 'up';
        trendSeverity = 'success';
      } else if (variancePct < 0) {
        trend = 'down';
        trendSeverity = 'danger';
      }
    }

    let targetProgress: number | undefined = undefined;
    if (options?.targetValue && options.targetValue > 0) {
      targetProgress = Number(((currentVal / options.targetValue) * 100).toFixed(1));
    }

    // Sparkline Generation: partition records chronologically or in buckets
    const sparklinePoints = this.generateSparklinePoints(records, measure, options?.timeFieldId);

    const formattedCurrentValue = options?.formatCurrency
      ? `$${currentVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : currentVal.toLocaleString('en-US');

    return {
      metricId: `kpi_${measure.fieldId}_${measure.aggregation}`,
      title,
      currentValue: currentVal,
      formattedCurrentValue,
      previousValue: prevVal,
      varianceAbsolute: varianceAbs,
      variancePercentage: variancePct,
      trend,
      trendSeverity,
      targetValue: options?.targetValue,
      targetProgressPercentage: targetProgress,
      sparklinePoints,
    };
  }

  /**
   * Generates a 2D Pivot Matrix cross-tabulating row dimensions by column dimensions.
   */
  buildPivotMatrix(
    records: Record<string, any>[],
    rowDim: string,
    colDim: string,
    measure: GpMeasureQuery,
  ): GpPivotMatrix {
    const rowKeysSet = new Set<string>();
    const colKeysSet = new Set<string>();

    for (const rec of records) {
      if (rec[rowDim] != null) rowKeysSet.add(String(rec[rowDim]));
      if (rec[colDim] != null) colKeysSet.add(String(rec[colDim]));
    }

    const rowHeaders = Array.from(rowKeysSet).sort();
    const colHeaders = Array.from(colKeysSet).sort();

    // Group buckets
    const cellMap = new Map<string, Record<string, any>[]>();
    for (const rec of records) {
      const r = String(rec[rowDim] ?? 'N/A');
      const c = String(rec[colDim] ?? 'N/A');
      const key = `${r}___${c}`;
      if (!cellMap.has(key)) {
        cellMap.set(key, []);
      }
      cellMap.get(key)!.push(rec);
    }

    const matrix: (number | null)[][] = [];
    const rowTotals: (number | null)[] = [];

    for (const r of rowHeaders) {
      const rowValues: (number | null)[] = [];
      let rowSum = 0;
      let hasVal = false;

      for (const c of colHeaders) {
        const key = `${r}___${c}`;
        const items = cellMap.get(key);
        if (items && items.length > 0) {
          const val = this.computeMeasure(items, measure);
          rowValues.push(val);
          rowSum += val;
          hasVal = true;
        } else {
          rowValues.push(null);
        }
      }

      matrix.push(rowValues);
      rowTotals.push(hasVal ? Number(rowSum.toFixed(2)) : null);
    }

    // Column totals
    const colTotals: (number | null)[] = [];
    let grandTotalSum = 0;
    for (let cIdx = 0; cIdx < colHeaders.length; cIdx++) {
      let colSum = 0;
      let colHasVal = false;
      for (let rIdx = 0; rIdx < rowHeaders.length; rIdx++) {
        const val = matrix[rIdx][cIdx];
        if (typeof val === 'number') {
          colSum += val;
          colHasVal = true;
        }
      }
      colTotals.push(colHasVal ? Number(colSum.toFixed(2)) : null);
      grandTotalSum += colSum;
    }

    return {
      rowHeaders,
      colHeaders,
      matrix,
      rowTotals,
      colTotals,
      grandTotal: Number(grandTotalSum.toFixed(2)),
    };
  }

  /**
   * Compiles an analytical query specification into an ANSI SQL string.
   */
  generateSql(spec: GpAnalyticalQuerySpec, tableName: string = 'analytics_dataset'): string {
    const selectClauses: string[] = [];

    for (const dim of spec.dimensions) {
      selectClauses.push(`"${dim}"`);
    }

    for (const m of spec.measures) {
      const alias = m.alias || `${m.fieldId}_${m.aggregation}`;
      const sqlAgg = m.aggregation === 'count-distinct' ? 'COUNT(DISTINCT' : `${m.aggregation.toUpperCase()}(`;
      selectClauses.push(`${sqlAgg} "${m.fieldId}") AS "${alias}"`);
    }

    let sql = `SELECT\n  ${selectClauses.join(',\n  ')}\nFROM "${tableName}"`;

    if (spec.filters && spec.filters.length > 0) {
      const whereClauses: string[] = [];
      for (const f of spec.filters) {
        whereClauses.push(this.formatSqlFilter(f));
      }
      sql += `\nWHERE\n  ${whereClauses.join('\n  AND ')}`;
    }

    if (spec.dimensions && spec.dimensions.length > 0) {
      sql += `\nGROUP BY\n  ${spec.dimensions.map((d) => `"${d}"`).join(', ')}`;
    }

    if (spec.sorts && spec.sorts.length > 0) {
      const sortClauses = spec.sorts.map((s) => `"${s.fieldId}" ${s.order.toUpperCase()}`);
      sql += `\nORDER BY\n  ${sortClauses.join(', ')}`;
    }

    if (spec.pagination) {
      const offset = (spec.pagination.page - 1) * spec.pagination.pageSize;
      sql += `\nLIMIT ${spec.pagination.pageSize} OFFSET ${offset}`;
    }

    return sql;
  }

  applyFilters(records: Record<string, any>[], filters?: GpFilterCondition[]): Record<string, any>[] {
    if (!filters || filters.length === 0) {
      return records;
    }

    return records.filter((rec) => {
      for (const filter of filters) {
        let val = rec[filter.fieldId];
        if (val === undefined) {
          const lower = filter.fieldId.toLowerCase();
          const altKey = Object.keys(rec).find(
            (k) => k.toLowerCase() === lower || k.toLowerCase().endsWith('.' + lower) || lower.endsWith('.' + k.toLowerCase())
          );
          if (altKey) {
            val = rec[altKey];
          }
        }
        if (!this.matchesFilter(val, filter)) {
          return false;
        }
      }
      return true;
    });
  }

  matchesFilter(val: any, filter: GpFilterCondition): boolean {
    switch (filter.operator) {
      case 'eq':
        return val === filter.value || String(val) === String(filter.value);
      case 'neq':
        return val !== filter.value && String(val) !== String(filter.value);
      case 'gt':
        return Number(val) > Number(filter.value);
      case 'gte':
        return Number(val) >= Number(filter.value);
      case 'lt':
        return Number(val) < Number(filter.value);
      case 'lte':
        return Number(val) <= Number(filter.value);
      case 'between':
        return Number(val) >= Number(filter.value) && Number(val) <= Number(filter.secondValue);
      case 'in':
        return Array.isArray(filter.value) && filter.value.map(String).includes(String(val));
      case 'contains':
        return String(val ?? '').toLowerCase().includes(String(filter.value ?? '').toLowerCase());
      case 'startsWith':
        return String(val ?? '').toLowerCase().startsWith(String(filter.value ?? '').toLowerCase());
      case 'isNull':
        return val == null;
      case 'isNotNull':
        return val != null;
      default:
        return true;
    }
  }

  private computeMeasure(records: Record<string, any>[], measure: GpMeasureQuery): number {
    if (!records || records.length === 0) {
      return 0;
    }

    if (measure.aggregation === 'count') {
      return records.length;
    }

    if (measure.aggregation === 'count-distinct') {
      const set = new Set();
      for (const r of records) {
        if (r[measure.fieldId] != null) set.add(r[measure.fieldId]);
      }
      return set.size;
    }

    const numbers = records
      .map((r) => Number(r[measure.fieldId]))
      .filter((n) => !isNaN(n));

    if (numbers.length === 0) {
      return 0;
    }

    switch (measure.aggregation) {
      case 'sum':
        return Number(numbers.reduce((acc, v) => acc + v, 0).toFixed(2));
      case 'avg':
        return Number((numbers.reduce((acc, v) => acc + v, 0) / numbers.length).toFixed(2));
      case 'min':
        return Number(Math.min(...numbers).toFixed(2));
      case 'max':
        return Number(Math.max(...numbers).toFixed(2));
      case 'median': {
        const sorted = [...numbers].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        const med = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
        return Number(med.toFixed(2));
      }
      case 'variance': {
        const mean = numbers.reduce((acc, v) => acc + v, 0) / numbers.length;
        const squareDiffs = numbers.map((value) => Math.pow(value - mean, 2));
        const variance = squareDiffs.reduce((acc, v) => acc + v, 0) / numbers.length;
        return Number(variance.toFixed(2));
      }
      case 'stddev': {
        const mean = numbers.reduce((acc, v) => acc + v, 0) / numbers.length;
        const squareDiffs = numbers.map((value) => Math.pow(value - mean, 2));
        const variance = squareDiffs.reduce((acc, v) => acc + v, 0) / numbers.length;
        return Number(Math.sqrt(variance).toFixed(2));
      }
      default:
        return 0;
    }
  }

  private computeSubtotals(records: Record<string, any>[], spec: GpAnalyticalQuerySpec): Record<string, any>[] {
    const primaryDim = spec.dimensions[0];
    const map = new Map<string, Record<string, any>[]>();

    for (const rec of records) {
      const key = String(rec[primaryDim] ?? 'N/A');
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(rec);
    }

    const subtotals: Record<string, any>[] = [];
    for (const [key, rows] of map.entries()) {
      const subtotalRow: Record<string, any> = {
        _isSubtotal: true,
        [primaryDim]: key,
        _count: rows.length,
      };

      for (const measure of spec.measures) {
        const alias = measure.alias || `${measure.fieldId}_${measure.aggregation}`;
        subtotalRow[alias] = this.computeMeasure(rows, measure);
      }

      subtotals.push(subtotalRow);
    }

    return subtotals;
  }

  private applySorting(records: Record<string, any>[], sorts: GpSortSpec[]): Record<string, any>[] {
    return [...records].sort((a, b) => {
      for (const sort of sorts) {
        const valA = a[sort.fieldId];
        const valB = b[sort.fieldId];

        if (valA === valB) continue;
        if (valA == null) return 1;
        if (valB == null) return -1;

        const orderFactor = sort.order === 'asc' ? 1 : -1;

        if (typeof valA === 'number' && typeof valB === 'number') {
          return (valA - valB) * orderFactor;
        }

        const cmp = String(valA).localeCompare(String(valB));
        if (cmp !== 0) {
          return cmp * orderFactor;
        }
      }
      return 0;
    });
  }

  private generateSparklinePoints(
    records: Record<string, any>[],
    measure: GpMeasureQuery,
    timeFieldId?: string,
  ): number[] {
    if (!records || records.length === 0) {
      return [0, 0, 0, 0, 0];
    }

    const numPoints = Math.min(12, Math.max(5, records.length));
    const chunkSize = Math.max(1, Math.floor(records.length / numPoints));
    const points: number[] = [];

    for (let i = 0; i < records.length; i += chunkSize) {
      const chunk = records.slice(i, i + chunkSize);
      points.push(this.computeMeasure(chunk, measure));
    }

    return points;
  }

  private formatSqlFilter(filter: GpFilterCondition): string {
    const f = `"${filter.fieldId}"`;
    switch (filter.operator) {
      case 'eq':
        return `${f} = '${filter.value}'`;
      case 'neq':
        return `${f} <> '${filter.value}'`;
      case 'gt':
        return `${f} > ${filter.value}`;
      case 'gte':
        return `${f} >= ${filter.value}`;
      case 'lt':
        return `${f} < ${filter.value}`;
      case 'lte':
        return `${f} <= ${filter.value}`;
      case 'between':
        return `${f} BETWEEN ${filter.value} AND ${filter.secondValue}`;
      case 'in': {
        const inVals = (Array.isArray(filter.value) ? filter.value : [filter.value])
          .map((v) => `'${v}'`)
          .join(', ');
        return `${f} IN (${inVals})`;
      }
      case 'contains':
        return `${f} ILIKE '%${filter.value}%'`;
      case 'isNull':
        return `${f} IS NULL`;
      case 'isNotNull':
        return `${f} IS NOT NULL`;
      default:
        return '1 = 1';
    }
  }
}
