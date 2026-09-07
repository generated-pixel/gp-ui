import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { GpBadge, GpToast } from 'gp-ui';
import { GpMeasureQuery, GpTabularReport } from 'gp-analytics';
import { DocApiTable, DocApiProperty } from '../../../shared/doc-api-table';
import { DocCode } from '../../../shared/doc-code';
import { ANALYTICS_SAMPLE_RECORDS } from '../analytics-demo-data';

@Component({
  selector: 'app-tabular-report-demo',
  standalone: true,
  imports: [GpBadge, GpToast, GpTabularReport, DocApiTable, DocCode],
  templateUrl: './tabular-report-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabularReportDemo {
  protected readonly records = signal(ANALYTICS_SAMPLE_RECORDS);
  protected readonly dimensions = signal(['region', 'customer_name']);
  protected readonly measures = signal<GpMeasureQuery[]>([
    { fieldId: 'total', aggregation: 'sum', alias: 'revenue' },
    { fieldId: 'quantity', aggregation: 'sum', alias: 'total_units' }
  ]);

  protected readonly usageCode = `<gp-tabular-report
  title="Enterprise Revenue Rollup"
  subtitle="Aggregated by Region and Customer with subtotal rollups"
  [records]="records()"
  [dimensions]="dimensions()"
  [measures]="measures()"
  [showSubtotals]="true"
  [showGrandTotal]="true"
/>`;

  protected readonly properties: DocApiProperty[] = [
    { name: 'title', type: 'input<string>', default: "'Tabular Analytical Report'", description: 'Report title.' },
    { name: 'subtitle', type: 'input<string>', default: "'Aggregated enterprise reporting with subtotal rollups'", description: 'Report subtitle.' },
    { name: 'records', type: 'input<Record<string, any>[]>', default: '[]', description: 'Source records to aggregate.' },
    { name: 'dimensions', type: 'input<string[]>', default: '[]', description: 'Field IDs used to group rows, in nesting order.' },
    { name: 'measures', type: 'input<GpMeasureQuery[]>', default: '[]', description: 'Aggregated measures rendered as columns.' },
    { name: 'showSubtotals', type: 'input<boolean>', default: 'true', description: 'Whether subtotal rows are rendered for each dimension group.' },
    { name: 'showGrandTotal', type: 'input<boolean>', default: 'true', description: 'Whether a grand total row is rendered.' }
  ];

  protected readonly events: DocApiProperty[] = [];
}
