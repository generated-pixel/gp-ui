import { Component, input, output, model, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';
import { GpGridComponent, GpGridItem } from '@generatedpixel/gp-grid';

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
  imports: [CommonModule, GpBadgeComponent, GpButtonComponent, GpIconComponent, GpGridComponent],
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

  // Grid Integration
  public gridColumns = input<number>(12);
  public gridRowHeight = input<number>(85);
  public gridGap = input<number>(16);
  public gridCompactType = input<'vertical' | 'none'>('vertical');
  public gridReadonly = input<boolean>(false);

  public widgets = model<GpGridItem[]>([
    {
      id: 'balance-banner',
      x: 0,
      y: 0,
      w: 12,
      h: 2,
      minW: 4,
      minH: 2,
      title: 'Treasury Balance',
      icon: 'star'
    },
    {
      id: 'ledger',
      x: 0,
      y: 2,
      w: 6,
      h: 5,
      minW: 4,
      minH: 3,
      title: 'Recent Transactions Ledger',
      icon: 'layer-group'
    },
    {
      id: 'invoices',
      x: 6,
      y: 2,
      w: 6,
      h: 5,
      minW: 4,
      minH: 3,
      title: 'Pending Invoices',
      icon: 'file'
    }
  ]);

  public exportClick = output<void>();
  public sendPayoutClick = output<void>();
  public ledgerItemClick = output<GpFinanceLedgerItem>();
  public createInvoiceClick = output<void>();
  public invoiceClick = output<GpFinanceInvoiceItem>();
  public layoutChange = output<GpGridItem[]>();

  @Input() public widgetTemplate?: TemplateRef<{ $implicit: GpGridItem }>;
  @Input() public headerActionsTemplate?: TemplateRef<any>;

  @ContentChild('widgetTemplate') public contentWidgetTemplate?: TemplateRef<{ $implicit: GpGridItem }>;
  @ContentChild('balance') public contentBalance?: TemplateRef<any>;
  @ContentChild('ledger') public contentLedger?: TemplateRef<any>;
  @ContentChild('invoices') public contentInvoices?: TemplateRef<any>;
  @ContentChild('headerActions') public contentHeaderActions?: TemplateRef<any>;

  public get effectiveWidgetTemplate(): TemplateRef<{ $implicit: GpGridItem }> | undefined {
    return this.widgetTemplate || this.contentWidgetTemplate;
  }

  public onLayoutChanged(newLayout: GpGridItem[]): void {
    this.widgets.set(newLayout);
    this.layoutChange.emit(newLayout);
  }
}
