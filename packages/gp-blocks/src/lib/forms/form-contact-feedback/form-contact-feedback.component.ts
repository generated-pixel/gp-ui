import { Component, input, output, signal, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent, GpInputTextComponent, GpSelectComponent, GpTextareaComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-form-contact-feedback',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent, GpInputTextComponent, GpSelectComponent, GpTextareaComponent],
  templateUrl: './form-contact-feedback.component.html',
  styleUrl: './form-contact-feedback.component.scss'
})
export class GpFormContactFeedbackComponent {
  public title = input<string>('');
  public subtitle = input<string>('');
  public sendBtnLabel = input<string>('Send Feedback');

  public name = signal<string>('');
  public email = signal<string>('');
  public category = signal<string>('general');
  public rating = signal<number>(5);
  public message = signal<string>('');

  public categoryOptions = [
    { label: 'General Inquiry', value: 'general' },
    { label: 'Bug Report', value: 'bug' },
    { label: 'Feature Request', value: 'feature' },
    { label: 'Billing Issue', value: 'billing' }
  ];

  public submitFeedback = output<{
    name: string;
    email: string;
    category: string;
    rating: number;
    message: string;
  }>();

  @Input() public headerTemplate?: TemplateRef<any>;
  @Input() public formTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('header') public contentHeader?: TemplateRef<any>;
  @ContentChild('form') public contentForm?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveHeader(): TemplateRef<any> | undefined {
    return this.headerTemplate || this.contentHeader;
  }

  public get effectiveForm(): TemplateRef<any> | undefined {
    return this.formTemplate || this.contentForm;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }

  public onSubmit(): void {
    this.submitFeedback.emit({
      name: this.name(),
      email: this.email(),
      category: this.category(),
      rating: this.rating(),
      message: this.message()
    });
  }
}
