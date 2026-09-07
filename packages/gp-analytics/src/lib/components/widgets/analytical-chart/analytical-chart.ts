import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { GpAnalyticsBaseWidget } from '../../base/gp-analytics-base-widget';
import { GpCategoricalChartData } from '../../../models/query.model';
import { GpBlockUI, GpButton, GpTag } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-analytical-chart',
  standalone: true,
  imports: [GpButton, GpTag, GpBlockUI],
  templateUrl: './analytical-chart.html',
  styleUrl: './analytical-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GpAnalyticalChart extends GpAnalyticsBaseWidget {
  override readonly title = input<string>('Analytical Visualization');
  override readonly subtitle = input<string>('');
  readonly type = input<'bar' | 'donut' | 'line'>('bar');
  readonly data = input<GpCategoricalChartData | null>(null);
  readonly stacked = input<boolean>(false);
  readonly enableSvgExport = input<boolean>(true);

  protected readonly hoveredIndex = signal<number | null>(null);
  readonly hiddenSeries = signal<Set<string>>(new Set());

  readonly palette = [
    '#4f46e5', // Primary Indigo
    '#0ea5e9', // Sky Blue
    '#10b981', // Emerald Green
    '#f59e0b', // Amber
    '#ec4899', // Pink
    '#8b5cf6' // Purple
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
          color
        };
      });

      return {
        category: cat,
        seriesBars
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
        color
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
        color
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
        label: d.categories[idx]
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
    endAngle: number
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

  /**
   * Generates a complete standalone SVG document representing the current chart visualization.
   */
  generateSvgContent(): string {
    const titleText = this.title() || 'Analytical Visualization';
    const chartType = this.type();

    if (chartType === 'donut') {
      const donut = this.donutSlices();
      const slicesMarkup = donut.slices
        .map(
          (s) => `<path d="${s.path}" fill="${s.color}"><title>${s.label}: ${s.value} (${s.percentage}%)</title></path>`
        )
        .join('\n    ');

      const legendMarkup = donut.slices
        .map((s, i) => {
          const y = 300 + i * 22;
          return `<circle cx="60" cy="${y}" r="6" fill="${s.color}"/>
        <text x="75" y="${y + 4}" font-family="system-ui, sans-serif" font-size="12" fill="#475569">${s.label} (${s.percentage}%)</text>`;
        })
        .join('\n    ');

      return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 520" width="500" height="520">
  <rect width="100%" height="100%" fill="#ffffff" rx="8"/>
  <text x="250" y="40" text-anchor="middle" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="#0f172a">${titleText}</text>
  <g transform="translate(150, 70) scale(2)">
    ${slicesMarkup}
    <text x="50" y="48" text-anchor="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="bold" fill="#0f172a">${donut.total.toLocaleString()}</text>
    <text x="50" y="58" text-anchor="middle" font-family="system-ui, sans-serif" font-size="7" fill="#64748b">Total</text>
  </g>
  <g transform="translate(0, 40)">
    ${legendMarkup}
  </g>
</svg>`;
    }

    if (chartType === 'line') {
      const line = this.lineSvg();
      const pointsMarkup = line.points
        .map(
          (p) =>
            `<circle cx="${(p.x * 1.8 + 30).toFixed(1)}" cy="${(p.y * 1.8 + 60).toFixed(1)}" r="4" fill="#4f46e5" stroke="#ffffff" stroke-width="2"/>
         <text x="${(p.x * 1.8 + 30).toFixed(1)}" y="290" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">${p.label}</text>`
        )
        .join('\n    ');

      return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 320" width="600" height="320">
  <rect width="100%" height="100%" fill="#ffffff" rx="8"/>
  <text x="300" y="40" text-anchor="middle" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="#0f172a">${titleText}</text>
  <g transform="translate(30, 60) scale(1.8)">
    <path d="${line.area}" fill="rgba(79, 70, 229, 0.15)"/>
    <path d="${line.path}" fill="none" stroke="#4f46e5" stroke-width="3"/>
  </g>
  ${pointsMarkup}
</svg>`;
    }

    // Default: Bar Chart
    const categories = this.barCategories();
    const width = 600;
    const height = 350;
    const padX = 60;
    const padY = 60;
    const plotWidth = width - padX * 2;
    const plotHeight = height - padY * 2;
    const barCount = categories.length;
    const colWidth = barCount > 0 ? plotWidth / barCount : 0;

    const barsMarkup = categories
      .map((cat, cIdx) => {
        const x = padX + cIdx * colWidth + colWidth * 0.15;
        const w = colWidth * 0.7;
        return (
          cat.seriesBars
            .map((b, bIdx) => {
              const subW = w / (cat.seriesBars.length || 1);
              const subX = x + bIdx * subW;
              const bHeight = (b.heightPct / 100) * plotHeight;
              const bY = padY + plotHeight - bHeight;
              return `<rect x="${subX.toFixed(1)}" y="${bY.toFixed(1)}" width="${(subW * 0.9).toFixed(1)}" height="${bHeight.toFixed(1)}" fill="${b.color}" rx="3">
          <title>${cat.category} - ${b.seriesName}: ${b.value}</title>
        </rect>`;
            })
            .join('\n    ') +
          `\n    <text x="${(x + w / 2).toFixed(1)}" y="${height - 25}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" fill="#64748b">${cat.category}</text>`
        );
      })
      .join('\n    ');

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#ffffff" rx="8"/>
  <text x="${width / 2}" y="40" text-anchor="middle" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="#0f172a">${titleText}</text>
  <line x1="${padX}" y1="${padY + plotHeight}" x2="${width - padX}" y2="${padY + plotHeight}" stroke="#e2e8f0" stroke-width="1.5"/>
  ${barsMarkup}
</svg>`;
  }

  /**
   * Triggers browser download of SVG chart snapshot.
   */
  exportSvg(): string {
    const svgContent = this.generateSvgContent();
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      const safeTitle = (this.title() || 'chart').toLowerCase().replace(/[^a-z0-9]+/g, '_');
      link.setAttribute('download', `${safeTitle}.svg`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
    return svgContent;
  }
}
