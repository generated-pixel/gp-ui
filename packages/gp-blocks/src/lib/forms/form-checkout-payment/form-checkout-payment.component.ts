import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GpButtonComponent,
  GpInputTextComponent,
  GpIconComponent
} from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-form-checkout-payment',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpInputTextComponent, GpIconComponent],
  templateUrl: './form-checkout-payment.component.html',
  styleUrl: './form-checkout-payment.component.scss'
})
export class GpFormCheckoutPaymentComponent {
  @Input() title = 'Payment Details';
  @Input() subtitle = 'Complete your transaction with a credit or debit card.';
}
