import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpBadgeComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-list-transactions',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpBadgeComponent],
  templateUrl: './list-transactions.component.html',
  styleUrl: './list-transactions.component.scss'
})
export class GpListTransactionsComponent {
  @Input() title = 'Recent Banking Transactions';

  transactions = [
    { title: 'Stripe SaaS Subscription Batch', category: 'Customer Inflow', date: 'Today at 3:15 PM', amount: '$12,480.00', type: 'in', status: 'Completed' },
    { title: 'Google Cloud Platform Hosting', category: 'Cloud Operations', date: 'Yesterday at 11:20 AM', amount: '$3,890.50', type: 'out', status: 'Completed' },
    { title: 'Enterprise Contract (Apex Corp)', category: 'Direct Wire', date: 'Aug 24, 2026', amount: '$48,000.00', type: 'in', status: 'Completed' }
  ];
}
