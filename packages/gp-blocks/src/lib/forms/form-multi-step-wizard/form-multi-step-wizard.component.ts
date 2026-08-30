import { Component, input, output, signal, Input, TemplateRef, ContentChild } from '@angular/core';
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

  @Input() public stepperTemplate?: TemplateRef<any>;
  @Input() public step1Template?: TemplateRef<any>;
  @Input() public step2Template?: TemplateRef<any>;
  @Input() public step3Template?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('stepper') public contentStepper?: TemplateRef<any>;
  @ContentChild('step1') public contentStep1?: TemplateRef<any>;
  @ContentChild('step2') public contentStep2?: TemplateRef<any>;
  @ContentChild('step3') public contentStep3?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveStepper(): TemplateRef<any> | undefined {
    return this.stepperTemplate || this.contentStepper;
  }

  public get effectiveStep1(): TemplateRef<any> | undefined {
    return this.step1Template || this.contentStep1;
  }

  public get effectiveStep2(): TemplateRef<any> | undefined {
    return this.step2Template || this.contentStep2;
  }

  public get effectiveStep3(): TemplateRef<any> | undefined {
    return this.step3Template || this.contentStep3;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }

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
