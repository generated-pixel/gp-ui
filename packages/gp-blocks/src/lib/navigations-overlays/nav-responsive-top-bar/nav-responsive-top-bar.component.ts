import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpAvatarComponent, GpBadgeComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-nav-responsive-top-bar',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpAvatarComponent, GpBadgeComponent],
  templateUrl: './nav-responsive-top-bar.component.html',
  styleUrl: './nav-responsive-top-bar.component.scss'
})
export class GpNavResponsiveTopBarComponent {
  @Input() brandName = 'Apex Cloud';
  @Input() userName = 'Graeme Gorman';
}
