import { Component, input, output, signal, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GpButtonComponent, GpIconComponent, GpInputTextComponent, GpSelectComponent } from '@generatedpixel/gp-ui';

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
  imports: [CommonModule, FormsModule, GpButtonComponent, GpIconComponent, GpInputTextComponent, GpSelectComponent],
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

  @Input() public headerTemplate?: TemplateRef<any>;
  @Input() public conditionRowTemplate?: TemplateRef<{ $implicit: GpFilterCondition; index: number }>;
  @Input() public actionsTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('header') public contentHeader?: TemplateRef<any>;
  @ContentChild('conditionRowTemplate') public contentConditionRowTemplate?: TemplateRef<{ $implicit: GpFilterCondition; index: number }>;
  @ContentChild('actions') public contentActions?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveHeader(): TemplateRef<any> | undefined {
    return this.headerTemplate || this.contentHeader;
  }

  public get effectiveConditionRowTemplate(): TemplateRef<{ $implicit: GpFilterCondition; index: number }> | undefined {
    return this.conditionRowTemplate || this.contentConditionRowTemplate;
  }

  public get effectiveActions(): TemplateRef<any> | undefined {
    return this.actionsTemplate || this.contentActions;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }

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
