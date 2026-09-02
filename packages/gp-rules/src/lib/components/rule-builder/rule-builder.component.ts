import { Component, ChangeDetectionStrategy, ViewEncapsulation, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  GpButtonComponent,
  GpInputTextComponent,
  GpSelectComponent,
  GpIconComponent,
  GpInputNumberComponent
} from '@generatedpixel/gp-ui';
import { GpBusinessRule } from '../../types/rule.types';
import { GpRuleEventType } from '../../types/trigger.types';
import { GpRuleOperator } from '../../types/condition.types';
import { GpRuleActionType } from '../../types/action.types';

@Component({
  selector: 'gp-rule-builder',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GpButtonComponent,
    GpInputTextComponent,
    GpSelectComponent,
    GpIconComponent,
    GpInputNumberComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './rule-builder.component.html',
  styleUrl: './rule-builder.component.scss'
})
export class GpRuleBuilderComponent {
  public ruleCreated = output<GpBusinessRule>();

  public ruleId = signal<string>('custom-rule-' + Math.floor(Math.random() * 1000));
  public ruleName = signal<string>('Dynamic Custom Rule');
  public triggerEvent = signal<GpRuleEventType>('keypress');
  public debounceMs = signal<number>(300);
  public conditionField = signal<string>('code');
  public conditionOperator = signal<GpRuleOperator>('eq');
  public conditionValue = signal<string>('VIP100');
  public actionType = signal<GpRuleActionType>('setValue');
  public actionTarget = signal<string>('discount');
  public actionValue = signal<string>('100');

  public triggerOptions = [
    { label: 'Keypress / Input (with Debounce)', value: 'keypress' },
    { label: 'Blur (Lose Focus)', value: 'blur' },
    { label: 'Value Change', value: 'change' },
    { label: 'Button Click', value: 'click' },
    { label: 'Focus (Gain Focus)', value: 'focus' }
  ];

  public operatorOptions = [
    { label: 'Equals (=)', value: 'eq' },
    { label: 'Not Equals (!=)', value: 'neq' },
    { label: 'Greater Than (>)', value: 'gt' },
    { label: 'Less Than (<)', value: 'lt' },
    { label: 'Contains', value: 'contains' },
    { label: 'Starts With', value: 'startsWith' },
    { label: 'Matches (Regex)', value: 'matches' },
    { label: 'Is Truthy', value: 'truthy' },
    { label: 'Is Empty', value: 'empty' }
  ];

  public actionOptions = [
    { label: 'Set Field Value', value: 'setValue' },
    { label: 'Show Component', value: 'show' },
    { label: 'Hide Component', value: 'hide' },
    { label: 'Enable Control', value: 'enable' },
    { label: 'Disable Control', value: 'disable' },
    { label: 'Calculate / Formula', value: 'compute' },
    { label: 'Show Toast Notification', value: 'toast' }
  ];

  public onCreateRule(): void {
    const rule: GpBusinessRule = {
      id: this.ruleId(),
      name: this.ruleName(),
      trigger: {
        event: this.triggerEvent(),
        debounce: this.triggerEvent() === 'keypress' || this.triggerEvent() === 'input' ? this.debounceMs() : undefined
      },
      condition: {
        field: this.conditionField(),
        operator: this.conditionOperator(),
        value: this.conditionValue()
      },
      actions: [
        {
          type: this.actionType(),
          target: this.actionTarget(),
          value: this.actionValue(),
          message: this.actionType() === 'toast' ? `Rule "${this.ruleName()}" triggered!` : undefined,
          formula: this.actionType() === 'compute' ? this.actionValue() : undefined
        }
      ]
    };

    this.ruleCreated.emit(rule);
  }
}
