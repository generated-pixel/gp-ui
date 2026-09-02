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
import { GpIcon, GpBadge, GpBadgeSeverity } from '@generatedpixel/gp-ui';

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
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-list-transactions',
  standalone: true,
  imports: [CommonModule, GpIcon, GpBadge],
  templateUrl: './list-transactions.html',
  styleUrl: './list-transactions.scss'
})
export class GpListTransactions {
  public title = input<string>('');
  public badgeText = input<string>('');
  public badgeSeverity = input<GpBadgeSeverity>('success');
  public transactions = input<GpTransactionListItem[]>([]);

  public transactionClick = output<GpTransactionListItem>();

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public transactionTemplate = input<TemplateRef<{ $implicit: GpTransactionListItem }> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentTransactionTemplate =
    contentChild<TemplateRef<{ $implicit: GpTransactionListItem }>>('transactionTemplate');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectiveTransactionTemplate = computed(() => this.transactionTemplate() || this.contentTransactionTemplate());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());
}
