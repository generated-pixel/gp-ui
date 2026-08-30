import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
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

  @Input() public headerTemplate?: TemplateRef<any>;
  @Input() public feedItemTemplate?: TemplateRef<{ $implicit: GpFeedItem }>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('header') public contentHeader?: TemplateRef<any>;
  @ContentChild('feedItemTemplate') public contentFeedItemTemplate?: TemplateRef<{ $implicit: GpFeedItem }>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveHeader(): TemplateRef<any> | undefined {
    return this.headerTemplate || this.contentHeader;
  }

  public get effectiveFeedItemTemplate(): TemplateRef<{ $implicit: GpFeedItem }> | undefined {
    return this.feedItemTemplate || this.contentFeedItemTemplate;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }
}
