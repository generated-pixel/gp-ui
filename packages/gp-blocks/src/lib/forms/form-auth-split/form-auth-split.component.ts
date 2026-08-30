import { Component, input, output, signal, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-form-auth-split',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './form-auth-split.component.html',
  styleUrl: './form-auth-split.component.scss'
})
export class GpFormAuthSplitComponent {
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

  @Input() public heroTemplate?: TemplateRef<any>;
  @Input() public formTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('hero') public contentHero?: TemplateRef<any>;
  @ContentChild('form') public contentForm?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveHero(): TemplateRef<any> | undefined {
    return this.heroTemplate || this.contentHero;
  }

  public get effectiveForm(): TemplateRef<any> | undefined {
    return this.formTemplate || this.contentForm;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }

  public onSubmit(): void {
    this.submitLogin.emit({
      email: this.email(),
      pass: this.password(),
      remember: this.rememberMe()
    });
  }
}
