import {
  Directive,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ContentChildren,
  QueryList,
  ElementRef,
  inject
} from '@angular/core';
import { GpEditableBaseComponent } from '../base/gp-editable-base.component';
import { GpFormSubmitEvent, GpFormInvalidEvent, GpValidationError } from './types';

/**
 * Form management directive that coordinates validation, side effects,
 * server error mapping, and submission handling across all child gp-ui editable components.
 *
 * Usage:
 * ```html
 * <form gpForm #myForm="gpForm" (gpSubmit)="onSubmit($event)" (gpInvalidSubmit)="onInvalid($event)">
 *   <gp-input-text name="email" [validators]="[GpValidators.required(), GpValidators.email()]" />
 *   <gp-button label="Submit" type="submit" />
 * </form>
 * ```
 */
@Directive({
  selector: 'form[gpForm], [gpForm]',
  standalone: true,
  exportAs: 'gpForm'
})
export class GpFormDirective {
  private el = inject(ElementRef);

  /** Manually registered or query-discovered child controls */
  @ContentChildren(GpEditableBaseComponent, { descendants: true })
  protected queryControls?: QueryList<GpEditableBaseComponent>;

  private manualControls: Map<string, GpEditableBaseComponent> = new Map();

  /** Whether to automatically focus the first invalid field on failed submit */
  @Input() autoFocusInvalid = true;

  /** Event emitted when form submission succeeds with valid state */
  @Output() gpSubmit = new EventEmitter<GpFormSubmitEvent>();

  /** Event emitted when form submission is attempted but fails validation */
  @Output() gpInvalidSubmit = new EventEmitter<GpFormInvalidEvent>();

  /**
   * Returns all active controls registered with this form.
   */
  public getControls(): GpEditableBaseComponent[] {
    const list: GpEditableBaseComponent[] = [];
    if (this.queryControls) {
      list.push(...this.queryControls.toArray());
    }
    this.manualControls.forEach((ctrl) => {
      if (!list.includes(ctrl)) {
        list.push(ctrl);
      }
    });
    return list;
  }

  /**
   * Manually registers an editable control.
   */
  public registerControl(control: GpEditableBaseComponent): void {
    const key = control.name || `control_${this.manualControls.size}`;
    this.manualControls.set(key, control);
  }

  /**
   * Unregisters a control.
   */
  public unregisterControl(control: GpEditableBaseComponent): void {
    const key = control.name;
    if (key) {
      this.manualControls.delete(key);
    }
  }

  /**
   * Returns a map of control names to their current values.
   */
  public getValues(): Record<string, any> {
    const values: Record<string, any> = {};
    const controls = this.getControls();
    controls.forEach((ctrl, index) => {
      const key = ctrl.name || `field_${index}`;
      values[key] = ctrl.value;
    });
    return values;
  }

  /**
   * Returns a map of control names to their component instances.
   */
  public getControlsMap(): Record<string, GpEditableBaseComponent> {
    const map: Record<string, GpEditableBaseComponent> = {};
    const controls = this.getControls();
    controls.forEach((ctrl, index) => {
      const key = ctrl.name || `field_${index}`;
      map[key] = ctrl;
    });
    return map;
  }

  /**
   * Returns true if all form controls are currently valid.
   */
  public isValid(): boolean {
    return this.getControls().every((c) => c.isValid());
  }

  /**
   * Returns true if any form control is currently invalid.
   */
  public isInvalid(): boolean {
    return this.getControls().some((c) => c.isInvalid());
  }

  /**
   * Returns true if any async validator or side effect is currently pending.
   */
  public isPending(): boolean {
    return this.getControls().some((c) => c.isPending());
  }

  /**
   * Validates all form controls asynchronously, marking them as touched.
   * Returns true if all controls are valid, false otherwise.
   */
  public async validateAll(): Promise<boolean> {
    const controls = this.getControls();
    const results = await Promise.all(
      controls.map(async (ctrl) => {
        ctrl.markAsTouched();
        return await ctrl.validate();
      })
    );
    return results.every(Boolean);
  }

  /**
   * Maps external / server validation errors (e.g. HTTP 422 API response) onto individual fields.
   * Example:
   * ```ts
   * form.setErrors({
   *   email: 'Email address is already in use',
   *   password: ['Must be at least 8 characters', 'Must contain a number']
   * });
   * ```
   */
  public setErrors(errors: Record<string, string | string[] | GpValidationError[]>): void {
    const map = this.getControlsMap();
    Object.entries(errors).forEach(([fieldName, errVal]) => {
      const control = map[fieldName];
      if (control) {
        if (Array.isArray(errVal)) {
          control.setErrors(errVal as any);
        } else if (typeof errVal === 'string') {
          control.setErrors([errVal]);
        }
      }
    });
  }

  /**
   * Clears all validation errors across all child controls.
   */
  public clearErrors(): void {
    this.getControls().forEach((ctrl) => ctrl.clearErrors());
  }

  /**
   * Resets all child controls to their initial/empty states.
   */
  public reset(): void {
    this.getControls().forEach((ctrl) => ctrl.reset());
  }

  /**
   * Intercepts form submission, runs full validation, and emits gpSubmit or gpInvalidSubmit.
   */
  @HostListener('submit', ['$event'])
  public async handleFormSubmit(event: Event): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    const isValid = await this.validateAll();
    const values = this.getValues();
    const controlsMap = this.getControlsMap();

    if (isValid) {
      this.gpSubmit.emit({
        values,
        controls: controlsMap,
        originalEvent: event
      });
    } else {
      const errors: Record<string, GpValidationError[]> = {};
      let firstInvalidControl: GpEditableBaseComponent | null = null;

      const controls = this.getControls();
      for (const ctrl of controls) {
        if (ctrl.isInvalid()) {
          const key = ctrl.name || 'field';
          errors[key] = ctrl.errors();
          if (!firstInvalidControl) {
            firstInvalidControl = ctrl;
          }
        }
      }

      if (this.autoFocusInvalid && firstInvalidControl) {
        firstInvalidControl.focus();
      }

      this.gpInvalidSubmit.emit({
        errors,
        firstInvalidControl,
        values,
        originalEvent: event
      });
    }
  }
}
