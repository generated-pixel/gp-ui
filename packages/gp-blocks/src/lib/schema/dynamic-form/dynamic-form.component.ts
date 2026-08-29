import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  signal,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  ValidatorFn
} from '@angular/forms';
import {
  GpButtonComponent,
  GpInputTextComponent,
  GpTextareaComponent,
  GpPasswordComponent,
  GpInputNumberComponent,
  GpSelectComponent,
  GpMultiSelectComponent,
  GpCheckboxComponent,
  GpRadioButtonComponent,
  GpSwitchComponent,
  GpSliderComponent,
  GpRatingComponent,
  GpColorPickerComponent,
  GpDatePickerComponent,
  GpTimePickerComponent,
  GpCardComponent,
  GpDividerComponent,
  GpIconComponent
} from '@generatedpixel/gp-ui';
import { GpFormSchema, GpFieldSchema, GpFormAction } from '../schema.types';

@Component({
  selector: 'gp-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GpButtonComponent,
    GpInputTextComponent,
    GpTextareaComponent,
    GpPasswordComponent,
    GpInputNumberComponent,
    GpSelectComponent,
    GpMultiSelectComponent,
    GpCheckboxComponent,
    GpRadioButtonComponent,
    GpSwitchComponent,
    GpSliderComponent,
    GpRatingComponent,
    GpColorPickerComponent,
    GpDatePickerComponent,
    GpTimePickerComponent,
    GpCardComponent,
    GpDividerComponent,
    GpIconComponent
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class GpDynamicFormComponent implements OnInit, OnChanges {
  @Input() set schema(value: GpFormSchema | undefined) {
    this._schema.set(value);
    this.buildForm();
  }
  get schema(): () => GpFormSchema | undefined {
    return this._schema;
  }

  @Input() initialValues?: Record<string, any>;

  @Output() formSubmit = new EventEmitter<Record<string, any>>();
  @Output() formChange = new EventEmitter<Record<string, any>>();
  @Output() formReset = new EventEmitter<void>();
  @Output() actionClick = new EventEmitter<GpFormAction>();

  private _schema = signal<GpFormSchema | undefined>(undefined);
  form: FormGroup = new FormGroup({});
  formSubmitted = signal<boolean>(false);

  visibleFields = computed(() => {
    const s = this._schema();
    if (!s || !s.fields) return [];
    return s.fields.filter(field => {
      if (!field.hiddenWhen) return true;
      const val = this.form.get(field.hiddenWhen.field)?.value;
      return val !== field.hiddenWhen.equals;
    });
  });

  ngOnInit() {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialValues'] && !changes['initialValues'].isFirstChange()) {
      if (this.initialValues) {
        this.form.patchValue(this.initialValues);
      }
    }
  }

  buildForm() {
    const s = this._schema();
    if (!s) return;

    const group: Record<string, FormControl> = {};

    s.fields.forEach(field => {
      if (field.type === 'divider' || field.type === 'heading') return;

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

      const initialVal =
        this.initialValues && this.initialValues[field.name] !== undefined
          ? this.initialValues[field.name]
          : field.defaultValue !== undefined
          ? field.defaultValue
          : field.type === 'checkbox' || field.type === 'switch'
          ? false
          : '';

      group[field.name] = new FormControl(
        { value: initialVal, disabled: field.disabled || false },
        validators
      );
    });

    this.form = new FormGroup(group);

    this.form.valueChanges.subscribe(val => {
      this.formChange.emit(val);
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    if (!control) return false;
    return control.invalid && (control.touched || control.dirty || this.formSubmitted());
  }

  getFieldErrorMessage(field: GpFieldSchema): string {
    const control = this.form.get(field.name);
    if (!control || !control.errors) return '';

    if (field.validation?.customMessage) return field.validation.customMessage;

    if (control.errors['required']) return `${field.label || 'This field'} is required`;
    if (control.errors['email']) return 'Please enter a valid email address';
    if (control.errors['min']) return `Value must be at least ${control.errors['min'].min}`;
    if (control.errors['max']) return `Value cannot exceed ${control.errors['max'].max}`;
    if (control.errors['minlength'])
      return `Must be at least ${control.errors['minlength'].requiredLength} characters`;
    if (control.errors['maxlength'])
      return `Cannot exceed ${control.errors['maxlength'].requiredLength} characters`;
    if (control.errors['pattern']) return 'Invalid format';

    return 'Invalid field value';
  }

  onSubmit() {
    this.formSubmitted.set(true);
    if (this.form.valid) {
      this.formSubmit.emit(this.form.getRawValue());
    } else {
      this.form.markAllAsTouched();
    }
  }

  onReset() {
    this.formSubmitted.set(false);
    this.form.reset();
    this.formReset.emit();
  }

  onActionClick(action: GpFormAction) {
    this.actionClick.emit(action);
  }
}
