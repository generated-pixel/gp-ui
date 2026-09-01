import {
  Component,
  input,
  output,
  signal,
  TemplateRef,
  contentChild,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpCheckboxComponent, GpIconComponent, GpInputTextComponent } from '@generatedpixel/gp-ui';

export interface GpWizardStepItem {
  number: number;
  label: string;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-form-multi-step-wizard',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpCheckboxComponent, GpIconComponent, GpInputTextComponent],
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

  public stepperTemplate = input<TemplateRef<any> | undefined>(undefined);
  public step1Template = input<TemplateRef<any> | undefined>(undefined);
  public step2Template = input<TemplateRef<any> | undefined>(undefined);
  public step3Template = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentStepper = contentChild<TemplateRef<any>>('stepper');
  public contentStep1 = contentChild<TemplateRef<any>>('step1');
  public contentStep2 = contentChild<TemplateRef<any>>('step2');
  public contentStep3 = contentChild<TemplateRef<any>>('step3');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveStepper = computed(() => this.stepperTemplate() || this.contentStepper());

  public effectiveStep1 = computed(() => this.step1Template() || this.contentStep1());

  public effectiveStep2 = computed(() => this.step2Template() || this.contentStep2());

  public effectiveStep3 = computed(() => this.step3Template() || this.contentStep3());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());

  public nextStep(): void {
    if (this.currentStep() < this.steps().length) {
      this.currentStep.update((s) => s + 1);
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
      this.currentStep.update((s) => s - 1);
    }
  }
}
