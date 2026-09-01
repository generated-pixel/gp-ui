import { Component, input, output, TemplateRef, contentChild, computed, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpAvatarComponent, GpBadgeComponent, GpIconComponent, GpBadgeSeverity } from '@generatedpixel/gp-ui';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  public bannerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public profileTemplate = input<TemplateRef<any> | undefined>(undefined);
  public actionsTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentBanner = contentChild<TemplateRef<any>>('banner');
  public contentProfile = contentChild<TemplateRef<any>>('profile');
  public contentActions = contentChild<TemplateRef<any>>('actions');

  public effectiveBanner = computed(() => this.bannerTemplate() || this.contentBanner());

  public effectiveProfile = computed(() => this.profileTemplate() || this.contentProfile());

  public effectiveActions = computed(() => this.actionsTemplate() || this.contentActions());
}
