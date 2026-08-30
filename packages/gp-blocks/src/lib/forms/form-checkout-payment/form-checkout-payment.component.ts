import { Component, input, output, signal, Input, TemplateRef, ContentChild } from '@angular/core';
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

  public onPay(): void {
    this.submitPayment.emit({
      cardholderName: this.cardholderName(),
      cardNumber: this.cardNumber(),
      expiration: this.expiration(),
      cvc: this.cvc()
    });
  }
}
