import {
  ChangeDetectionStrategy,
  Component,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { GpAnalyticsComponent } from '../base/gp-analytics-component';
import { GpFilterCondition } from '../../models/query.model';

@Component({
  selector: 'gp-filter-bar',
  standalone: true,
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
