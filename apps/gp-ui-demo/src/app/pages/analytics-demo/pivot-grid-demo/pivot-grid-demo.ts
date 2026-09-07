import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { GpBadge, GpToast } from 'gp-ui';
import { GpMeasureQuery, GpPivotGrid } from 'gp-analytics';
import { DocApiTable, DocApiProperty } from '../../../shared/doc-api-table';
import { DocCode } from '../../../shared/doc-code';
import { ANALYTICS_SAMPLE_RECORDS } from '../analytics-demo-data';

@Component({
  selector: 'app-pivot-grid-demo',
  standalone: true,
  imports: [GpBadge, GpToast, GpPivotGrid, DocApiTable, DocCode],
  templateUrl: './pivot-grid-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PivotGridDemo {
  protected readonly records = signal(ANALYTICS_SAMPLE_RECORDS);
  protected readonly measure = signal<GpMeasureQuery>({ fieldId: 'total', aggregation: 'sum' });

  protected readonly usageCode = `<gp-pivot-grid
  title="Cross-Tabulation Matrix: Customer by Region"
  [records]="records()"
  rowDimension="customer_name"
  colDimension="region"
  [measure]="measure()"
/>`;

  protected readonly properties: DocApiProperty[] = [
    { name: 'title', type: 'input<string>', default: "'Dynamic Pivot Matrix'", description: 'Pivot grid title.' },
    {
      name: 'records',
      type: 'input<Record<string, any>[]>',
      default: '[]',
      description: 'Source records to aggregate.'
    },
    { name: 'rowDimension', type: 'input<string>', default: "''", description: 'Field ID used as the row axis.' },
    { name: 'colDimension', type: 'input<string>', default: "''", description: 'Field ID used as the column axis.' },
    {
      name: 'measure',
      type: 'input<GpMeasureQuery>',
      default: "{fieldId: 'total', aggregation: 'sum'}",
      description: 'Aggregated measure rendered in each matrix cell.'
    }
  ];

  protected readonly events: DocApiProperty[] = [];
}
