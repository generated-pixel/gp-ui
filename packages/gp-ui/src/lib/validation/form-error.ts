import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { GpEditableBase } from '../base/gp-editable-base';
import { GpValidationError } from './types';
import { GpIcon } from '../icons/icon';

/**
 * Component to display validation error messages for gp-ui form controls.
 * Supports direct binding to a control instance or an error array/string.
 */
@Component({
  selector: 'gp-form-error',
  standalone: true,
  imports: [GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './form-error.html',
  styleUrl: './form-error.scss'
})
export class GpFormError {
  /** Target control to observe for validation errors */
  public control = input<GpEditableBase | undefined>();

  /** Explicit errors array */
  public errors = input<GpValidationError[] | string[] | null | undefined>();

  /** Single error message override */
  public message = input<string | null | undefined>();

  /** Whether to show only the first error or all errors (defaults to true) */
  public showFirstOnly = input<boolean>(true);

  public hasErrors(): boolean {
    if (this.message()) {
      return true;
    }
    const ctrl = this.control();
    if (ctrl) {
      return ctrl.isInvalid();
    }
    const errs = this.errors();
    if (errs && errs.length > 0) {
      return true;
    }
    return false;
  }

  public firstErrorMessage(): string | null {
    const msg = this.message();
    if (msg) {
      return msg;
    }
    const ctrl = this.control();
    if (ctrl) {
      return ctrl.firstError();
    }
    const errs = this.errors();
    if (errs && errs.length > 0) {
      const first = errs[0];
      return typeof first === 'string' ? first : first.message;
    }
    return null;
  }

  public getErrorList(): GpValidationError[] {
    const msg = this.message();
    if (msg) {
      return [{ rule: 'explicit', message: msg }];
    }
    const ctrl = this.control();
    if (ctrl) {
      return ctrl.errors();
    }
    const errs = this.errors();
    if (errs) {
      return errs.map((err) => (typeof err === 'string' ? { rule: 'explicit', message: err } : err));
    }
    return [];
  }
}
