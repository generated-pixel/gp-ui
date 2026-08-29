import { Component, Input } from '@angular/core';
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
  @Input() title = 'Payment Successful & Order Confirmed!';
  @Input() description = 'Thank you for your business. We have received your order and are preparing your high-performance enterprise workspace.';
  @Input() orderNumber = 'GP-89421-US';
  @Input() email = 'graeme@generatedpixel.dev';
}
