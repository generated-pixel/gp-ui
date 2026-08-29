import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpBadgeComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-details-order-summary',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpBadgeComponent, GpIconComponent],
  templateUrl: './details-order-summary.component.html',
  styleUrl: './details-order-summary.component.scss'
})
export class GpDetailsOrderSummaryComponent {
  @Input() orderId = 'ORD-89421';
  @Input() orderStatus = 'Completed & Paid';
  @Input() orderDate = 'August 28, 2026';
  @Input() paymentMethod = 'Mastercard ending in 4242';
  @Input() subtotal = '$698.00';
  @Input() shipping = '$15.00';
  @Input() tax = '$57.58';
  @Input() grandTotal = '$770.58';

  items = [
    { name: 'Ergonomic Desk Frame (Motorized Dual)', sku: 'ED-900-BLK', qty: 1, price: '$499.00', total: '$499.00' },
    { name: 'Dual Monitor Articulated Arm', sku: 'MA-200-SLV', qty: 1, price: '$199.00', total: '$199.00' }
  ];
}
