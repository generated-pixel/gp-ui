import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent, GpBadgeComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-dashboard-finance',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent, GpBadgeComponent],
  templateUrl: './dashboard-finance.component.html',
  styleUrl: './dashboard-finance.component.scss'
})
export class GpDashboardFinanceComponent {
  ledger = [
    { desc: 'Stripe SaaS Payout Batch #892', date: 'Today at 2:15 PM', amount: '$42,850.00', type: 'in' },
    { desc: 'Amazon Web Services Cloud Infrastructure', date: 'Yesterday at 9:00 AM', amount: '$6,420.15', type: 'out' },
    { desc: 'Enterprise Client Wire (Apex Corp)', date: 'Aug 24, 2026', amount: '$120,000.00', type: 'in' },
    { desc: 'Figma Team Licenses Renewal', date: 'Aug 22, 2026', amount: '$1,800.00', type: 'out' }
  ];

  invoices = [
    { client: 'Acme Global Corporation', id: 'INV-2026-041', due: 'Sep 15, 2026', amount: '$48,000.00', status: 'Pending' },
    { client: 'Starlight Media Studios', id: 'INV-2026-040', due: 'Sep 10, 2026', amount: '$18,500.00', status: 'Pending' },
    { client: 'OmniCorp Technologies', id: 'INV-2026-039', due: 'Aug 30, 2026', amount: '$32,000.00', status: 'Paid' }
  ];
}
