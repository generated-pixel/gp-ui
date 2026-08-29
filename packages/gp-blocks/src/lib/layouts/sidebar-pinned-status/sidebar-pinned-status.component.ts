import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpBadgeComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-sidebar-pinned-status',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpBadgeComponent],
  templateUrl: './sidebar-pinned-status.component.html',
  styleUrl: './sidebar-pinned-status.component.scss'
})
export class GpLayoutSidebarPinnedStatusComponent {
  @Input() brandName = 'Sentinel Ops';
  @Input() systemStatus = 'All Systems Operational';
  @Input() uptimeText = '99.98% Uptime';
  @Input() title = 'Cluster Infrastructure';
}
