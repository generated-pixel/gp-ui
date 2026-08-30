import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
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

  @Input() public headerTemplate?: TemplateRef<any>;
  @Input() public transactionTemplate?: TemplateRef<{ $implicit: GpTransactionListItem }>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('header') public contentHeader?: TemplateRef<any>;
  @ContentChild('transactionTemplate') public contentTransactionTemplate?: TemplateRef<{ $implicit: GpTransactionListItem }>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveHeader(): TemplateRef<any> | undefined {
    return this.headerTemplate || this.contentHeader;
  }

  public get effectiveTransactionTemplate(): TemplateRef<{ $implicit: GpTransactionListItem }> | undefined {
    return this.transactionTemplate || this.contentTransactionTemplate;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }
}
