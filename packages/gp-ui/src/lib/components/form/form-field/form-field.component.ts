import {
  Component,
  ElementRef,
  AfterContentInit,
  OnDestroy,
  ChangeDetectorRef,
  inject,
  input,
  contentChild,
  signal,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';

import { NgControl } from '@angular/forms';
import { GpFormFieldAppearance, GpFormFieldSize, GpFormFieldFloatLabel } from './form-field.interface';
import { GpPrefixDirective, GpSuffixDirective, GpHelperDirective, GpErrorDirective } from './form-field.directives';
import { GpLabelComponent } from '../label/label.component';
import { GpIconComponent } from '../../../icons/icon.component';

@Component({
  selector: 'gp-form-field',
  standalone: true,
  imports: [GpLabelComponent, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss'
})
export class GpFormFieldComponent implements AfterContentInit, OnDestroy {
  public label = input<string | undefined>(undefined);
  public appearance = input<GpFormFieldAppearance>('outlined');
  public size = input<GpFormFieldSize>('normal');
  public floatLabel = input<GpFormFieldFloatLabel>('auto');
  public required = input<boolean>(false);
  public optional = input<boolean>(false);
  public helpText = input<string | undefined>(undefined);
  public icon = input<string | undefined>(undefined);
  public disabled = input<boolean>(false);
  public invalid = input<boolean>(false);
  public hint = input<string | undefined>(undefined);
  public errorMessage = input<string | undefined>(undefined);

  public labelComponent = contentChild(GpLabelComponent);
  public prefixDirective = contentChild(GpPrefixDirective);
  public suffixDirective = contentChild(GpSuffixDirective);
  public helperDirective = contentChild(GpHelperDirective);
  public errorDirective = contentChild(GpErrorDirective);
  public ngControl = contentChild(NgControl);

  private el = inject(ElementRef<HTMLElement>);
  private cdr = inject(ChangeDetectorRef);

  public isFocused = signal<boolean>(false);
  public hasValue = signal<boolean>(false);

  private focusListener?: () => void;
  private blurListener?: () => void;
  private inputListener?: () => void;

  public hasPrefix = computed(() => {
    return !!this.prefixDirective();
  });

  public hasSuffix = computed(() => {
    return !!this.suffixDirective();
  });

  public hasHelperDirective = computed(() => {
    return !!this.helperDirective();
  });

  public hasErrorDirective = computed(() => {
    return !!this.errorDirective();
  });

  public hasSubscript = computed(() => {
    return !!this.hint() || !!this.errorMessage() || this.hasHelperDirective() || this.hasErrorDirective();
  });

  public isFixedLabel = computed(() => {
    return this.floatLabel() === 'never';
  });

  public isInset = computed(() => {
    return this.appearance() === 'inset' || this.floatLabel() === 'inset';
  });

  public isFloatingOn = computed(() => {
    return this.floatLabel() === 'on';
  });

  public isFloatingIn = computed(() => {
    return this.floatLabel() === 'in';
  });

  public isFloatingOver = computed(() => {
    return this.floatLabel() === 'over';
  });

  public isInvalid = computed(() => {
    if (this.invalid()) {
      return true;
    }
    const ctrl = this.ngControl();
    if (ctrl) {
      return !!(ctrl.invalid && (ctrl.touched || ctrl.dirty));
    }
    return false;
  });

  public isFloating = computed(() => {
    if (this.isFixedLabel() || this.isInset()) {
      return false;
    }
    const fl = this.floatLabel();
    if (fl === 'always') {
      return true;
    }
    return this.isFocused() || this.hasValue() || (!this.label() && !this.labelComponent());
  });

  ngAfterContentInit(): void {
    const inputEl = this.el.nativeElement.querySelector('input, textarea, select') as HTMLInputElement | null;
    if (inputEl) {
      this.hasValue.set(!!inputEl.value);

      const handleFocus = () => {
        this.isFocused.set(true);
        this.cdr.markForCheck();
      };

      const handleBlur = () => {
        this.isFocused.set(false);
        this.hasValue.set(!!inputEl.value);
        this.cdr.markForCheck();
      };

      const handleInput = () => {
        this.hasValue.set(!!inputEl.value);
        this.cdr.markForCheck();
      };

      inputEl.addEventListener('focus', handleFocus);
      inputEl.addEventListener('blur', handleBlur);
      inputEl.addEventListener('input', handleInput);

      this.focusListener = () => {
        inputEl.removeEventListener('focus', handleFocus);
      };
      this.blurListener = () => {
        inputEl.removeEventListener('blur', handleBlur);
      };
      this.inputListener = () => {
        inputEl.removeEventListener('input', handleInput);
      };
    }
  }

  ngOnDestroy(): void {
    if (this.focusListener) {
      this.focusListener();
    }
    if (this.blurListener) {
      this.blurListener();
    }
    if (this.inputListener) {
      this.inputListener();
    }
  }

  public focusControl(): void {
    const inputEl = this.el.nativeElement.querySelector('input, textarea, select') as HTMLElement | null;
    if (inputEl) {
      inputEl.focus();
    }
  }
}
