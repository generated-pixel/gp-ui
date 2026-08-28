import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpEditableBaseComponent } from '../base/gp-editable-base.component';
import { GpValidationError } from './types';
import { GpIconComponent } from '../icons/icon.component';

/**
 * Component to display validation error messages for gp-ui form controls.
 * Supports direct binding to a control instance or an error array/string.
 */
@Component({
  selector: 'gp-form-error',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (hasErrors()) {
      <div class="gp-form-error-container" role="alert" aria-live="polite">
        @if (showFirstOnly && firstErrorMessage()) {
          <div class="gp-form-error-item">
            <gp-icon name="alert-circle" size="0.85em" class="gp-form-error-icon" />
            <span class="gp-form-error-text">{{ firstErrorMessage() }}</span>
          </div>
        } @else {
          @for (err of getErrorList(); track err.message) {
            <div class="gp-form-error-item">
              <gp-icon name="alert-circle" size="0.85em" class="gp-form-error-icon" />
              <span class="gp-form-error-text">{{ err.message }}</span>
            </div>
          }
        }
      </div>
    }
  `,
  styles: [
    `
      .gp-form-error-container {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin-top: 0.35rem;
        animation: gp-form-error-slide 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .gp-form-error-item {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        font-size: var(--gp-font-size-xs, 0.75rem);
        font-weight: 500;
        color: var(--gp-danger, #ef4444);
        line-height: 1.3;
      }
      .gp-form-error-icon {
        flex-shrink: 0;
        color: var(--gp-danger, #ef4444);
      }
      @keyframes gp-form-error-slide {
        from {
          opacity: 0;
          transform: translateY(-4px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `
  ]
})
export class GpFormErrorComponent {
  /** Target control to observe for validation errors */
  @Input() control?: GpEditableBaseComponent;

  /** Explicit errors array */
  @Input() errors?: GpValidationError[] | string[] | null;

  /** Single error message override */
  @Input() message?: string | null;

  /** Whether to show only the first error or all errors (defaults to true) */
  @Input() showFirstOnly = true;

  public hasErrors(): boolean {
    if (this.message) {
      return true;
    }
    if (this.control) {
      return this.control.isInvalid();
    }
    if (this.errors && this.errors.length > 0) {
      return true;
    }
    return false;
  }

  public firstErrorMessage(): string | null {
    if (this.message) {
      return this.message;
    }
    if (this.control) {
      return this.control.firstError();
    }
    if (this.errors && this.errors.length > 0) {
      const first = this.errors[0];
      return typeof first === 'string' ? first : first.message;
    }
    return null;
  }

  public getErrorList(): GpValidationError[] {
    if (this.message) {
      return [{ rule: 'explicit', message: this.message }];
    }
    if (this.control) {
      return this.control.errors();
    }
    if (this.errors) {
      return this.errors.map((err) => (typeof err === 'string' ? { rule: 'explicit', message: err } : err));
    }
    return [];
  }
}
