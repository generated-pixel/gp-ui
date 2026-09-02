import {
  Component,
  input,
  output,
  TemplateRef,
  contentChild,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButton, GpBadge, GpIcon } from '@generatedpixel/gp-ui';

export interface GpOrderItem {
  name: string;
  sku: string;
  qty: number;
  price: string;
  total: string;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-details-order-summary',
  standalone: true,
  imports: [CommonModule, GpButton, GpBadge, GpIcon],
  templateUrl: './details-order-summary.html',
  styleUrl: './details-order-summary.scss'
})
export class GpDetailsOrderSummary {
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

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public itemsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public totalsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentItems = contentChild<TemplateRef<any>>('items');
  public contentTotals = contentChild<TemplateRef<any>>('totals');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectiveItems = computed(() => this.itemsTemplate() || this.contentItems());

  public effectiveTotals = computed(() => this.totalsTemplate() || this.contentTotals());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());
}
