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
import { GpButton, GpIcon, GpInputText, GpSelect, GpTextarea } from '@generatedpixel/gp-ui';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-form-contact-feedback',
  standalone: true,
  imports: [CommonModule, GpButton, GpIcon, GpInputText, GpSelect, GpTextarea],
  templateUrl: './form-contact-feedback.html',
  styleUrl: './form-contact-feedback.scss'
})
export class GpFormContactFeedback {
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

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public formTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentForm = contentChild<TemplateRef<any>>('form');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectiveForm = computed(() => this.formTemplate() || this.contentForm());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());

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
