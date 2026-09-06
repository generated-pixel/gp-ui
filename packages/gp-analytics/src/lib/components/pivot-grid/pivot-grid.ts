import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { GpAnalyticsComponent } from '../base/gp-analytics-component';
import { GpDataEngineService } from '../../services/data-engine.service';
import { GpMeasureQuery, GpPivotMatrix } from '../../models/query.model';

import { GpButton } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-pivot-grid',
  standalone: true,
  imports: [GpButton],
  templateUrl: './pivot-grid.html',
  styleUrl: './pivot-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GpPivotGrid extends GpAnalyticsComponent {
  protected readonly engine = inject(GpDataEngineService);

  readonly title = input<string>('Dynamic Pivot Matrix');
  readonly records = input<Record<string, any>[]>([]);
  readonly rowDimension = input<string>('');
  readonly colDimension = input<string>('');
  readonly measure = input<GpMeasureQuery>({ fieldId: 'total', aggregation: 'sum' });

  // Interactive axis override
  protected readonly activeRowDim = signal<string | null>(null);
  protected readonly activeColDim = signal<string | null>(null);

  readonly effectiveRowDim = computed(() => this.activeRowDim() ?? this.rowDimension());
  readonly effectiveColDim = computed(() => this.activeColDim() ?? this.colDimension());

  /**
   * Computed 2D Pivot Matrix.
   */
  readonly pivotMatrix = computed<GpPivotMatrix | null>(() => {
    const data = this.records();
    const rDim = this.effectiveRowDim();
    const cDim = this.effectiveColDim();

    if (!data || data.length === 0 || !rDim || !cDim) {
      return null;
    }

    return this.engine.buildPivotMatrix(data, rDim, cDim, this.measure());
  });

  /**
   * Computes max cell value for relative heatmap background shading.
   */
  readonly maxCellValue = computed<number>(() => {
    const p = this.pivotMatrix();
    if (!p) return 1;

    let max = 0;
    for (const row of p.matrix) {
      for (const val of row) {
        if (typeof val === 'number' && val > max) {
          max = val;
        }
      }
    }
    return max === 0 ? 1 : max;
  });

  swapAxes(): void {
    const currentR = this.effectiveRowDim();
    const currentC = this.effectiveColDim();
    this.activeRowDim.set(currentC);
    this.activeColDim.set(currentR);
  }

  getCellOpacity(val: number | string | null): number {
    if (typeof val !== 'number' || val <= 0) return 0;
    const ratio = val / this.maxCellValue();
    return Math.max(0.08, Math.min(0.7, ratio * 0.7));
  }

  getCellBg(val: number | string | null): string {
    if (typeof val !== 'number' || val <= 0) return 'transparent';
    const percent = Math.round(this.getCellOpacity(val) * 100);
    return `color-mix(in srgb, var(--gp-color-primary, #4f46e5) ${percent}%, transparent)`;
  }
}
