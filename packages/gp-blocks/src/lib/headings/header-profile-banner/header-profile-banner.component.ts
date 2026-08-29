import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpAvatarComponent, GpBadgeComponent, GpIconComponent, GpBadgeSeverity } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-header-profile-banner',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpAvatarComponent, GpBadgeComponent, GpIconComponent],
  templateUrl: './header-profile-banner.component.html',
  styleUrl: './header-profile-banner.component.scss'
})
export class GpHeaderProfileBannerComponent {
  public userName = input<string>('');
  public statusText = input<string>('');
  public statusSeverity = input<GpBadgeSeverity>('success');
  public userTitle = input<string>('');
  public location = input<string>('');
  public connectBtnLabel = input<string>('Connect');
  public messageBtnLabel = input<string>('Send Message');

  public connectClick = output<void>();
  public messageClick = output<void>();
}
