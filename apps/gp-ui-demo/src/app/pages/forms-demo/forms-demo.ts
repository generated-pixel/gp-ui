import { Component, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import {
  GpInputText,
  GpTextarea,
  GpPassword,
  GpInputNumber,
  GpCheckbox,
  GpRadioButton,
  GpSwitch,
  GpSlider,
  GpRating,
  GpInputMask,
  GpSelect,
  GpMultiSelect,
  GpAutoComplete,
  GpTreeSelect,
  GpDatePicker,
  GpDateRangePicker,
  GpTimePicker,
  GpFileUpload,
  GpHtmlEditor,
  GpMdEditor,
  GpButton,
  GpCard,
  GpDialog,
  GpDialogService,
  GpBadge,
  GpValidators,
  GpFormDirective,
  GpFormError,
  GpFormField,
  GpPrefixDirective,
  GpSuffixDirective,
  GpHelperDirective,
  GpErrorDirective,
  GpLabel,
  GpFloatLabel,
  GpInsetLabel,
  GpInputTextDirective
} from 'gp-ui';
import { CustomerSearchDialog } from './customer-search-dialog';
import { GpIcon } from 'gp-ui-icons';
import { DocCode } from '../../shared/doc-code';
import { DocApiTable, DocApiProperty } from '../../shared/doc-api-table';

@Component({
  selector: 'app-forms-demo',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GpInputText,
    GpTextarea,
    GpPassword,
    GpInputNumber,
    GpCheckbox,
    GpRadioButton,
    GpSwitch,
    GpSlider,
    GpRating,
    GpInputMask,
    GpSelect,
    GpMultiSelect,
    GpAutoComplete,
    GpDialog,
    GpBadge,
    GpTreeSelect,
    GpDatePicker,
    GpDateRangePicker,
    GpTimePicker,
    GpFileUpload,
    GpHtmlEditor,
    GpMdEditor,
    GpButton,
    GpFormDirective,
    GpFormError,
    GpFormField,
    GpPrefixDirective,
    GpSuffixDirective,
    GpHelperDirective,
    GpErrorDirective,
    GpLabel,
    GpFloatLabel,
    GpInsetLabel,
    GpInputTextDirective,
    GpIcon,
    DocCode,
    DocApiTable
  ],
  templateUrl: './forms-demo.html',
  styleUrl: './forms-demo.scss'
})
export class FormsDemo {
  importCode = `import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import {
  GpInputText,
  GpSelect,
  GpCheckbox,
  GpDatePicker
} from '@generatedpixel/gp-ui';`;

  usageCode = `@Component({
  imports: [ReactiveFormsModule, GpInputText, GpSelect],
  template: \`
    <form [formGroup]="form">
      <gp-input-text formControlName="email" placeholder="user@domain.com" iconLeft="user" />
      <gp-select formControlName="role" [options]="roles" placeholder="Select Role" />
    </form>
  \`
})
export class MyForm {
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
    volume: new FormControl(80),
    bioHtml: new FormControl(
      '<h2>Executive Summary</h2><p>Senior <strong>Frontend Architect</strong> building high-performance design systems.</p>'
    ),
    readmeMd: new FormControl(
      '# Project Documentation\n\nWelcome to **gp-ui** design system.\n\n- [x] Modern Angular 19+\n- [x] Zero external dependencies\n- [ ] Deploy to production\n\n| Feature | Status |\n|---|---|\n| HTML Editor | Ready |\n| MD Editor | Ready |'
    )
  });

  floatUsername = '';
  floatEmail = '';
  floatCity = '';

  labelCode = `<!-- 1. Standard Accessible Label -->
<gp-label for="uname" text="Username" [required]="true" helpText="Public handle" />
<input id="uname" gpInputText />

<!-- 2. Animated Floating Label (on, in, or over) -->
<gp-float-label variant="on">
  <input id="fl-email" gpInputText placeholder=" " [(ngModel)]="email" />
  <label for="fl-email">Email Address</label>
</gp-float-label>

<!-- 3. Inset Top-Left Embedded Label -->
<gp-inset-label>
  <label for="inset-role">Role Title</label>
  <input id="inset-role" gpInputText placeholder="Software Engineer" />
</gp-inset-label>`;

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

  cities = [
    { label: 'Rome, Italy', value: 'Rome', subtext: 'Lazio • Europe', icon: 'map-pin', badge: 'Capital' },
    { label: 'Paris, France', value: 'Paris', subtext: 'Île-de-France • Europe', icon: 'map-pin', badge: 'Capital' },
    {
      label: 'New York, USA',
      value: 'New York',
      subtext: 'New York State • Americas',
      icon: 'map-pin',
      badge: 'Metro'
    },
    { label: 'London, UK', value: 'London', subtext: 'Greater London • Europe', icon: 'map-pin', badge: 'Capital' },
    { label: 'Tokyo, Japan', value: 'Tokyo', subtext: 'Kantō • Asia', icon: 'map-pin', badge: 'Capital' },
    { label: 'Berlin, Germany', value: 'Berlin', subtext: 'Berlin State • Europe', icon: 'map-pin', badge: 'Capital' },
    {
      label: 'Madrid, Spain',
      value: 'Madrid',
      subtext: 'Community of Madrid • Europe',
      icon: 'map-pin',
      badge: 'Capital'
    },
    {
      label: 'Sydney, Australia',
      value: 'Sydney',
      subtext: 'New South Wales • Oceania',
      icon: 'map-pin',
      badge: 'Metro'
    },
    { label: 'Toronto, Canada', value: 'Toronto', subtext: 'Ontario • Americas', icon: 'map-pin', badge: 'Metro' },
    { label: 'Singapore', value: 'Singapore', subtext: 'Southeast Asia', icon: 'map-pin', badge: 'City-State' }
  ];

  filteredCities: any[] = [];

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
      type: '(name: string) => GpEditableBase | undefined',
      description: 'Finds a child form control by its name attribute.'
    }
  ];

  formErrorProperties: DocApiProperty[] = [
    {
      name: 'control',
      type: 'GpEditableBase',
      default: 'null',
      description: 'Reference to a GpEditableBase control instance to automatically display its validation errors.'
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
    this.filteredCities = this.cities.filter(
      (c) =>
        c.label.toLowerCase().includes(q) || c.subtext.toLowerCase().includes(q) || c.value.toLowerCase().includes(q)
    );
  }

  // Technologies for Multi-Select Token Typeahead
  public techOptions = [
    'Angular',
    'TypeScript',
    'Signals',
    'RxJS',
    'NgRx',
    'NodeJS',
    'Tailwind',
    'Sass',
    'GraphQL',
    'Docker',
    'Kubernetes',
    'Python',
    'Go'
  ];

  public filteredTechs: string[] = [];

  searchTechs(event: any): void {
    const q = (event.query || '').toLowerCase();
    this.filteredTechs = this.techOptions.filter((t) => t.toLowerCase().includes(q));
  }

  // Enterprise Customers for Advanced Search Dialog & Subscription
  public allDatabaseCustomers = [
    {
      id: 101,
      name: 'Acme Global Enterprises',
      tier: 'Enterprise',
      location: 'New York, USA',
      subtext: 'New York, USA • HQ',
      icon: 'building',
      badge: 'Enterprise'
    },
    {
      id: 102,
      name: 'Apex Cyber Solutions',
      tier: 'Enterprise',
      location: 'London, UK',
      subtext: 'London, UK • EMEA Hub',
      icon: 'shield',
      badge: 'Enterprise'
    },
    {
      id: 103,
      name: 'BlueStar Logistics',
      tier: 'Professional',
      location: 'Toronto, Canada',
      subtext: 'Toronto, Canada • Supply Chain',
      icon: 'truck',
      badge: 'Pro'
    },
    {
      id: 104,
      name: 'CloudScale Technologies',
      tier: 'Enterprise',
      location: 'San Francisco, USA',
      subtext: 'San Francisco, USA • Cloud Infra',
      icon: 'cloud',
      badge: 'Enterprise'
    },
    {
      id: 105,
      name: 'DataCore Analytics Ltd',
      tier: 'Professional',
      location: 'Berlin, Germany',
      subtext: 'Berlin, Germany • AI & BI',
      icon: 'database',
      badge: 'Pro'
    },
    {
      id: 106,
      name: 'EchoWave Interactive',
      tier: 'Standard',
      location: 'Sydney, Australia',
      subtext: 'Sydney, Australia • Digital Media',
      icon: 'globe',
      badge: 'Standard'
    },
    {
      id: 107,
      name: 'FusionWorks Labs',
      tier: 'Enterprise',
      location: 'Tokyo, Japan',
      subtext: 'Tokyo, Japan • R&D Center',
      icon: 'cogs',
      badge: 'Enterprise'
    },
    {
      id: 108,
      name: 'Global Horizon Corp',
      tier: 'Enterprise',
      location: 'Paris, France',
      subtext: 'Paris, France • Global Accounts',
      icon: 'globe',
      badge: 'Enterprise'
    }
  ];

  public filteredCustomers: any[] = [];

  // Dynamic Search Dialog Component for GpDialogService
  public CustomerSearchDialog = CustomerSearchDialog;
  private dialogService = inject(GpDialogService);

  // Subscription Subject for injecting selected customer from Modal Dialog
  public dialogSelection$ = new Subject<any>();
  public searchDialogVisible = false;
  public dialogSearchQuery = '';

  searchCustomers(event: any): void {
    const q = (event.query || '').toLowerCase();
    this.filteredCustomers = this.allDatabaseCustomers.filter(
      (c) => c.name.toLowerCase().includes(q) || String(c.id).includes(q)
    );
  }

  openSearchDialog(event: any): void {
    this.dialogSearchQuery = event.query || '';
    this.searchDialogVisible = true;
  }

  selectCustomerFromDialog(cust: any): void {
    this.dialogSelection$.next(cust);
    this.searchDialogVisible = false;
  }

  openCustomerSearchDirectly(): void {
    const ref = this.dialogService.open(CustomerSearchDialog, {
      header: 'Direct GpDialogService Customer Finder',
      width: '42rem'
    });
    ref.onClose.subscribe((selected) => {
      if (selected) {
        alert(`Selected customer via GpDialogService: ${selected.name} (${selected.tier})`);
      }
    });
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
