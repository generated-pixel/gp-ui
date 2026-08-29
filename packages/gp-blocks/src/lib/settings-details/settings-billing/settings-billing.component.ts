import { Component, input, output } from '@angular/core';
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
  public title = input<string>('');
  public subtitle = input<string>('');
  public planName = input<string>('');
  public planPrice = input<string>('');
  public planStatus = input<string>('Active');
  public invoices = input<GpBillingInvoice[]>([]);

  public changePlan = output<void>();
  public cancelPlan = output<void>();
  public downloadInvoice = output<GpBillingInvoice>();
}
