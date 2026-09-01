/**
 * @file rule-group.directive.ts
 * Container directive for managing a shared group of business rules and form state.
 */

import { Directive, input, output, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GpBusinessRule } from '../types/rule.types';

@Directive({
  selector: '[gpRuleGroup]',
  standalone: true
})
export class GpRuleGroupDirective {
  /** Rules registered for this entire group/form */
  public rules = input<GpBusinessRule[]>([], { alias: 'gpRuleGroup' });

  /** Optional reactive form attached to this group */
  public form = input<FormGroup | undefined>(undefined, { alias: 'gpRuleGroupForm' });

  /** Shared state object */
  public state = input<Record<string, any>>({}, { alias: 'gpRuleGroupState' });

  /** Emitted whenever any state field updates within this group */
  public stateChange = output<Record<string, any>>();

  private internalState = signal<Record<string, any>>({});

  public updateState(field: string, value: any): void {
    this.internalState.update((current) => {
      const next = { ...current, [field]: value };
      this.stateChange.emit(next);
      return next;
    });
  }

  public getState(): Record<string, any> {
    return {
      ...(this.state() || {}),
      ...this.internalState()
    };
  }
}
