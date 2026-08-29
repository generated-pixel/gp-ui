import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpBadgeComponent, GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpOrderItem {
  name: string;
  sku: string;
  qty: number;
  price: string;
  total: string;
}

@Component({
  selector: 'gp-details-order-summary',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpBadgeComponent, GpIconComponent],
  templateUrl: './details-order-summary.component.html',
  styleUrl: './details-order-summary.component.scss'
})
export class GpDetailsOrderSummaryComponent {
  public orderId = input<string>('');
  public orderStatus = input<string>('Paid');
  public orderDate = input<string>('');
  public paymentMethod = input<string>('');
  public downloadReceiptBtnLabel = input<string>('Download Receipt');

  public items = input<GpOrderItem[]>([]);
  public subtotal = input<string>('');
  public shipping = input<string>('');
  public tax = input<string>('');
  public grandTotal = input<string>('');

  public downloadReceipt = output<void>();
  public itemClick = output<GpOrderItem>();
}
