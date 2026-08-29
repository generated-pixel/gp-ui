import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent, GpBadgeComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-settings-billing',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent, GpBadgeComponent],
  templateUrl: './settings-billing.component.html',
  styleUrl: './settings-billing.component.scss'
})
export class GpSettingsBillingComponent {
  @Input() title = 'Billing & Subscription Plans';
  @Input() subtitle = 'Manage your organization subscription plan, payment methods, and invoice history.';

  invoices = [
    { date: 'Aug 01, 2026', amount: '$499.00' },
    { date: 'Jul 01, 2026', amount: '$499.00' },
    { date: 'Jun 01, 2026', amount: '$499.00' }
  ];
}
