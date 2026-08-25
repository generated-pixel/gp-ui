import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, forwardRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UniqueId } from '../../utils/unique-id';

@Component({
  selector: 'gp-textarea',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GpTextareaComponent),
      multi: true
    }
  ],
  template: `
    <div class="gp-textarea-wrapper" [class.gp-input-invalid]="invalid" [class.gp-input-disabled]="disabled">
      <textarea
        [id]="inputId"
        [rows]="rows"
        [cols]="cols"
        [value]="value()"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [readonly]="readonly"
        [attr.maxlength]="maxlength || null"
        [attr.aria-label]="ariaLabel || placeholder || null"
        [attr.aria-invalid]="invalid"
        [attr.aria-required]="required"
        [class.gp-textarea-auto-resize]="autoResize"
        (input)="onInput($event)"
        (focus)="onFocus($event)"
        (blur)="onBlur($event)"
        class="gp-inputtext gp-textarea"
      ></textarea>

      @if (maxlength && showCounter) {
        <div class="gp-textarea-counter">
          {{ value().length }} / {{ maxlength }}
        </div>
      }
    </div>
  `,
  styles: [`
    .gp-textarea-wrapper {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
    }
    .gp-textarea {
      height: auto;
      min-height: 4.5rem;
      resize: vertical;
      line-height: 1.5;
    }
    .gp-textarea-auto-resize {
      resize: none;
      overflow-y: hidden;
    }
    .gp-textarea-counter {
      font-size: var(--gp-font-size-xs);
      color: var(--gp-text-color-muted);
      text-align: right;
      margin-top: 0.25rem;
    }
  `]
})
export class GpTextareaComponent implements ControlValueAccessor {
  @Input() inputId = UniqueId.generate('textarea_');
  @Input() rows = 3;
  @Input() cols = 30;
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() required = false;
  @Input() invalid = false;
  @Input() autoResize = false;
  @Input() maxlength?: number;
  @Input() showCounter = true;
  @Input() ariaLabel = '';

  @Output() onInputEvent = new EventEmitter<Event>();
  @Output() onFocusEvent = new EventEmitter<FocusEvent>();
  @Output() onBlurEvent = new EventEmitter<FocusEvent>();

  protected value = signal<string>('');

  private onChangeCallback: (value: any) => void = () => {};
  private onTouchedCallback: () => void = () => {};

  public writeValue(value: any): void {
    this.value.set(value != null ? String(value) : '');
  }

  public registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  protected onInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    if (this.autoResize) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
    this.value.set(textarea.value);
    this.onChangeCallback(textarea.value);
    this.onInputEvent.emit(event);
  }

  protected onFocus(event: FocusEvent): void {
    this.onFocusEvent.emit(event);
  }

  protected onBlur(event: FocusEvent): void {
    this.onTouchedCallback();
    this.onBlurEvent.emit(event);
  }
}
