import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpAvatarComponent, GpBadgeComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-details-customer-overview',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpAvatarComponent, GpBadgeComponent, GpIconComponent],
  templateUrl: './details-customer-overview.component.html',
  styleUrl: './details-customer-overview.component.scss'
})
export class GpDetailsCustomerOverviewComponent {
  @Input() customerName = 'Robert Downey';
  @Input() customerStatus = 'Active Partner';
  @Input() companyName = 'Downey Industries & Tech';
  @Input() location = 'San Francisco, CA';
  @Input() email = 'r.downey@downeyind.com';
  @Input() phone = '+1 (415) 890-4100';
}
