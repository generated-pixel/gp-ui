import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpAvatarComponent, GpBadgeComponent, GpIconComponent, GpBadgeSeverity } from '@generatedpixel/gp-ui';

export interface GpFeedItem {
  id?: string;
  author: string;
  action: string;
  target: string;
  message?: string;
  time: string;
  avatarUrl?: string;
}

@Component({
  selector: 'gp-list-stacked-feed',
  standalone: true,
  imports: [CommonModule, GpAvatarComponent, GpBadgeComponent, GpIconComponent],
  templateUrl: './list-stacked-feed.component.html',
  styleUrl: './list-stacked-feed.component.scss'
})
export class GpListStackedFeedComponent {
  public title = input<string>('');
  public badgeText = input<string>('');
  public badgeSeverity = input<GpBadgeSeverity>('success');
  public feedItems = input<GpFeedItem[]>([]);

  public itemClick = output<GpFeedItem>();
  public itemOptionsClick = output<GpFeedItem>();
}
