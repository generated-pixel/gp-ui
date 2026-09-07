import { ChangeDetectionStrategy, Component, computed, input, model, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GpBlockUI, GpButton, GpInputTextDirective, GpSelect } from '@generatedpixel/gp-ui';
import { GpAnalyticsComponent } from '../../base/gp-analytics-component';
import { GpFilterCondition } from '../../../models/query.model';

@Component({
  selector: 'gp-filter-bar',
  standalone: true,
  imports: [FormsModule, GpButton, GpInputTextDirective, GpBlockUI, GpSelect],
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GpFilterBar extends GpAnalyticsComponent {
  readonly availableFields = input<{ fieldId: string; label: string }[]>([]);
  readonly filters = model<GpFilterCondition[]>([]);
  readonly quickPresets = input<{ label: string; condition: GpFilterCondition }[]>([]);
  readonly dateField = input<string>('order_date');
  readonly showDatePresets = input<boolean>(true);

  readonly filterChange = output<GpFilterCondition[]>();

  protected readonly isAddingCondition = signal<boolean>(false);
  protected readonly selectedField = signal<string>('');
  protected readonly selectedOperator = signal<string>('eq');
  protected readonly filterValue = signal<string>('');
  protected readonly filterValueTo = signal<string>('');

  protected readonly fieldOptions = computed(() =>
    this.availableFields().map((f) => ({ label: f.label, value: f.fieldId }))
  );

  protected readonly operatorOptions = [
    { label: 'Equals (=)', value: 'eq' },
    { label: 'Does not equal (≠)', value: 'neq' },
    { label: 'Greater than (>)', value: 'gt' },
    { label: 'Greater or equal (≥)', value: 'gte' },
    { label: 'Less than (<)', value: 'lt' },
    { label: 'Less or equal (≤)', value: 'lte' },
    { label: 'Between Range (from / to)', value: 'between' },
    { label: 'Contains', value: 'contains' },
    { label: 'Starts with', value: 'startsWith' },
    { label: 'In List (comma separated)', value: 'in' }
  ];

  /**
   * Applies pre-computed temporal date range filter condition.
   */
  applyDatePreset(presetKey: 'today' | 'last7' | 'last30' | 'mtd' | 'ytd'): void {
    const targetField = this.resolveDateField();
    const now = new Date();
    const toIsoDate = (d: Date) => d.toISOString().slice(0, 10);
    const todayStr = toIsoDate(now);

    let condition: GpFilterCondition;

    switch (presetKey) {
      case 'today':
        condition = { fieldId: targetField, operator: 'eq', value: todayStr };
        break;
      case 'last7': {
        const d = new Date(now);
        d.setDate(d.getDate() - 7);
        condition = { fieldId: targetField, operator: 'between', value: [toIsoDate(d), todayStr] };
        break;
      }
      case 'last30': {
        const d = new Date(now);
        d.setDate(d.getDate() - 30);
        condition = { fieldId: targetField, operator: 'between', value: [toIsoDate(d), todayStr] };
        break;
      }
      case 'mtd': {
        const d = new Date(now.getFullYear(), now.getMonth(), 1);
        condition = { fieldId: targetField, operator: 'between', value: [toIsoDate(d), todayStr] };
        break;
      }
      case 'ytd': {
        const d = new Date(now.getFullYear(), 0, 1);
        condition = { fieldId: targetField, operator: 'between', value: [toIsoDate(d), todayStr] };
        break;
      }
    }

    const current = this.filters().filter((f) => f.fieldId !== targetField);
    const result = [...current, condition];
    this.filters.set(result);
    this.filterChange.emit(result);
  }

  private resolveDateField(): string {
    if (this.dateField()) {
return this.dateField();
}
    const fields = this.availableFields();
    const matched = fields.find((f) => /date|time|created|timestamp/i.test(f.fieldId));
    return matched ? matched.fieldId : fields[0]?.fieldId || 'order_date';
  }

  protected applyQuickPreset(preset: { label: string; condition: GpFilterCondition }): void {
    const current = this.filters();
    // Replace if same field exists, otherwise append
    const updated = current.filter((f) => f.fieldId !== preset.condition.fieldId);
    const result = [...updated, preset.condition];
    this.filters.set(result);
    this.filterChange.emit(result);
  }

  protected removeFilter(index: number): void {
    const current = [...this.filters()];
    current.splice(index, 1);
    this.filters.set(current);
    this.filterChange.emit(current);
  }

  protected clearAllFilters(): void {
    this.filters.set([]);
    this.filterChange.emit([]);
  }

  protected openAddModal(): void {
    const fields = this.availableFields();
    if (fields.length > 0) {
      this.selectedField.set(fields[0].fieldId);
    }
    this.filterValue.set('');
    this.filterValueTo.set('');
    this.isAddingCondition.set(true);
  }

  protected addCondition(): void {
    const fieldId = this.selectedField();
    const op = this.selectedOperator() as any;
    const val = this.filterValue().trim();
    if (!fieldId || !val) {
return;
}

    let finalVal: any = val;
    if (op === 'between') {
      const valTo = this.filterValueTo().trim();
      if (!valTo) {
return;
}
      finalVal = [val, valTo];
    } else if (op === 'in') {
      finalVal = val
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const condition: GpFilterCondition = {
      fieldId,
      operator: op,
      value: finalVal
    };

    const updated = [...this.filters(), condition];
    this.filters.set(updated);
    this.filterChange.emit(updated);
    this.isAddingCondition.set(false);
  }
}
