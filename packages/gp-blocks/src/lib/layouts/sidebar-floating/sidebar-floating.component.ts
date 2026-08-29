import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpBadgeComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-sidebar-floating',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpBadgeComponent],
  templateUrl: './sidebar-floating.component.html',
  styleUrl: './sidebar-floating.component.scss'
})
export class GpLayoutSidebarFloatingComponent {
  @Input() brandName = 'Aura Studio';
  @Input() title = 'Dashboard Overview';
}
