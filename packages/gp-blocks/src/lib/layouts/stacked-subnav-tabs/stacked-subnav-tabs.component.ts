import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpBadgeComponent, GpAvatarComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-stacked-subnav-tabs',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpBadgeComponent, GpAvatarComponent],
  templateUrl: './stacked-subnav-tabs.component.html',
  styleUrl: './stacked-subnav-tabs.component.scss'
})
export class GpLayoutStackedSubnavTabsComponent {
  @Input() brandName = 'Nexus Hub';
  @Input() userName = 'Diana Prince';
}
