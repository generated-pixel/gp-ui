import { Component, ChangeDetectionStrategy, ViewEncapsulation, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GpButton, GpInputText, GpSelect, GpIcon, GpInputNumber } from '@generatedpixel/gp-ui';
import { GpBusinessRule } from '../../types/rule.types';
import { GpRuleEventType } from '../../types/trigger.types';
import { GpRuleOperator } from '../../types/condition.types';
import { GpRuleActionType, GpTransformType } from '../../types/action.types';

@Component({
  selector: 'gp-rule-builder',
  standalone: true,
  imports: [CommonModule, FormsModule, GpButton, GpInputText, GpSelect, GpIcon, GpInputNumber],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './rule-builder.html',
  styleUrl: './rule-builder.scss'
})
export class GpRuleBuilder {
  public ruleCreated = output<GpBusinessRule>();

  public ruleId = signal<string>('custom-rule-' + Math.floor(Math.random() * 1000));
  public ruleName = signal<string>('Dynamic Custom Rule');
  public category = signal<string>('custom');
  public priority = signal<number>(10);

  public triggerEvent = signal<GpRuleEventType>('keypress');
  public debounceMs = signal<number>(300);

  public compareMode = signal<'staticValue' | 'compareToField'>('staticValue');
  public conditionField = signal<string>('code');
  public conditionOperator = signal<GpRuleOperator>('eq');
  public conditionValue = signal<string>('VIP100');
  public compareToField = signal<string>('confirmCode');

  public actionType = signal<GpRuleActionType>('setValue');
  public actionTarget = signal<string>('discount');
  public actionValue = signal<string>('100');
  public fromField = signal<string>('');
  public transformType = signal<GpTransformType>('uppercase');

  public enableElseAction = signal<boolean>(false);
  public elseActionType = signal<GpRuleActionType>('setValue');
  public elseActionTarget = signal<string>('discount');
  public elseActionValue = signal<string>('0');

  public triggerOptions = [
    { label: 'Keypress / Input (with Debounce)', value: 'keypress' },
    { label: 'Blur (Lose Focus)', value: 'blur' },
    { label: 'Value Change', value: 'change' },
    { label: 'Button Click', value: 'click' },
    { label: 'Focus (Gain Focus)', value: 'focus' },
    { label: 'Init / Mount', value: 'init' }
  ];

  public compareModeOptions = [
    { label: 'Compare to Static Value', value: 'staticValue' },
    { label: 'Compare with Another Field', value: 'compareToField' }
  ];

  public operatorOptions = [
    { label: 'Equals (=)', value: 'eq' },
    { label: 'Not Equals (!=)', value: 'neq' },
    { label: 'Greater Than (>)', value: 'gt' },
    { label: 'Less Than (<)', value: 'lt' },
    { label: 'Greater Than or Equal (>=)', value: 'gte' },
    { label: 'Less Than or Equal (<=)', value: 'lte' },
    { label: 'Contains', value: 'contains' },
    { label: 'Starts With', value: 'startsWith' },
    { label: 'Ends With', value: 'endsWith' },
    { label: 'Matches (Regex)', value: 'matches' },
    { label: 'Length Greater Than', value: 'lengthGt' },
    { label: 'Is After Date', value: 'isAfter' },
    { label: 'Is Before Date', value: 'isBefore' },
    { label: 'Is Truthy', value: 'truthy' },
    { label: 'Is Empty', value: 'empty' },
    { label: 'Is Not Empty', value: 'notEmpty' }
  ];

  public actionOptions = [
    { label: 'Set Field Value', value: 'setValue' },
    { label: 'Calculate / Formula (SUM, IF, etc.)', value: 'compute' },
    { label: 'Transform String (slugify, uppercase...)', value: 'transformValue' },
    { label: 'Copy From Field', value: 'copyValue' },
    { label: 'Set Validation Error', value: 'setValidationError' },
    { label: 'Clear Validation Error', value: 'clearValidationError' },
    { label: 'Set CSS Class', value: 'setClass' },
    { label: 'Set Focus', value: 'setFocus' },
    { label: 'Show Component', value: 'show' },
    { label: 'Hide Component', value: 'hide' },
    { label: 'Enable Control', value: 'enable' },
    { label: 'Disable Control', value: 'disable' },
    { label: 'Show Toast Notification', value: 'toast' }
  ];

  public transformOptions = [
    { label: 'Slugify (URL-friendly)', value: 'slugify' },
    { label: 'Uppercase', value: 'uppercase' },
    { label: 'Lowercase', value: 'lowercase' },
    { label: 'Titlecase', value: 'titlecase' },
    { label: 'Trim Whitespace', value: 'trim' },
    { label: 'Format Currency', value: 'currency' },
    { label: 'Format Phone', value: 'phone' }
  ];

  public onCreateRule(): void {
    const isDebounced = this.triggerEvent() === 'keypress' || this.triggerEvent() === 'input';

    const rule: GpBusinessRule = {
      id: this.ruleId(),
      name: this.ruleName(),
      category: this.category(),
      priority: this.priority(),
      trigger: {
        event: this.triggerEvent(),
        debounce: isDebounced ? this.debounceMs() : undefined
      },
      condition: {
        field: this.conditionField(),
        operator: this.conditionOperator(),
        value: this.compareMode() === 'staticValue' ? this.conditionValue() : undefined,
        compareToField: this.compareMode() === 'compareToField' ? this.compareToField() : undefined
      },
      actions: [
        {
          type: this.actionType(),
          target: this.actionTarget(),
          value: this.actionValue(),
          fromField: this.fromField() || undefined,
          transformType: this.actionType() === 'transformValue' ? this.transformType() : undefined,
          message: this.actionType() === 'toast' ? `Rule "${this.ruleName()}" executed!` : undefined,
          formula: this.actionType() === 'compute' ? this.actionValue() : undefined,
          errorKey: this.actionType() === 'setValidationError' ? 'ruleError' : undefined,
          errorMessage: this.actionType() === 'setValidationError' ? this.actionValue() : undefined,
          className: this.actionType() === 'setClass' ? this.actionValue() : undefined
        }
      ],
      elseActions: this.enableElseAction()
        ? [
            {
              type: this.elseActionType(),
              target: this.elseActionTarget(),
              value: this.elseActionValue(),
              formula: this.elseActionType() === 'compute' ? this.elseActionValue() : undefined
            }
          ]
        : undefined
    };

    this.ruleCreated.emit(rule);
  }
}
