import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpBadgeComponent, GpBadgeSeverity } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-page-maintenance',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpBadgeComponent],
  templateUrl: './page-maintenance.component.html',
  styleUrl: './page-maintenance.component.scss'
})
export class GpPageMaintenanceComponent {
  public badgeText = input<string>('');
  public badgeSeverity = input<GpBadgeSeverity>('warning');
  public icon = input<string>('sliders');
  public title = input<string>('');
  public description = input<string>('');
  public estimatedUptimeLabel = input<string>('Estimated Completion');
  public estimatedUptime = input<string>('');
}
