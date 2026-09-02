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
import {
  GpButton,
  GpCheckbox,
  GpIcon,
  GpInputText,
  GpPassword
} from '@generatedpixel/gp-ui';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-form-auth-split',
  standalone: true,
  imports: [
    CommonModule,
    GpButton,
    GpCheckbox,
    GpIcon,
    GpInputText,
    GpPassword
  ],
  templateUrl: './form-auth-split.html',
  styleUrl: './form-auth-split.scss'
})
export class GpFormAuthSplit {
  public brandName = input<string>('');
  public brandIcon = input<string>('box');
  public heroTitle = input<string>('');
  public heroDesc = input<string>('');
  public formTitle = input<string>('');
  public formSubtitle = input<string>('');
  public submitBtnLabel = input<string>('Sign in to Dashboard');

  public email = signal<string>('');
  public password = signal<string>('');
  public rememberMe = signal<boolean>(false);

  public submitLogin = output<{ email: string; pass: string; remember: boolean }>();
  public forgotPasswordClick = output<void>();

  public heroTemplate = input<TemplateRef<any> | undefined>(undefined);
  public formTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHero = contentChild<TemplateRef<any>>('hero');
  public contentForm = contentChild<TemplateRef<any>>('form');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveHero = computed(() => this.heroTemplate() || this.contentHero());

  public effectiveForm = computed(() => this.formTemplate() || this.contentForm());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());

  public onSubmit(): void {
    this.submitLogin.emit({
      email: this.email(),
      pass: this.password(),
      remember: this.rememberMe()
    });
  }
}
