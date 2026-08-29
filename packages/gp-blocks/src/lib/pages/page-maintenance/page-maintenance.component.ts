import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpBadgeComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-page-maintenance',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpBadgeComponent],
  templateUrl: './page-maintenance.component.html',
  styleUrl: './page-maintenance.component.scss'
})
export class GpPageMaintenanceComponent {
  @Input() title = 'We’ll be right back!';
  @Input() description = 'We are currently upgrading database nodes and index clusters to improve overall system throughput and query speed.';
  @Input() estimatedUptime = 'Today at 03:30 UTC (~25 mins remaining)';
}
