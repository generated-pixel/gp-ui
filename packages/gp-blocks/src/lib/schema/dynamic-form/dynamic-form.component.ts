import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  output,
  signal,
  computed,
  effect
} from '@angular/core';

import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import {
  GpButtonComponent,
  GpInputTextComponent,
  GpTextareaComponent,
  GpPasswordComponent,
  GpInputNumberComponent,
  GpInputMaskComponent,
  GpSelectComponent,
  GpMultiSelectComponent,
  GpAutoCompleteComponent,
  GpCascadeSelectComponent,
  GpTreeSelectComponent,
  GpListboxComponent,
  GpCheckboxComponent,
  GpRadioButtonComponent,
  GpSwitchComponent,
  GpToggleButtonComponent,
  GpSliderComponent,
  GpRatingComponent,
  GpColorPickerComponent,
  GpDatePickerComponent,
  GpDateRangePickerComponent,
  GpTimePickerComponent,
  GpFileUploadComponent,
  GpFormFieldComponent,
  GpLabelComponent,
  GpFloatLabelComponent,
  GpInsetLabelComponent,
  GpCardComponent,
  GpDividerComponent,
  GpIconComponent
} from '@generatedpixel/gp-ui';
import { GpFormSchema, GpFieldSchema, GpFormAction } from '../schema.types';

@Component({
  selector: 'gp-dynamic-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GpButtonComponent,
    GpInputTextComponent,
    GpTextareaComponent,
    GpPasswordComponent,
    GpInputNumberComponent,
    GpInputMaskComponent,
    GpSelectComponent,
    GpMultiSelectComponent,
    GpAutoCompleteComponent,
    GpCascadeSelectComponent,
    GpTreeSelectComponent,
    GpListboxComponent,
    GpCheckboxComponent,
    GpRadioButtonComponent,
    GpSwitchComponent,
    GpToggleButtonComponent,
    GpSliderComponent,
    GpRatingComponent,
    GpColorPickerComponent,
    GpDatePickerComponent,
    GpDateRangePickerComponent,
    GpTimePickerComponent,
    GpFileUploadComponent,
    GpFormFieldComponent,
    GpLabelComponent,
    GpFloatLabelComponent,
    GpInsetLabelComponent,
    GpDividerComponent,
    GpIconComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class GpDynamicFormComponent implements OnInit {
  public schema = input<GpFormSchema | undefined>(undefined);
  public initialValues = input<Record<string, any> | undefined>(undefined);

  public formSubmit = output<Record<string, any>>();
  public formChange = output<Record<string, any>>();
  public formReset = output<void>();
  public actionClick = output<GpFormAction>();

  public form: FormGroup = new FormGroup({});
  public formSubmitted = signal<boolean>(false);

  public visibleFields = computed(() => {
    const s = this.schema();
    if (!s || !s.fields) {
      return [];
    }
    return s.fields.filter((field) => {
      if (!field.hiddenWhen) {
        return true;
      }
      const val = this.form.get(field.hiddenWhen.field)?.value;
      return val !== field.hiddenWhen.equals;
    });
  });

  constructor() {
    effect(() => {
      const s = this.schema();
      const initVals = this.initialValues();
      if (s) {
        this.buildForm(s, initVals);
      }
    });
  }

  ngOnInit(): void {
    const s = this.schema();
    if (s) {
      this.buildForm(s, this.initialValues());
    }
  }

  public buildForm(s: GpFormSchema, initVals?: Record<string, any>): void {
    const group: Record<string, FormControl> = {};

    s.fields.forEach((field) => {
      if (field.type === 'divider' || field.type === 'heading') {
        return;
      }

      const validators: ValidatorFn[] = [];
      if (field.required || field.validation?.required) {
        validators.push(Validators.required);
      }
      if (field.validation?.email) {
        validators.push(Validators.email);
      }
      if (field.validation?.min !== undefined) {
        validators.push(Validators.min(field.validation.min));
      }
      if (field.validation?.max !== undefined) {
        validators.push(Validators.max(field.validation.max));
      }
      if (field.validation?.minLength !== undefined) {
        validators.push(Validators.minLength(field.validation.minLength));
      }
      if (field.validation?.maxLength !== undefined) {
        validators.push(Validators.maxLength(field.validation.maxLength));
      }
      if (field.validation?.pattern) {
        validators.push(Validators.pattern(field.validation.pattern));
      }

      let initialVal =
        initVals && initVals[field.name] !== undefined
          ? initVals[field.name]
          : field.defaultValue !== undefined
            ? field.defaultValue
            : null;

      if (initialVal === null) {
        if (field.type === 'checkbox' || field.type === 'switch' || field.type === 'toggle-button') {
          initialVal = false;
        } else if (field.type === 'multi-select' || field.type === 'tree-select') {
          initialVal = [];
        } else if (
          field.type === 'number' ||
          field.type === 'input-number' ||
          field.type === 'slider' ||
          field.type === 'rating'
        ) {
          initialVal = field.min !== undefined ? field.min : 0;
        } else if (field.type === 'color' || field.type === 'color-picker') {
          initialVal = '#6366f1';
        } else {
          initialVal = '';
        }
      }

      group[field.name] = new FormControl({ value: initialVal, disabled: field.disabled || false }, validators);
    });

    this.form = new FormGroup(group);

    this.form.valueChanges.subscribe((vals) => {
      this.formChange.emit(vals);
    });
  }

  public isFieldInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    if (!control) {
      return false;
    }
    return control.invalid && (control.touched || this.formSubmitted());
  }

  public getFieldErrorMessage(field: GpFieldSchema): string {
    const control = this.form.get(field.name);
    if (!control || !control.errors) {
      return '';
    }

    if (field.validation?.customMessage) {
      return field.validation.customMessage;
    }
    if (control.errors['required']) {
      return `${field.label || field.name} is required.`;
    }
    if (control.errors['email']) {
      return 'Please enter a valid email address.';
    }
    if (control.errors['minlength']) {
      return `Minimum length is ${control.errors['minlength'].requiredLength} characters.`;
    }
    if (control.errors['maxlength']) {
      return `Maximum length is ${control.errors['maxlength'].requiredLength} characters.`;
    }
    if (control.errors['min']) {
      return `Minimum value is ${control.errors['min'].min}.`;
    }
    if (control.errors['max']) {
      return `Maximum value is ${control.errors['max'].max}.`;
    }
    if (control.errors['pattern']) {
      return 'Invalid format.';
    }
    return 'Invalid value.';
  }

  public onSubmit(): void {
    this.formSubmitted.set(true);
    if (this.form.valid) {
      this.formSubmit.emit(this.form.getRawValue());
    } else {
      this.form.markAllAsTouched();
    }
  }

  public onReset(): void {
    this.formSubmitted.set(false);
    this.form.reset();
    this.formReset.emit();
  }

  public onActionClick(action: GpFormAction): void {
    this.actionClick.emit(action);
  }
}
