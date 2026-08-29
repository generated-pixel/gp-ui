import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpBadgeComponent, GpAvatarComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-sidebar-dark',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpBadgeComponent, GpAvatarComponent],
  templateUrl: './sidebar-dark.component.html',
  styleUrl: './sidebar-dark.component.scss'
})
export class GpLayoutSidebarDarkComponent {
  @Input() brandName = 'Enterprise UI';
  @Input() brandIcon = 'box';
  @Input() navGroupLabel = 'Main Menu';
  @Input() userName = 'Sarah Connor';
  @Input() userEmail = 'sarah.c@company.io';
  @Input() title = 'Executive Dashboard';
}
