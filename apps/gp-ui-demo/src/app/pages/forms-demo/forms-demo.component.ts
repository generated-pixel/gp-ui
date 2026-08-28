import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import {
  GpInputTextComponent,
  GpTextareaComponent,
  GpPasswordComponent,
  GpInputNumberComponent,
  GpCheckboxComponent,
  GpRadioButtonComponent,
  GpSwitchComponent,
  GpSliderComponent,
  GpRatingComponent,
  GpInputMaskComponent,
  GpSelectComponent,
  GpMultiSelectComponent,
  GpAutoCompleteComponent,
  GpTreeSelectComponent,
  GpDatePickerComponent,
  GpTimePickerComponent,
  GpFileUploadComponent,
  GpButtonComponent,
  GpCardComponent,
  GpValidators,
  GpFormDirective,
  GpFormErrorComponent
} from 'gp-ui';
import { DocCodeComponent } from '../../shared/doc-code.component';
import { DocApiTableComponent, DocApiProperty } from '../../shared/doc-api-table.component';

@Component({
  selector: 'app-forms-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    GpInputTextComponent,
    GpTextareaComponent,
    GpPasswordComponent,
    GpInputNumberComponent,
    GpCheckboxComponent,
    GpRadioButtonComponent,
    GpSwitchComponent,
    GpSliderComponent,
    GpRatingComponent,
    GpInputMaskComponent,
    GpSelectComponent,
    GpMultiSelectComponent,
    GpAutoCompleteComponent,
    GpTreeSelectComponent,
    GpDatePickerComponent,
    GpTimePickerComponent,
    GpFileUploadComponent,
    GpButtonComponent,
    GpFormDirective,
    GpFormErrorComponent,
    DocCodeComponent,
    DocApiTableComponent
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Form Controls & Inputs</h1>
        <p class="page-desc">
          20 production-ready form controls featuring seamless two-way binding, Reactive Forms (ControlValueAccessor),
          custom styling tokens, and accessible validation states.
        </p>
      </div>

      <!-- Import Section -->
      <div class="doc-section">
        <h2 class="doc-section-title">Import</h2>
        <p class="doc-section-desc">Import required form controls alongside Angular's ReactiveFormsModule:</p>
        <doc-code [code]="importCode" language="typescript" />
      </div>

      <!-- Reactive Form Container -->
      <form [formGroup]="demoForm" (ngSubmit)="onSubmit()">
        <!-- Text Inputs -->
        <div class="doc-section">
          <h2 class="doc-section-title">Text Inputs & Textarea</h2>
          <p class="doc-section-desc">Supports icons, clear buttons, prefixes/suffixes, and auto-resizing textareas.</p>
          <div class="form-grid">
            <div class="form-field">
              <label>Full Name (Required)</label>
              <gp-input-text formControlName="fullName" placeholder="John Doe" iconLeft="user" [clearable]="true" />
            </div>

            <div class="form-field">
              <label>Password (With Strength Meter)</label>
              <gp-password formControlName="password" placeholder="Choose a password" />
            </div>

            <div class="form-field">
              <label>Phone (Input Mask)</label>
              <gp-input-mask formControlName="phone" mask="(999) 999-9999" placeholder="(555) 000-1234" />
            </div>

            <div class="form-field">
              <label>Budget (Input Number)</label>
              <gp-input-number formControlName="budget" prefix="$" [min]="0" [max]="10000" [step]="50" />
            </div>

            <div class="form-field gp-col-span-2">
              <label>Bio (Textarea with Auto-Resize)</label>
              <gp-textarea
                formControlName="bio"
                placeholder="Write a short bio..."
                [autoResize]="true"
                [maxlength]="200"
              />
            </div>
          </div>
        </div>

        <!-- Selection Controls -->
        <div class="doc-section">
          <h2 class="doc-section-title">Select, MultiSelect & Autocomplete</h2>
          <p class="doc-section-desc">
            Dropdown pickers, multi-select with chips, typeahead search, and tree selectors.
          </p>
          <div class="form-grid">
            <div class="form-field">
              <label>Country (Single Select with Filter)</label>
              <gp-select
                formControlName="country"
                [options]="countries"
                optionLabel="name"
                optionValue="code"
                [filter]="true"
                placeholder="Select country"
              />
            </div>

            <div class="form-field">
              <label>Skills (Multi-Select Chips)</label>
              <gp-multi-select
                formControlName="skills"
                [options]="skillsList"
                display="chip"
                placeholder="Select skills"
              />
            </div>

            <div class="form-field">
              <label>City (Autocomplete Typeahead)</label>
              <gp-autocomplete
                formControlName="city"
                [suggestions]="filteredCities"
                (completeMethod)="searchCities($event)"
                [dropdown]="true"
                placeholder="Search city..."
              />
            </div>

            <div class="form-field">
              <label>Department (Tree Select)</label>
              <gp-tree-select formControlName="department" [options]="deptTree" placeholder="Select department" />
            </div>
          </div>
        </div>

        <!-- Date & Time Pickers -->
        <div class="doc-section">
          <h2 class="doc-section-title">Date & Time Pickers</h2>
          <p class="doc-section-desc">
            Interactive calendar datepicker popup and time pickers with 12/24hr formatting.
          </p>
          <div class="form-grid">
            <div class="form-field">
              <label>Birth Date (Date Picker)</label>
              <gp-date-picker formControlName="birthDate" placeholder="MM/DD/YYYY" />
            </div>

            <div class="form-field">
              <label>Appointment Time (Time Picker)</label>
              <gp-time-picker formControlName="appointmentTime" hourFormat="12" />
            </div>
          </div>
        </div>

        <!-- Booleans, Sliders & Ratings -->
        <div class="doc-section">
          <h2 class="doc-section-title">Checkbox, Radio, Switch, Slider & Rating</h2>
          <div class="form-grid">
            <div class="form-field">
              <label>Subscribe to Newsletter</label>
              <gp-checkbox formControlName="newsletter" label="I agree to receive updates" />
            </div>

            <div class="form-field">
              <label>Account Type</label>
              <div class="radio-row">
                <gp-radio-button formControlName="accountType" value="personal" label="Personal" />
                <gp-radio-button formControlName="accountType" value="business" label="Business" />
              </div>
            </div>

            <div class="form-field">
              <label>Enable Notifications</label>
              <gp-switch formControlName="notifications" label="Push alerts" />
            </div>

            <div class="form-field">
              <label>Satisfaction Score: {{ demoForm.get('satisfaction')?.value }}</label>
              <gp-rating formControlName="satisfaction" />
            </div>

            <div class="form-field gp-col-span-2">
              <label>Volume: {{ demoForm.get('volume')?.value }}%</label>
              <gp-slider formControlName="volume" [min]="0" [max]="100" />
            </div>
          </div>
        </div>

        <!-- File Upload -->
        <div class="doc-section">
          <h2 class="doc-section-title">File Upload</h2>
          <p class="doc-section-desc">
            Drag and drop file upload zone with file size validation and multi-file support.
          </p>
          <gp-file-upload [multiple]="true" accept="image/*" />
        </div>

        <!-- Submit & Form Value Inspector -->
        <div class="doc-section">
          <h2 class="doc-section-title">Reactive Form State & Actions</h2>
          <div class="form-actions">
            <gp-button label="Submit Form" type="submit" severity="primary" size="lg" />
            <gp-button
              label="Reset Form"
              type="button"
              variant="outlined"
              severity="secondary"
              (onClickEvent)="demoForm.reset()"
            />
          </div>

          <h3 style="margin-top: 1.5rem;">Live Form Values (JSON):</h3>
          <doc-code [code]="formJson()" language="json" />
        </div>
      </form>

      <!-- Declarative Form Validation & Side Effects Showcase -->
      <div
        class="doc-section"
        style="border: 2px solid var(--gp-primary); border-radius: var(--gp-border-radius-lg, 8px); padding: 1.5rem; background: var(--gp-surface-card);"
      >
        <h2
          class="doc-section-title"
          style="color: var(--gp-primary); display: flex; align-items: center; gap: 0.5rem;"
        >
          <span>⚡ Integrated Form Validation &amp; Side Effects</span>
        </h2>
        <p class="doc-section-desc">
          gp-ui includes a comprehensive validation and event-driven side effect pipeline directly in
          <code>GpEditableBaseComponent</code>. Validate synchronously, asynchronously, trigger cascading side effects,
          and map external API errors with <code>[gpForm]</code> and <code>GpValidators</code>.
        </p>

        <form
          gpForm
          #valForm="gpForm"
          (gpSubmit)="onValidationSubmit($event)"
          (gpInvalidSubmit)="onValidationInvalid($event)"
        >
          <div class="form-grid">
            <div class="form-field">
              <label>Email Address (Required + Email format)</label>
              <gp-input-text
                #emailInput
                name="email"
                placeholder="developer@example.com"
                [validators]="[GpValidators.required(), GpValidators.email()]"
                iconLeft="envelope"
              />
              <gp-form-error [control]="emailInput" />
            </div>

            <div class="form-field">
              <label>Username (Async availability check + Min 4 chars)</label>
              <gp-input-text
                #usernameInput
                name="username"
                placeholder="Try typing 'admin' or 'developer'"
                [validators]="[GpValidators.required(), GpValidators.minLength(4), checkUsernameAvailable]"
                iconLeft="user"
              />
              <gp-form-error [control]="usernameInput" />
              @if (usernameInput.isPending()) {
                <small style="color: var(--gp-info); font-size: 0.75rem;">⏳ Checking username availability...</small>
              }
            </div>

            <div class="form-field">
              <label>Base Price ($) (Min 10 + Side Effect calculates Total)</label>
              <gp-input-number
                #priceInput
                name="basePrice"
                [value]="100"
                [validators]="[GpValidators.required(), GpValidators.min(10)]"
                [valueEffect]="calculateTotalTaxEffect"
              />
              <gp-form-error [control]="priceInput" />
            </div>

            <div class="form-field">
              <label>Calculated Estimated Total (Dynamic Side Effect)</label>
              <gp-input-text
                name="totalWithTax"
                [value]="'$' + calculatedTotal.toFixed(2) + ' (includes 15% estimated tax)'"
                [readonly]="true"
              />
            </div>
          </div>

          <div class="form-actions" style="margin-top: 1.5rem; display: flex; flex-wrap: wrap; gap: 0.75rem;">
            <gp-button label="Submit &amp; Validate with gpForm" type="submit" severity="primary" icon="check" />
            <gp-button
              label="Simulate Server 422 Errors"
              type="button"
              variant="outlined"
              severity="danger"
              icon="alert-circle"
              (onClickEvent)="simulateServerErrors(valForm)"
            />
            <gp-button
              label="Clear Errors"
              type="button"
              variant="text"
              severity="secondary"
              (onClickEvent)="valForm.clearErrors()"
            />
            <gp-button
              label="Reset Form"
              type="button"
              variant="text"
              severity="secondary"
              (onClickEvent)="valForm.reset()"
            />
          </div>

          @if (validationStatusMessage) {
            <div
              style="margin-top: 1rem; padding: 0.75rem 1rem; border-radius: var(--gp-border-radius); font-size: 0.85rem;"
              [style.background]="
                isValidationSuccess ? 'var(--gp-success-light, #ecfdf5)' : 'var(--gp-danger-light, #fef2f2)'
              "
              [style.color]="isValidationSuccess ? 'var(--gp-success, #059669)' : 'var(--gp-danger, #dc2626)'"
            >
              {{ validationStatusMessage }}
            </div>
          }
        </form>
      </div>

      <!-- Usage Code Example -->
      <div class="doc-section">
        <h2 class="doc-section-title">Usage Example</h2>
        <p class="doc-section-desc">How to integrate gp-ui form controls in your Angular component:</p>
        <doc-code [code]="usageCode" language="typescript" />
      </div>

      <!-- API Reference -->
      <div class="doc-section">
        <h2 class="doc-section-title">API Reference (Form Controls &amp; Validation)</h2>
        <p class="doc-section-desc">
          All form controls inherit from <code>GpEditableBaseComponent</code>, providing unified data binding,
          validation pipelines, and event hooks:
        </p>

        <doc-api-table title="GpEditableBaseComponent Inputs" [properties]="commonFormProperties" />
        <doc-api-table title="GpEditableBaseComponent Outputs / Events" [properties]="formOutputs" />
        <doc-api-table title="GpEditableBaseComponent Public Methods &amp; Signals" [properties]="formMethods" />
        <doc-api-table title="GpFormDirective ([gpForm]) API" [properties]="formDirectiveProperties" />
        <doc-api-table title="GpFormErrorComponent (<gp-form-error>) Inputs" [properties]="formErrorProperties" />
      </div>
    </div>
  `,
  styles: [
    `
      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.25rem;
      }
      @media (max-width: 768px) {
        .form-grid {
          grid-template-columns: 1fr;
        }
      }
      .gp-col-span-2 {
        grid-column: span 2;
      }
      @media (max-width: 768px) {
        .gp-col-span-2 {
          grid-column: span 1;
        }
      }
      .form-field {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }
      .form-field label {
        font-size: var(--gp-font-size-sm);
        font-weight: 600;
        color: var(--gp-text-color);
      }
      .radio-row {
        display: flex;
        gap: 1.5rem;
        align-items: center;
        height: var(--gp-input-height);
      }
      .form-actions {
        display: flex;
        gap: 1rem;
      }
    `
  ]
})
export class FormsDemoComponent {
  importCode = `import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import {
  GpInputTextComponent,
  GpSelectComponent,
  GpCheckboxComponent,
  GpDatePickerComponent
} from '@generatedpixel/gp-ui';`;

  usageCode = `@Component({
  imports: [ReactiveFormsModule, GpInputTextComponent, GpSelectComponent],
  template: \`
    <form [formGroup]="form">
      <gp-input-text formControlName="email" placeholder="user@domain.com" iconLeft="user" />
      <gp-select formControlName="role" [options]="roles" placeholder="Select Role" />
    </form>
  \`
})
export class MyFormComponent {
  form = new FormGroup({
    email: new FormControl('', Validators.email),
    role: new FormControl('admin')
  });
  roles = [{ label: 'Admin', value: 'admin' }, { label: 'Member', value: 'member' }];
}`;

  demoForm = new FormGroup({
    fullName: new FormControl('Alex Morgan', Validators.required),
    password: new FormControl('P@ssword123'),
    phone: new FormControl('(555) 234-5678'),
    budget: new FormControl(2500),
    bio: new FormControl('Full-stack Angular engineer building scalable design systems.'),
    country: new FormControl('US'),
    skills: new FormControl(['Angular', 'TypeScript']),
    city: new FormControl('San Francisco'),
    department: new FormControl(null),
    birthDate: new FormControl(new Date(1995, 4, 15)),
    appointmentTime: new FormControl('10:30 AM'),
    newsletter: new FormControl(true),
    accountType: new FormControl('business'),
    notifications: new FormControl(true),
    satisfaction: new FormControl(5),
    volume: new FormControl(80)
  });

  countries = [
    { name: 'United States', code: 'US' },
    { name: 'United Kingdom', code: 'UK' },
    { name: 'Germany', code: 'DE' },
    { name: 'Japan', code: 'JP' },
    { name: 'Canada', code: 'CA' },
    { name: 'Australia', code: 'AU' }
  ];

  skillsList = [
    { label: 'Angular', value: 'Angular' },
    { label: 'TypeScript', value: 'TypeScript' },
    { label: 'RxJS', value: 'RxJS' },
    { label: 'Signals', value: 'Signals' },
    { label: 'CSS Architecture', value: 'CSS' },
    { label: 'Accessibility (a11y)', value: 'A11y' }
  ];

  cities = ['New York', 'San Francisco', 'London', 'Berlin', 'Tokyo', 'Sydney', 'Toronto', 'Paris'];
  filteredCities: string[] = [];

  deptTree = [
    {
      label: 'Engineering',
      icon: 'folder',
      children: [
        { label: 'Frontend UI Team', icon: 'file' },
        { label: 'Backend API Team', icon: 'file' },
        { label: 'DevOps & Cloud', icon: 'file' }
      ]
    },
    {
      label: 'Product & Design',
      icon: 'folder',
      children: [
        { label: 'Design System Team', icon: 'file' },
        { label: 'User Research', icon: 'file' }
      ]
    }
  ];

  commonFormProperties: DocApiProperty[] = [
    {
      name: 'value',
      type: 'any',
      default: 'null',
      description: 'Two-way bound model value or reactive form control value.'
    },
    { name: 'name', type: 'string', default: "''", description: 'HTML form control name attribute.' },
    { name: 'placeholder', type: 'string', default: "''", description: 'Placeholder hint text when input is empty.' },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disables user input and applies disabled visual styling.'
    },
    {
      name: 'readonly',
      type: 'boolean',
      default: 'false',
      description: 'Prevents editing while allowing selection and focus.'
    },
    {
      name: 'required',
      type: 'boolean',
      default: 'false',
      description: 'Marks the field as required for accessibility and form validation.'
    },
    {
      name: 'invalid',
      type: 'boolean',
      default: 'false',
      description: 'Highlights the control with error styling (red border/ring).'
    },
    {
      name: 'validators',
      type: 'GpValidatorFn[]',
      default: '[]',
      description: 'Array of synchronous and asynchronous validation rules (e.g. GpValidators.required()).'
    },
    {
      name: 'validateOn',
      type: "('change' | 'blur' | 'submit' | 'manual')[]",
      default: "['change', 'blur']",
      description: 'User interaction events that trigger validation.'
    },
    {
      name: 'valueEffect',
      type: 'GpValueEffectFn',
      default: 'null',
      description: 'Side effect function executed asynchronously whenever the control value updates.'
    },
    {
      name: 'errorMessage',
      type: 'string',
      default: "''",
      description: 'Manual or external error message overriding automatic validator messages.'
    },
    {
      name: 'helperText',
      type: 'string',
      default: "''",
      description: 'Secondary descriptive or instructional text displayed beneath the control.'
    },
    {
      name: 'styleClass',
      type: 'string',
      default: "''",
      description: 'Custom CSS classes applied to the control container.'
    },
    {
      name: 'style',
      type: '{ [k: string]: any }',
      default: 'null',
      description: 'Custom inline styles applied to the host element.'
    },
    { name: 'ariaLabel', type: 'string', default: "''", description: 'Accessible ARIA label for screen readers.' }
  ];

  formOutputs: DocApiProperty[] = [
    {
      name: 'onValidate',
      type: 'EventEmitter<GpValidationState>',
      description: 'Emitted whenever validation completes with current validity and errors.'
    },
    { name: 'onValid', type: 'EventEmitter<any>', description: 'Emitted when validation succeeds with valid value.' },
    {
      name: 'onInvalid',
      type: 'EventEmitter<GpValidationError[]>',
      description: 'Emitted when validation fails with list of error descriptors.'
    },
    {
      name: 'onEffectComplete',
      type: 'EventEmitter<{ value: any }>',
      description: 'Emitted when asynchronous valueEffect execution resolves.'
    }
  ];

  formMethods: DocApiProperty[] = [
    {
      name: 'validate()',
      type: '() => Promise<boolean>',
      description: 'Triggers validation against all assigned validator rules and updates error signals.'
    },
    {
      name: 'setErrors(errors)',
      type: '(errors: GpValidationError[] | string[] | string) => void',
      description: 'Injects external error messages (e.g. HTTP 422 API responses) directly onto the control.'
    },
    {
      name: 'clearErrors()',
      type: '() => void',
      description: 'Clears all validation errors and restores valid state.'
    },
    {
      name: 'reset()',
      type: '() => void',
      description: 'Resets value to initial state and resets touched/dirty/error signals.'
    },
    { name: 'focus()', type: '() => void', description: 'Focuses the native input/control element.' },
    {
      name: 'isValid()',
      type: 'Signal<boolean>',
      description: 'Reactive signal returning true if control has no errors.'
    },
    {
      name: 'isInvalid()',
      type: 'Signal<boolean>',
      description: 'Reactive signal returning true if control is touched/dirty and has errors.'
    },
    {
      name: 'isPending()',
      type: 'Signal<boolean>',
      description: 'Reactive signal returning true while asynchronous validators are executing.'
    },
    {
      name: 'errors()',
      type: 'Signal<GpValidationError[]>',
      description: 'Reactive signal containing list of current validation errors.'
    },
    {
      name: 'firstError()',
      type: 'Signal<GpValidationError | null>',
      description: 'Reactive signal containing the first validation error message descriptor.'
    }
  ];

  formDirectiveProperties: DocApiProperty[] = [
    {
      name: '(gpSubmit)',
      type: 'EventEmitter<GpFormSubmitEvent>',
      description: 'Emitted on form submission when ALL child controls pass validation. Contains validated values map.'
    },
    {
      name: '(gpInvalidSubmit)',
      type: 'EventEmitter<GpFormInvalidEvent>',
      description:
        'Emitted on form submission when any control fails validation. Automatically focuses first invalid control.'
    },
    {
      name: 'validateAll()',
      type: '() => Promise<boolean>',
      description: 'Concurrently runs validation across all registered child controls.'
    },
    {
      name: 'setErrors(errorsMap)',
      type: '(errors: Record<string, string | string[]>) => void',
      description: 'Maps server-side HTTP 422 error object directly to child controls matching field names.'
    },
    { name: 'clearErrors()', type: '() => void', description: 'Clears errors on all registered child form controls.' },
    { name: 'reset()', type: '() => void', description: 'Resets all registered child controls.' },
    {
      name: 'getValues()',
      type: '() => Record<string, any>',
      description: 'Extracts a key-value object containing current values of all named controls.'
    },
    {
      name: 'getControl(name)',
      type: '(name: string) => GpEditableBaseComponent | undefined',
      description: 'Finds a child form control by its name attribute.'
    }
  ];

  formErrorProperties: DocApiProperty[] = [
    {
      name: 'control',
      type: 'GpEditableBaseComponent',
      default: 'null',
      description:
        'Reference to a GpEditableBaseComponent control instance to automatically display its validation errors.'
    },
    {
      name: 'errors',
      type: 'GpValidationError[] | string[]',
      default: '[]',
      description: 'Explicit array of error messages or validation error objects to display.'
    },
    { name: 'message', type: 'string', default: "''", description: 'Single error message string to display.' },
    {
      name: 'showIcon',
      type: 'boolean',
      default: 'true',
      description: 'Whether to render the warning alert icon before the error message.'
    }
  ];

  protected formJson(): string {
    return JSON.stringify(this.demoForm.value, null, 2);
  }

  searchCities(event: any): void {
    const q = (event.query || '').toLowerCase();
    this.filteredCities = this.cities.filter((c) => c.toLowerCase().includes(q));
  }

  public GpValidators = GpValidators;
  public calculatedTotal = 115;
  public validationStatusMessage = '';
  public isValidationSuccess = false;

  public checkUsernameAvailable = GpValidators.async(async (val: any) => {
    if (!val || typeof val !== 'string') {
      return null;
    }
    // Simulate remote network verification delay
    await new Promise((resolve) => setTimeout(resolve, 600));
    const normalized = val.trim().toLowerCase();
    if (normalized === 'admin' || normalized === 'developer' || normalized === 'root') {
      return `Username "${val}" is already taken. Please choose another.`;
    }
    return true;
  }, 'unique_username');

  public calculateTotalTaxEffect = async (newVal: any): Promise<void> => {
    const num = Number(newVal) || 0;
    this.calculatedTotal = num * 1.15;
  };

  public onValidationSubmit(event: any): void {
    this.isValidationSuccess = true;
    this.validationStatusMessage = `✅ Form submission succeeded! Validated values: ${JSON.stringify(event.values)}`;
  }

  public onValidationInvalid(event: any): void {
    this.isValidationSuccess = false;
    const fieldNames = Object.keys(event.errors).join(', ');
    this.validationStatusMessage = `❌ Form validation failed on fields: [${fieldNames}]. First invalid field has been automatically focused.`;
  }

  public simulateServerErrors(form: any): void {
    form.setErrors({
      email: 'Server API (422): Email address is on the global blocklist',
      username: 'Server API (422): Username flagged by security policy',
      basePrice: 'Server API (422): Pricing requires manager authorization'
    });
    this.isValidationSuccess = false;
    this.validationStatusMessage = '⚠️ Simulated external HTTP 422 server validation errors injected onto fields.';
  }

  onSubmit(): void {
    alert('Form submitted successfully! Check browser console or JSON inspector.');
    console.log('Submitted Form:', this.demoForm.value);
  }
}
