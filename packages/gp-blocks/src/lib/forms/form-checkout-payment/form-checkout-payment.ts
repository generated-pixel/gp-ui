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
import { GpButton, GpIcon, GpInputText, GpPassword } from '@generatedpixel/gp-ui';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-form-checkout-payment',
  standalone: true,
  imports: [CommonModule, GpButton, GpIcon, GpInputText, GpPassword],
  templateUrl: './form-checkout-payment.html',
  styleUrl: './form-checkout-payment.scss'
})
export class GpFormCheckoutPayment {
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
