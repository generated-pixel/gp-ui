import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { GpAnalyticsComponent } from '../base/gp-analytics-component';
import { GpCategoricalChartData } from '../../models/query.model';

import { GpTag } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-analytical-chart',
  standalone: true,
  imports: [GpTag],
  templateUrl: './analytical-chart.html',
  styleUrl: './analytical-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GpAnalyticalChart extends GpAnalyticsComponent {
  readonly title = input<string>('Analytical Visualization');
  readonly subtitle = input<string>('');
  readonly type = input<'bar' | 'donut' | 'line'>('bar');
  readonly data = input<GpCategoricalChartData | null>(null);
  readonly stacked = input<boolean>(false);

  protected readonly hoveredIndex = signal<number | null>(null);
  readonly hiddenSeries = signal<Set<string>>(new Set());

  readonly palette = [
    '#4f46e5', // Primary Indigo
    '#0ea5e9', // Sky Blue
    '#10b981', // Emerald Green
    '#f59e0b', // Amber
    '#ec4899', // Pink
    '#8b5cf6', // Purple
  ];

  toggleSeries(seriesName: string): void {
    const current = new Set(this.hiddenSeries());
    if (current.has(seriesName)) {
      current.delete(seriesName);
    } else {
      current.add(seriesName);
    }
    this.hiddenSeries.set(current);
  }

  readonly activeSeries = computed(() => {
    const d = this.data();
    if (!d || !d.series) return [];
    return d.series.filter((s) => !this.hiddenSeries().has(s.name));
  });

  /**
   * Multi-series bar groupings per category.
   */
  readonly barCategories = computed(() => {
    const d = this.data();
    if (!d || !d.categories || d.categories.length === 0) return [];
    const active = this.activeSeries();
    if (active.length === 0) return [];

    const isStacked = this.stacked();

    // Compute max for scale
    let maxScale = 1;
    if (isStacked) {
      for (let i = 0; i < d.categories.length; i++) {
        const catSum = active.reduce((acc, s) => acc + (s.data[i] ?? 0), 0);
        if (catSum > maxScale) maxScale = catSum;
      }
    } else {
      for (const s of active) {
        const sMax = Math.max(...s.data, 0);
        if (sMax > maxScale) maxScale = sMax;
      }
    }

    return d.categories.map((cat, catIdx) => {
      const seriesBars = active.map((s, sIdx) => {
        const val = s.data[catIdx] ?? 0;
        const heightPct = Math.max(2, Number(((val / maxScale) * 100).toFixed(1)));
        const color = this.palette[sIdx % this.palette.length];
        return {
          seriesName: s.name,
          value: val,
          heightPct,
          color,
        };
      });

      return {
        category: cat,
        seriesBars,
      };
    });
  });

  /**
   * Bar Chart Calculations (Single primary series fallback)
   */
  readonly barItems = computed(() => {
    const d = this.data();
    if (!d || !d.categories || d.categories.length === 0 || !d.series || d.series.length === 0) {
      return [];
    }

    const primarySeries = this.activeSeries()[0] || d.series[0];
    const maxVal = Math.max(...primarySeries.data, 1);

    return d.categories.map((cat, idx) => {
      const val = primarySeries.data[idx] ?? 0;
      const heightPct = Math.max(4, Number(((val / maxVal) * 100).toFixed(1)));
      const color = this.palette[idx % this.palette.length];
      return {
        label: cat,
        value: val,
        heightPct,
        color,
      };
    });
  });

  /**
   * Donut Chart Calculations
   */
  readonly donutSlices = computed(() => {
    const d = this.data();
    if (!d || !d.categories || d.categories.length === 0 || !d.series || d.series.length === 0) {
      return { total: 0, slices: [] };
    }

    const primarySeries = d.series[0];
    const total = primarySeries.data.reduce((acc, v) => acc + v, 0);
    if (total === 0) return { total: 0, slices: [] };

    let currentAngle = 0;
    const slices = d.categories.map((cat, idx) => {
      const val = primarySeries.data[idx] ?? 0;
      const pct = (val / total) * 100;
      const angle = (val / total) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      currentAngle = endAngle;

      const path = this.describeDonutArc(50, 50, 42, 26, startAngle, endAngle);
      const color = this.palette[idx % this.palette.length];

      return {
        label: cat,
        value: val,
        percentage: Number(pct.toFixed(1)),
        path,
        color,
      };
    });

    return { total, slices };
  });

  /**
   * Line Chart Calculations
   */
  readonly lineSvg = computed(() => {
    const d = this.data();
    if (!d || !d.categories || d.categories.length === 0 || !d.series || d.series.length === 0) {
      return { path: '', area: '', points: [] };
    }

    const primary = d.series[0];
    const max = Math.max(...primary.data, 1);
    const min = Math.min(...primary.data, 0);
    const range = max - min === 0 ? 1 : max - min;

    const width = 300;
    const height = 120;
    const pad = 12;

    const points = primary.data.map((val, idx) => {
      const x = pad + (idx / (primary.data.length - 1)) * (width - pad * 2);
      const y = height - pad - ((val - min) / range) * (height - pad * 2);
      return {
        x: Number(x.toFixed(1)),
        y: Number(y.toFixed(1)),
        val,
        label: d.categories[idx],
      };
    });

    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const cpx1 = curr.x + (next.x - curr.x) / 2;
      const cpy1 = curr.y;
      const cpx2 = curr.x + (next.x - curr.x) / 2;
      const cpy2 = next.y;
      path += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${next.x} ${next.y}`;
    }

    const area = `${path} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

    return { path, area, points };
  });

  private describeDonutArc(
    cx: number,
    cy: number,
    rOuter: number,
    rInner: number,
    startAngle: number,
    endAngle: number,
  ): string {
    const rad = Math.PI / 180;
    const startRad = (startAngle - 90) * rad;
    const endRad = (endAngle - 90) * rad;

    const x1 = cx + rOuter * Math.cos(startRad);
    const y1 = cy + rOuter * Math.sin(startRad);
    const x2 = cx + rOuter * Math.cos(endRad);
    const y2 = cy + rOuter * Math.sin(endRad);

    const x3 = cx + rInner * Math.cos(endRad);
    const y3 = cy + rInner * Math.sin(endRad);
    const x4 = cx + rInner * Math.cos(startRad);
    const y4 = cy + rInner * Math.sin(startRad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  }
}
