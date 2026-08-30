import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
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

  @Input() public headerTemplate?: TemplateRef<any>;
  @Input() public itemsTemplate?: TemplateRef<any>;
  @Input() public totalsTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('header') public contentHeader?: TemplateRef<any>;
  @ContentChild('items') public contentItems?: TemplateRef<any>;
  @ContentChild('totals') public contentTotals?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveHeader(): TemplateRef<any> | undefined {
    return this.headerTemplate || this.contentHeader;
  }

  public get effectiveItems(): TemplateRef<any> | undefined {
    return this.itemsTemplate || this.contentItems;
  }

  public get effectiveTotals(): TemplateRef<any> | undefined {
    return this.totalsTemplate || this.contentTotals;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }
}
