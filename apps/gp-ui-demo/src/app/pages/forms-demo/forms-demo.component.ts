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
  GpColorPickerComponent,
  GpInputMaskComponent,
  GpSelectComponent,
  GpMultiSelectComponent,
  GpListboxComponent,
  GpAutoCompleteComponent,
  GpCascadeSelectComponent,
  GpTreeSelectComponent,
  GpDatePickerComponent,
  GpTimePickerComponent,
  GpFileUploadComponent,
  GpButtonComponent,
  GpCardComponent
} from 'gp-ui';

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
    GpColorPickerComponent,
    GpInputMaskComponent,
    GpSelectComponent,
    GpMultiSelectComponent,
    GpListboxComponent,
    GpAutoCompleteComponent,
    GpCascadeSelectComponent,
    GpTreeSelectComponent,
    GpDatePickerComponent,
    GpTimePickerComponent,
    GpFileUploadComponent,
    GpButtonComponent,
    GpCardComponent
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Form Components</h1>
        <p class="page-desc">20 production-ready form controls with full Angular Reactive Forms & ControlValueAccessor support.</p>
      </div>

      <!-- Reactive Form Container -->
      <form [formGroup]="demoForm" (ngSubmit)="onSubmit()">
        <!-- Text Inputs -->
        <div class="doc-section">
          <h2 class="doc-section-title">Text Inputs & Textarea</h2>
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
              <gp-textarea formControlName="bio" placeholder="Write a short bio..." [autoResize]="true" [maxlength]="200" />
            </div>
          </div>
        </div>

        <!-- Selection Controls -->
        <div class="doc-section">
          <h2 class="doc-section-title">Select, MultiSelect & Autocomplete</h2>
          <div class="form-grid">
            <div class="form-field">
              <label>Country (Single Select with Filter)</label>
              <gp-select formControlName="country" [options]="countries" optionLabel="name" optionValue="code" [filter]="true" placeholder="Select country" />
            </div>

            <div class="form-field">
              <label>Skills (Multi-Select Chips)</label>
              <gp-multi-select formControlName="skills" [options]="skillsList" display="chip" placeholder="Select skills" />
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
          <gp-file-upload [multiple]="true" accept="image/*" />
        </div>

        <!-- Submit & Form Value Inspector -->
        <div class="doc-section">
          <div class="form-actions">
            <gp-button label="Submit Form" type="submit" severity="primary" size="lg" />
            <gp-button label="Reset Form" type="button" variant="outlined" severity="secondary" (onClickEvent)="demoForm.reset()" />
          </div>

          <h3 style="margin-top: 1.5rem;">Reactive Form Value Inspector:</h3>
          <div class="doc-code-box">
            <pre><code>{{ demoForm.value | json }}</code></pre>
          </div>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
    }
    @media (max-width: 768px) {
      .form-grid { grid-template-columns: 1fr; }
    }
    .gp-col-span-2 {
      grid-column: span 2;
    }
    @media (max-width: 768px) {
      .gp-col-span-2 { grid-column: span 1; }
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
  `]
})
export class FormsDemoComponent {
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

  searchCities(event: any): void {
    const q = (event.query || '').toLowerCase();
    this.filteredCities = this.cities.filter(c => c.toLowerCase().includes(q));
  }

  onSubmit(): void {
    alert('Form submitted successfully! Check browser console or JSON inspector.');
    console.log('Submitted Form:', this.demoForm.value);
  }
}
