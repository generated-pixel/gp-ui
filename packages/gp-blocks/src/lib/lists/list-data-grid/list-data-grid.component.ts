import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpBadgeComponent, GpIconComponent, GpPaginatorComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-list-data-grid',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpBadgeComponent, GpIconComponent, GpPaginatorComponent],
  templateUrl: './list-data-grid.component.html',
  styleUrl: './list-data-grid.component.scss'
})
export class GpListDataGridComponent {
  rows = [
    { id: '89421', customer: 'Emma Watson', date: 'Aug 28, 2026', amount: '$499.00', payment: 'Paid', fulfillment: 'Shipped' },
    { id: '89420', customer: 'Liam Neeson', date: 'Aug 28, 2026', amount: '$1,240.50', payment: 'Paid', fulfillment: 'Processing' },
    { id: '89419', customer: 'Sophia Loren', date: 'Aug 27, 2026', amount: '$89.00', payment: 'Pending', fulfillment: 'Unfulfilled' },
    { id: '89418', customer: 'Keanu Reeves', date: 'Aug 27, 2026', amount: '$320.00', payment: 'Paid', fulfillment: 'Shipped' },
    { id: '89417', customer: 'Scarlett Johansson', date: 'Aug 26, 2026', amount: '$740.00', payment: 'Paid', fulfillment: 'Delivered' }
  ];
}
