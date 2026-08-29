import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-form-checkout-payment',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './form-checkout-payment.component.html',
  styleUrl: './form-checkout-payment.component.scss'
})
export class GpFormCheckoutPaymentComponent {
  public title = input<string>('');
  public subtitle = input<string>('');
  public securityBadgeText = input<string>('256-Bit SSL Encrypted Payment');
  public payBtnLabel = input<string>('Pay Now');
  public amount = input<string>('');

  public cardholderName = signal<string>('');
  public cardNumber = signal<string>('');
  public expiration = signal<string>('');
  public cvc = signal<string>('');

  public submitPayment = output<{
    cardholderName: string;
    cardNumber: string;
    expiration: string;
    cvc: string;
  }>();

  public onPay(): void {
    this.submitPayment.emit({
      cardholderName: this.cardholderName(),
      cardNumber: this.cardNumber(),
      expiration: this.expiration(),
      cvc: this.cvc()
    });
  }
}
