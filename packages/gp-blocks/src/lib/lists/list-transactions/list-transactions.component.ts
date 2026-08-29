import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpBadgeComponent, GpBadgeSeverity } from '@generatedpixel/gp-ui';

export interface GpTransactionListItem {
  id?: string;
  title: string;
  category: string;
  date: string;
  amount: string;
  type: 'in' | 'out';
  status: 'Completed' | 'Pending' | 'Failed' | string;
}

@Component({
  selector: 'gp-list-transactions',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpBadgeComponent],
  templateUrl: './list-transactions.component.html',
  styleUrl: './list-transactions.component.scss'
})
export class GpListTransactionsComponent {
  public title = input<string>('');
  public badgeText = input<string>('');
  public badgeSeverity = input<GpBadgeSeverity>('success');
  public transactions = input<GpTransactionListItem[]>([]);

  public transactionClick = output<GpTransactionListItem>();
}
