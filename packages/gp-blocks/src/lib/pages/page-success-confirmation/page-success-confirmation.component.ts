import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-page-success-confirmation',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './page-success-confirmation.component.html',
  styleUrl: './page-success-confirmation.component.scss'
})
export class GpPageSuccessConfirmationComponent {
  public icon = input<string>('check-circle');
  public title = input<string>('');
  public description = input<string>('');
  public orderNumberLabel = input<string>('Order Number');
  public orderNumber = input<string>('');
  public emailLabel = input<string>('Confirmation Email');
  public email = input<string>('');
  public secondaryBtnLabel = input<string>('View Dashboard');
  public primaryBtnLabel = input<string>('Download Receipt');

  public secondaryAction = output<void>();
  public primaryAction = output<void>();
}
