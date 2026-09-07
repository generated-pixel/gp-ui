import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { GpBadge, GpToast } from 'gp-ui';
import { GpFilterBar, GpFilterCondition } from 'gp-analytics';
import { DocApiTable, DocApiProperty } from '../../../shared/doc-api-table';
import { DocCode } from '../../../shared/doc-code';
import { ANALYTICS_AVAILABLE_FIELDS } from '../analytics-demo-data';

@Component({
  selector: 'app-filter-bar-demo',
  standalone: true,
  imports: [GpBadge, GpToast, GpFilterBar, DocApiTable, DocCode],
  templateUrl: './filter-bar-demo.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterBarDemo {
  protected readonly availableFields = signal(ANALYTICS_AVAILABLE_FIELDS);
  protected readonly filters = signal<GpFilterCondition[]>([]);
  protected readonly quickPresets = signal([
    { label: 'Completed only', condition: { fieldId: 'status', operator: 'eq' as const, value: 'Completed' } },
    { label: 'AMER region', condition: { fieldId: 'region', operator: 'eq' as const, value: 'AMER' } }
  ]);

  protected onFilterChange(filters: GpFilterCondition[]): void {
    this.filters.set(filters);
  }

  protected readonly usageCode = `<gp-filter-bar
  [availableFields]="availableFields()"
  [(filters)]="filters"
  [quickPresets]="quickPresets()"
  dateField="date"
  [showDatePresets]="true"
  (filterChange)="onFilterChange($event)"
/>`;

  protected readonly properties: DocApiProperty[] = [
    { name: 'availableFields', type: 'input<{fieldId: string; label: string}[]>', default: '[]', description: 'Fields offered in the "Add Condition" field picker.' },
    { name: 'filters', type: 'model<GpFilterCondition[]>', default: '[]', kind: 'model', description: 'Two-way active filter conditions.' },
    { name: 'quickPresets', type: 'input<{label: string; condition: GpFilterCondition}[]>', default: '[]', description: 'One-click filter presets rendered as quick-filter chips.' },
    { name: 'dateField', type: 'input<string>', default: "'order_date'", description: 'Field ID used by the built-in date range quick presets.' },
    { name: 'showDatePresets', type: 'input<boolean>', default: 'true', description: 'Whether the built-in Today/Last 7 days/Last 30 days presets are shown.' }
  ];

  protected readonly events: DocApiProperty[] = [
    { name: 'filterChange', type: 'output<GpFilterCondition[]>', description: 'Emitted whenever the active filter conditions change.' }
  ];
}
