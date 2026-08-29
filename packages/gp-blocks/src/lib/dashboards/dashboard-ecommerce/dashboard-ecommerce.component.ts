import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent, GpBadgeComponent, GpTagComponent, GpProgressBarComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-dashboard-ecommerce',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent, GpBadgeComponent, GpTagComponent, GpProgressBarComponent],
  templateUrl: './dashboard-ecommerce.component.html',
  styleUrl: './dashboard-ecommerce.component.scss'
})
export class GpDashboardEcommerceComponent {
  topProducts = [
    { name: 'Ultra-Comfort Ergonomic Chair', category: 'Office Furniture', revenue: '$24,800', sales: 62 },
    { name: 'Wireless Noise-Canceling Headset', category: 'Audio & Gadgets', revenue: '$18,450', sales: 123 },
    { name: 'Mechanical RGB Keyboard Pro', category: 'Peripherals', revenue: '$12,300', sales: 82 },
    { name: 'USB-C Thunderbolt Dock 12-in-1', category: 'Accessories', revenue: '$9,800', sales: 49 }
  ];

  recentOrders = [
    { id: '10492', customer: 'Alice Cooper', amount: '$349.00', status: 'Processing' },
    { id: '10491', customer: 'Bob Marley', amount: '$129.50', status: 'Delivered' },
    { id: '10490', customer: 'Charlie Watts', amount: '$89.00', status: 'In Transit' },
    { id: '10489', customer: 'David Bowie', amount: '$499.00', status: 'Delivered' }
  ];
}
