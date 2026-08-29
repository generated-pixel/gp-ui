import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpAvatarComponent, GpBadgeComponent, GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpCustomerMetaField {
  label: string;
  value: string;
  isLink?: boolean;
  href?: string;
}

export interface GpCustomerTimelineEvent {
  id?: string;
  title: string;
  date: string;
  bulletClass?: string;
}

@Component({
  selector: 'gp-details-customer-overview',
  standalone: true,
  imports: [CommonModule, GpAvatarComponent, GpBadgeComponent, GpButtonComponent, GpIconComponent],
  templateUrl: './details-customer-overview.component.html',
  styleUrl: './details-customer-overview.component.scss'
})
export class GpDetailsCustomerOverviewComponent {
  public customerName = input<string>('');
  public customerStatus = input<string>('Active');
  public companyName = input<string>('');
  public location = input<string>('');
  public tags = input<string[]>([]);
  public editBtnLabel = input<string>('Edit Contact');
  public newDealBtnLabel = input<string>('New Deal');

  public metaFields = input<GpCustomerMetaField[]>([]);
  public timelineEvents = input<GpCustomerTimelineEvent[]>([]);

  public editContact = output<void>();
  public newDeal = output<void>();
  public eventClick = output<GpCustomerTimelineEvent>();
}
