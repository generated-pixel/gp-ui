import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpBadgeComponent, GpAvatarComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-sidebar-light',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpBadgeComponent, GpAvatarComponent],
  templateUrl: './sidebar-light.component.html',
  styleUrl: './sidebar-light.component.scss'
})
export class GpLayoutSidebarLightComponent {
  @Input() brandName = 'Cloud Portal';
  @Input() brandIcon = 'layer-group';
  @Input() title = 'Workspace Home';
}
