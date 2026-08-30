import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpBillingInvoice {
  id?: string;
  date: string;
  amount: string;
  status: string;
  pdfUrl?: string;
}

@Component({
  selector: 'gp-settings-billing',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent, GpButtonComponent, GpIconComponent],
  templateUrl: './settings-billing.component.html',
  styleUrl: './settings-billing.component.scss'
})
export class GpSettingsBillingComponent {
  public title = input<string>('Billing & Subscriptions');
  public subtitle = input<string>('Manage your active subscription plan and download invoice history.');
  public planName = input<string>('Enterprise Plan');
  public planPrice = input<string>('$99 / month');
  public planStatus = input<string>('Active');
  public invoices = input<GpBillingInvoice[]>([]);

  public changePlan = output<void>();
  public cancelPlan = output<void>();
  public downloadInvoice = output<GpBillingInvoice>();

  @Input() public headerTemplate?: TemplateRef<any>;
  @Input() public planTemplate?: TemplateRef<any>;
  @Input() public invoicesTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('header') public contentHeader?: TemplateRef<any>;
  @ContentChild('plan') public contentPlan?: TemplateRef<any>;
  @ContentChild('invoices') public contentInvoices?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveHeader(): TemplateRef<any> | undefined {
    return this.headerTemplate || this.contentHeader;
  }

  public get effectivePlan(): TemplateRef<any> | undefined {
    return this.planTemplate || this.contentPlan;
  }

  public get effectiveInvoices(): TemplateRef<any> | undefined {
    return this.invoicesTemplate || this.contentInvoices;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }
}
