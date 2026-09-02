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
import { GpBadge, GpButton, GpIcon } from '@generatedpixel/gp-ui';

export interface GpBillingInvoice {
  id?: string;
  date: string;
  amount: string;
  status: string;
  pdfUrl?: string;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-settings-billing',
  standalone: true,
  imports: [CommonModule, GpBadge, GpButton, GpIcon],
  templateUrl: './settings-billing.html',
  styleUrl: './settings-billing.scss'
})
export class GpSettingsBilling {
  public title = input<string>('Billing & Subscriptions');
  public subtitle = input<string>('Manage your active subscription plan and download invoice history.');
  public planName = input<string>('Enterprise Plan');
  public planPrice = input<string>('$99 / month');
  public planStatus = input<string>('Active');
  public invoices = input<GpBillingInvoice[]>([]);

  public changePlan = output<void>();
  public cancelPlan = output<void>();
  public downloadInvoice = output<GpBillingInvoice>();

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public planTemplate = input<TemplateRef<any> | undefined>(undefined);
  public invoicesTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentPlan = contentChild<TemplateRef<any>>('plan');
  public contentInvoices = contentChild<TemplateRef<any>>('invoices');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectivePlan = computed(() => this.planTemplate() || this.contentPlan());

  public effectiveInvoices = computed(() => this.invoicesTemplate() || this.contentInvoices());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());
}
