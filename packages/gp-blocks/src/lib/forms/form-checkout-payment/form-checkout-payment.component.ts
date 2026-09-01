import { Component, input, output, signal, TemplateRef, contentChild, computed, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent, GpInputTextComponent, GpPasswordComponent } from '@generatedpixel/gp-ui';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-form-checkout-payment',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent, GpInputTextComponent, GpPasswordComponent],
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

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public formTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentForm = contentChild<TemplateRef<any>>('form');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectiveForm = computed(() => this.formTemplate() || this.contentForm());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());

  public onPay(): void {
    this.submitPayment.emit({
      cardholderName: this.cardholderName(),
      cardNumber: this.cardNumber(),
      expiration: this.expiration(),
      cvc: this.cvc()
    });
  }
}
