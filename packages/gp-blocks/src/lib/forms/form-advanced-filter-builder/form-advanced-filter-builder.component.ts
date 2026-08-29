import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpFilterBuilderOption {
  label: string;
  value: string;
}

export interface GpFilterCondition {
  field: string;
  operator: string;
  value: string;
}

@Component({
  selector: 'gp-form-advanced-filter-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, GpButtonComponent, GpIconComponent],
  templateUrl: './form-advanced-filter-builder.component.html',
  styleUrl: './form-advanced-filter-builder.component.scss'
})
export class GpFormAdvancedFilterBuilderComponent {
  public title = input<string>('');
  public addConditionBtnLabel = input<string>('Add Condition');
  public clearBtnLabel = input<string>('Clear All');
  public applyBtnLabel = input<string>('Apply Query Filters');

  public fieldOptions = input<GpFilterBuilderOption[]>([
    { label: 'Status', value: 'status' },
    { label: 'User Role', value: 'role' },
    { label: 'Organization', value: 'org' },
    { label: 'Total Spend', value: 'spent' }
  ]);

  public operatorOptions = input<GpFilterBuilderOption[]>([
    { label: 'Equals (=)', value: 'eq' },
    { label: 'Contains (LIKE)', value: 'contains' },
    { label: 'Greater Than (>)', value: 'gt' },
    { label: 'Less Than (<)', value: 'lt' }
  ]);

  public conditions = signal<GpFilterCondition[]>([]);

  public applyFilter = output<GpFilterCondition[]>();
  public resetFilter = output<void>();

  public addCondition(): void {
    this.conditions.update(c => [
      ...c,
      { field: 'status', operator: 'eq', value: '' }
    ]);
  }

  public removeCondition(idx: number): void {
    this.conditions.update(c => c.filter((_, i) => i !== idx));
  }

  public resetFilters(): void {
    this.conditions.set([]);
    this.resetFilter.emit();
  }

  public onApply(): void {
    this.applyFilter.emit(this.conditions());
  }
}
