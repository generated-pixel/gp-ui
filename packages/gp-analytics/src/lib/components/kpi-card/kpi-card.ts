import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { GpAnalyticsComponent } from '../base/gp-analytics-component';

@Component({
  selector: 'gp-kpi-card',
  standalone: true,
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GpKpiCard extends GpAnalyticsComponent {
  readonly title = input<string>('Metric');
  readonly value = input<number | string>(0);
  readonly formattedValue = input<string | null>(null);
  readonly previousValue = input<number | null>(null);
  readonly variancePercentage = input<number | null>(null);
  readonly trend = input<'up' | 'down' | 'neutral'>('neutral');
  readonly severity = input<'success' | 'danger' | 'info' | 'warning'>('info');
  readonly targetValue = input<number | null>(null);
  readonly targetProgress = input<number | null>(null);
  readonly sparklinePoints = input<number[]>([]);
  readonly icon = input<string>('📊');
  readonly unit = input<string>('');

  protected readonly hoveredPointIndex = signal<number | null>(null);

  /**
   * Display string for the metric value.
   */
  readonly displayValue = computed(() => {
    if (this.formattedValue()) {
      return this.formattedValue()!;
    }
    const val = this.value();
    if (typeof val === 'number') {
      return val.toLocaleString('en-US');
    }
    return String(val);
  });

  /**
   * Generates SVG path coordinates for smooth sparkline curve.
   */
  readonly sparklineSvg = computed<{ path: string; areaPath: string; points: { x: number; y: number; val: number }[] }>(() => {
    const raw = this.sparklinePoints();
    if (!raw || raw.length < 2) {
      return { path: '', areaPath: '', points: [] };
    }

    const width = 140;
    const height = 40;
    const padding = 4;

    const min = Math.min(...raw);
    const max = Math.max(...raw);
    const range = max - min === 0 ? 1 : max - min;

    const coords = raw.map((val, idx) => {
      const x = padding + (idx / (raw.length - 1)) * (width - padding * 2);
      const y = height - padding - ((val - min) / range) * (height - padding * 2);
      return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)), val };
    });

    // Build cubic bezier path
    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const curr = coords[i];
      const next = coords[i + 1];
      const cpx1 = curr.x + (next.x - curr.x) / 2;
      const cpy1 = curr.y;
      const cpx2 = curr.x + (next.x - curr.x) / 2;
      const cpy2 = next.y;
      d += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${next.x} ${next.y}`;
    }

    const area = `${d} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`;

    return { path: d, areaPath: area, points: coords };
  });

  onSparklineHover(index: number | null): void {
    this.hoveredPointIndex.set(index);
  }
}
