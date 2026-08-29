import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpBadgeComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-sidebar-gradient',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpBadgeComponent],
  templateUrl: './sidebar-gradient.component.html',
  styleUrl: './sidebar-gradient.component.scss'
})
export class GpLayoutSidebarGradientComponent {
  @Input() brandName = 'Nova Enterprise';
  @Input() title = 'Operations Hub';
}
