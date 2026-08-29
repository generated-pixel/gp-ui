import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-form-contact-feedback',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
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

  public submitFeedback = output<{
    name: string;
    email: string;
    category: string;
    rating: number;
    message: string;
  }>();

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
