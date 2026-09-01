/**
 * @file rule.directive.ts
 * Directive for attaching dynamic business rules directly to elements and gp-ui components.
 */

import {
  Directive,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy,
  input,
  output,
  inject,
  Optional
} from '@angular/core';
import { FormGroup, NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GpBusinessRule } from '../types/rule.types';
import { GpRuleEventType } from '../types/trigger.types';
import { GpRuleEngineService } from '../engine/rule-engine.service';
import { GpRuleContextFactory } from '../engine/rule-context';
import { GpRuleGroupDirective } from './rule-group.directive';

@Directive({
  selector: '[gpRule], [gpRules]',
  standalone: true
})
export class GpRuleDirective implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private engine = inject(GpRuleEngineService);
  private ngControl = inject(NgControl, { optional: true });
  private ruleGroup = inject(GpRuleGroupDirective, { optional: true });

  /** Single rule or list of rules attached to this element */
  public rule = input<GpBusinessRule | GpBusinessRule[] | undefined>(undefined, { alias: 'gpRule' });
  public rules = input<GpBusinessRule[] | undefined>(undefined, { alias: 'gpRules' });

  /** Target field identifier */
  public fieldName = input<string | undefined>(undefined, { alias: 'gpRuleField' });

  /** Optional explicit form group to bind context against */
  public form = input<FormGroup | undefined>(undefined, { alias: 'gpRuleForm' });

  /** Optional external state dictionary */
  public state = input<Record<string, any> | undefined>(undefined, { alias: 'gpRuleState' });

  /** Emitted whenever a rule executes */
  public ruleExecuted = output<{ ruleId: string; conditionMet: boolean; actions: string[] }>();

  private controlSub?: Subscription;

  ngOnInit(): void {
    // If bound to a form control with valueChanges, wire change trigger
    if (this.ngControl && this.ngControl.valueChanges) {
      this.controlSub = this.ngControl.valueChanges.subscribe((val) => {
        this.dispatch('valueChange', val);
      });
    }

    // Trigger 'init' event
    this.dispatch('init', this.getFieldValue());
  }

  ngOnDestroy(): void {
    this.controlSub?.unsubscribe();
  }

  @HostListener('input', ['$event'])
  public onInput(event: Event): void {
    const val = (event.target as HTMLInputElement)?.value;
    this.dispatch('input', val, event);
    this.dispatch('keypress', val, event);
  }

  @HostListener('keydown', ['$event'])
  public onKeyDown(event: KeyboardEvent): void {
    const val = (event.target as HTMLInputElement)?.value;
    this.dispatch('keydown', val, event);
  }

  @HostListener('keyup', ['$event'])
  public onKeyUp(event: KeyboardEvent): void {
    const val = (event.target as HTMLInputElement)?.value;
    this.dispatch('keyup', val, event);
  }

  @HostListener('blur', ['$event'])
  public onBlur(event: FocusEvent): void {
    const val = this.getFieldValue();
    this.dispatch('blur', val, event);
    this.dispatch('focusout', val, event);
  }

  @HostListener('focus', ['$event'])
  public onFocus(event: FocusEvent): void {
    const val = this.getFieldValue();
    this.dispatch('focus', val, event);
    this.dispatch('focusin', val, event);
  }

  @HostListener('change', ['$event'])
  public onChange(event: Event): void {
    const val = (event.target as HTMLInputElement)?.value;
    this.dispatch('change', val, event);
  }

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {
    const val = this.getFieldValue();
    this.dispatch('click', val, event);
  }

  /**
   * Dispatch trigger to the rule engine.
   */
  public async dispatch(eventType: GpRuleEventType, triggerValue?: any, originalEvent?: Event): Promise<void> {
    const activeRules = this.getEffectiveRules();
    if (!activeRules || activeRules.length === 0) {
      return;
    }

    const effectiveForm = this.form() || this.ruleGroup?.form() || (this.ngControl?.control?.parent as FormGroup);
    const effectiveState = {
      ...(this.ruleGroup?.state() || {}),
      ...(this.state() || {})
    };

    const targetField = this.fieldName() || this.ngControl?.name?.toString();

    const context = GpRuleContextFactory.create({
      state: effectiveState,
      form: effectiveForm,
      triggerEvent: eventType,
      triggerValue: triggerValue !== undefined ? triggerValue : this.getFieldValue(),
      originalEvent,
      onStateChange: (field, val) => {
        if (this.ruleGroup) {
          this.ruleGroup.updateState(field, val);
        }
      }
    });

    const logs = await this.engine.dispatchEvent(eventType, context, targetField, activeRules);

    logs.forEach((log) => {
      this.ruleExecuted.emit({
        ruleId: log.ruleId,
        conditionMet: log.conditionMet,
        actions: log.actionsExecuted
      });
    });
  }

  private getEffectiveRules(): GpBusinessRule[] {
    const r = this.rule();
    const rs = this.rules();
    const groupRules = this.ruleGroup?.rules() || [];

    const list: GpBusinessRule[] = [];
    if (r) {
      if (Array.isArray(r)) {
        list.push(...r);
      } else {
        list.push(r);
      }
    }
    if (rs) {
      list.push(...rs);
    }
    list.push(...groupRules);
    return list;
  }

  private getFieldValue(): any {
    if (this.ngControl && this.ngControl.value !== undefined) {
      return this.ngControl.value;
    }
    const inputEl = this.elementRef.nativeElement;
    if (inputEl && 'value' in inputEl) {
      return inputEl.value;
    }
    return undefined;
  }
}
