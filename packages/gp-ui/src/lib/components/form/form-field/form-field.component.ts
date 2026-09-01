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
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgControl } from '@angular/forms';
import { GpFormFieldAppearance, GpFormFieldSize } from './form-field.interface';
import { GpPrefixDirective, GpSuffixDirective, GpHelperDirective, GpErrorDirective } from './form-field.directives';

@Component({
  selector: 'gp-form-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss'
})
export class GpFormFieldComponent implements AfterContentInit, OnDestroy {
  public label = input<string | undefined>(undefined);
  public appearance = input<GpFormFieldAppearance>('outlined');
  public size = input<GpFormFieldSize>('normal');
  public floatLabel = input<'auto' | 'always' | 'never'>('auto');
  public required = input<boolean>(false);
  public disabled = input<boolean>(false);
  public invalid = input<boolean>(false);
  public hint = input<string | undefined>(undefined);
  public errorMessage = input<string | undefined>(undefined);

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
    const fl = this.floatLabel();
    if (fl === 'always') {
      return true;
    }
    if (fl === 'never') {
      return false;
    }
    return this.isFocused() || this.hasValue() || !this.label();
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
