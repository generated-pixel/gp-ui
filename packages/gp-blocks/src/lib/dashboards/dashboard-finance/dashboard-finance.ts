import {
  Component,
  input,
  output,
  model,
  TemplateRef,
  contentChild,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadge, GpButton, GpIcon } from '@generatedpixel/gp-ui';
import { GpGrid, GpGridItem } from '@generatedpixel/gp-grid';

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
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-dashboard-finance',
  standalone: true,
  imports: [CommonModule, GpBadge, GpButton, GpIcon, GpGrid],
  templateUrl: './dashboard-finance.html',
  styleUrl: './dashboard-finance.scss'
})
export class GpDashboardFinance {
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

  public widgetTemplate = input<TemplateRef<{ $implicit: GpGridItem }> | undefined>(undefined);
  public headerActionsTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentWidgetTemplate = contentChild<TemplateRef<{ $implicit: GpGridItem }>>('widgetTemplate');
  public contentBalance = contentChild<TemplateRef<any>>('balance');
  public contentLedger = contentChild<TemplateRef<any>>('ledger');
  public contentInvoices = contentChild<TemplateRef<any>>('invoices');
  public contentHeaderActions = contentChild<TemplateRef<any>>('headerActions');

  public effectiveWidgetTemplate = computed(() => this.widgetTemplate() || this.contentWidgetTemplate());

  public onLayoutChanged(newLayout: GpGridItem[]): void {
    this.widgets.set(newLayout);
    this.layoutChange.emit(newLayout);
  }
}
