import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpAvatarComponent, GpBadgeComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-header-profile-banner',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpAvatarComponent, GpBadgeComponent, GpIconComponent],
  templateUrl: './header-profile-banner.component.html',
  styleUrl: './header-profile-banner.component.scss'
})
export class GpHeaderProfileBannerComponent {
  @Input() userName = 'Dr. Alexander Hayes';
  @Input() statusText = 'Online';
  @Input() userTitle = 'Principal Architect';
  @Input() location = 'Seattle, WA';
}
