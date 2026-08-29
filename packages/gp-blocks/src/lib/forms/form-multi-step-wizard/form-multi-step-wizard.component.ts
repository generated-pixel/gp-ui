import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GpButtonComponent,
  GpInputTextComponent,
  GpSelectComponent,
  GpCheckboxComponent,
  GpIconComponent
} from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-form-multi-step-wizard',
  standalone: true,
  imports: [
    CommonModule,
    GpButtonComponent,
    GpInputTextComponent,
    GpSelectComponent,
    GpCheckboxComponent,
    GpIconComponent
  ],
  templateUrl: './form-multi-step-wizard.component.html',
  styleUrl: './form-multi-step-wizard.component.scss'
})
export class GpFormMultiStepWizardComponent {
  currentStep = 1;

  nextStep() {
    if (this.currentStep < 3) this.currentStep++;
  }

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }
}
