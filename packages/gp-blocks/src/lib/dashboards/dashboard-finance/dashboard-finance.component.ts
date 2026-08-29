import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpFinanceLedgerItem {
  id?: string;
  desc: string;
  date: string;
  amount: string;
  type: 'in' | 'out';
}

export interface GpFinanceInvoiceItem {
  id: string;
  client: string;
  due: string;
  amount: string;
  status: string;
}

@Component({
  selector: 'gp-dashboard-finance',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent, GpButtonComponent, GpIconComponent],
  templateUrl: './dashboard-finance.component.html',
  styleUrl: './dashboard-finance.component.scss'
})
export class GpDashboardFinanceComponent {
  public balanceLabel = input<string>('Total Liquid Treasury');
  public balanceAmount = input<string>('');
  public balanceMeta = input<string>('');
  public exportBtnLabel = input<string>('Export CSV');
  public sendPayoutBtnLabel = input<string>('Send Payout');
  public ledgerTitle = input<string>('Recent Transactions');
  public ledgerBadge = input<string>('');
  public ledger = input<GpFinanceLedgerItem[]>([]);
  public invoicesTitle = input<string>('Pending Invoices');
  public createInvoiceBtnLabel = input<string>('+ New Invoice');
  public invoices = input<GpFinanceInvoiceItem[]>([]);

  public exportClick = output<void>();
  public sendPayoutClick = output<void>();
  public ledgerItemClick = output<GpFinanceLedgerItem>();
  public createInvoiceClick = output<void>();
  public invoiceClick = output<GpFinanceInvoiceItem>();
}
