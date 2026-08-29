import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpWizardStepItem {
  number: number;
  label: string;
}

@Component({
  selector: 'gp-form-multi-step-wizard',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './form-multi-step-wizard.component.html',
  styleUrl: './form-multi-step-wizard.component.scss'
})
export class GpFormMultiStepWizardComponent {
  public steps = input<GpWizardStepItem[]>([
    { number: 1, label: 'Account Credentials' },
    { number: 2, label: 'Organization' },
    { number: 3, label: 'Confirmation' }
  ]);

  public currentStep = signal<number>(1);

  public fullName = signal<string>('');
  public email = signal<string>('');
  public companyName = signal<string>('');
  public companyWebsite = signal<string>('');
  public agreeTerms = signal<boolean>(false);

  public complete = output<{
    fullName: string;
    email: string;
    companyName: string;
    companyWebsite: string;
    agreeTerms: boolean;
  }>();

  public nextStep(): void {
    if (this.currentStep() < this.steps().length) {
      this.currentStep.update(s => s + 1);
    } else {
      this.complete.emit({
        fullName: this.fullName(),
        email: this.email(),
        companyName: this.companyName(),
        companyWebsite: this.companyWebsite(),
        agreeTerms: this.agreeTerms()
      });
    }
  }

  public prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }
}
