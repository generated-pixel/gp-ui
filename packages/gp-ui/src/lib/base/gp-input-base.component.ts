import { Directive, input, output, computed } from '@angular/core';
import { GpEditableBaseComponent } from './gp-editable-base.component';
import { UniqueId } from '../utils/unique-id';

export type GpInputSize = 'sm' | 'md' | 'lg';
export type GpInputVariant = 'outlined' | 'filled';

/**
 * Base class for all text-entry and input-like form controls (InputText, Textarea, Password, InputMask, InputNumber, Autocomplete).
 * Provides common input properties, accessibility attributes, and lifecycle/keyboard events.
 */
@Directive()
export abstract class GpInputBaseComponent<T = any> extends GpEditableBaseComponent<T> {
  /** Unique HTML id attribute for the underlying input/textarea element */
  public inputId = input<string>(UniqueId.generate('input_'));

  /** Input size scale */
  public size = input<GpInputSize>('md');

  /** Visual variant (outlined or filled) */
  public variant = input<GpInputVariant>('outlined');

  /** Whether the field can be cleared via an interactive clear icon */
  public clearable = input<boolean>(false);

  /** HTML autofocus attribute */
  public autofocus = input<boolean>(false);

  /** HTML tabindex attribute */
  public tabindex = input<number | undefined>(undefined);

  /** Maximum character length allowed */
  public maxlength = input<number | undefined>(undefined);

  /** Minimum character length allowed */
  public minlength = input<number | undefined>(undefined);

  /** HTML autocomplete attribute */
  public autocomplete = input<string>('off');

  /** Left adornment icon */
  public iconLeft = input<string>('');

  /** Right adornment icon */
  public iconRight = input<string>('');

  /** Fluid (100% width) layout */
  public fluid = input<boolean>(false);

  // ==========================================
  // Common Input Event Outputs
  // ==========================================

  /** Emitted whenever the native input event fires */
  public onInputEvent = output<Event>();

  /** Emitted when the control receives focus */
  public onFocusEvent = output<FocusEvent>();

  /** Emitted when the control loses focus */
  public onBlurEvent = output<FocusEvent>();

  /** Emitted when a key is pressed down inside the input */
  public onKeyDownEvent = output<KeyboardEvent>();

  /** Emitted when a key is released inside the input */
  public onKeyUpEvent = output<KeyboardEvent>();

  /** Emitted when the clear icon is clicked */
  public onClearEvent = output<void>();

  /** Emitted when the native change event fires */
  public onChangeEvent = output<Event>();

  /**
   * Computed CSS classes for the input element or container
   */
  protected inputClassNames = computed(() => {
    return [
      'gp-inputtext',
      `gp-input-${this.size()}`,
      `gp-input-${this.variant()}`,
      this.isEffectivelyDisabled() ? 'gp-input-disabled' : '',
      this.readonly() ? 'gp-input-readonly' : '',
      !this.isValid() ? 'gp-input-invalid' : '',
      this.fluid() ? 'gp-input-fluid' : '',
      this.styleClass()
    ]
      .filter(Boolean)
      .join(' ');
  });

  public handleInput(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.updateValue(target.value as any);
    this.onInputEvent.emit(event);
  }

  public handleFocus(event: FocusEvent): void {
    this.onFocusEvent.emit(event);
  }

  public handleBlur(event: FocusEvent): void {
    this.handleControlBlur();
    this.onBlurEvent.emit(event);
  }

  public handleKeyDown(event: KeyboardEvent): void {
    if (!this.isEffectivelyDisabled()) {
      this.onKeyDownEvent.emit(event);
    }
  }

  public handleKeyUp(event: KeyboardEvent): void {
    if (!this.isEffectivelyDisabled()) {
      this.onKeyUpEvent.emit(event);
    }
  }

  public clearInput(event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.updateValue('' as any);
    this.onClearEvent.emit();
  }
}
