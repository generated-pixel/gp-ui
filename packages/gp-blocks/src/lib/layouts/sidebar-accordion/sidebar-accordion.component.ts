import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpBadgeComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-sidebar-accordion',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpBadgeComponent],
  templateUrl: './sidebar-accordion.component.html',
  styleUrl: './sidebar-accordion.component.scss'
})
export class GpLayoutSidebarAccordionComponent {
  @Input() brandName = 'Enterprise Admin';
  @Input() title = 'Traffic Metrics & Telemetry';

  group1Open = true;
  group2Open = false;
  group3Open = false;

  toggleGroup(g: number) {
    if (g === 1) this.group1Open = !this.group1Open;
    if (g === 2) this.group2Open = !this.group2Open;
    if (g === 3) this.group3Open = !this.group3Open;
  }
}
