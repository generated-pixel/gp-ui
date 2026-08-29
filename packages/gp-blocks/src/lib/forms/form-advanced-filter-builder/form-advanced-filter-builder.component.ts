import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  GpButtonComponent,
  GpInputTextComponent,
  GpSelectComponent,
  GpIconComponent
} from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-form-advanced-filter-builder',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GpButtonComponent,
    GpInputTextComponent,
    GpSelectComponent,
    GpIconComponent
  ],
  templateUrl: './form-advanced-filter-builder.component.html',
  styleUrl: './form-advanced-filter-builder.component.scss'
})
export class GpFormAdvancedFilterBuilderComponent {
  @Input() title = 'Advanced Condition Filter Builder';

  conditions = [
    { field: 'status', operator: 'equals', value: 'Active' },
    { field: 'amount', operator: 'greater', value: '1000' }
  ];

  addCondition() {
    this.conditions.push({ field: 'customer', operator: 'contains', value: '' });
  }

  removeCondition(idx: number) {
    if (this.conditions.length > 1) {
      this.conditions.splice(idx, 1);
    }
  }

  resetFilters() {
    this.conditions = [{ field: 'status', operator: 'equals', value: 'Active' }];
  }
}
