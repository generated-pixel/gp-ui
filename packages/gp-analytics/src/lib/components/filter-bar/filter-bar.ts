import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GpButton, GpInputTextDirective, GpSelect } from '@generatedpixel/gp-ui';
import { GpAnalyticsComponent } from '../base/gp-analytics-component';
import { GpFilterCondition } from '../../models/query.model';

@Component({
  selector: 'gp-filter-bar',
  standalone: true,
  imports: [FormsModule, GpButton, GpInputTextDirective, GpSelect],
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GpFilterBar extends GpAnalyticsComponent {
  readonly availableFields = input<{ fieldId: string; label: string }[]>([]);
  readonly filters = model<GpFilterCondition[]>([]);
  readonly quickPresets = input<{ label: string; condition: GpFilterCondition }[]>([]);

  readonly filterChange = output<GpFilterCondition[]>();

  protected readonly isAddingCondition = signal<boolean>(false);
  protected readonly selectedField = signal<string>('');
  protected readonly selectedOperator = signal<string>('eq');
  protected readonly filterValue = signal<string>('');

  protected readonly fieldOptions = computed(() =>
    this.availableFields().map((f) => ({ label: f.label, value: f.fieldId }))
  );

  protected readonly operatorOptions = [
    { label: 'Equals (=)', value: 'eq' },
    { label: 'Does not equal (≠)', value: 'neq' },
    { label: 'Greater than (>)', value: 'gt' },
    { label: 'Less than (<)', value: 'lt' },
    { label: 'Contains', value: 'contains' },
  ];

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
    this.isAddingCondition.set(true);
  }

  protected addCondition(): void {
    const fieldId = this.selectedField();
    const val = this.filterValue().trim();
    if (!fieldId || !val) return;

    const condition: GpFilterCondition = {
      fieldId,
      operator: this.selectedOperator() as any,
      value: val,
    };

    const updated = [...this.filters(), condition];
    this.filters.set(updated);
    this.filterChange.emit(updated);
    this.isAddingCondition.set(false);
  }
}
