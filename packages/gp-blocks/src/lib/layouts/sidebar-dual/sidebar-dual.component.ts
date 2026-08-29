import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpBadgeComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-sidebar-dual',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpBadgeComponent],
  templateUrl: './sidebar-dual.component.html',
  styleUrl: './sidebar-dual.component.scss'
})
export class GpLayoutSidebarDualComponent {
  @Input() subnavTitle = 'Projects Workspace';
  @Input() title = 'Active Projects Overview';
}
