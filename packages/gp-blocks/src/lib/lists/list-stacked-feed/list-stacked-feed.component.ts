import {
  Component,
  input,
  output,
  TemplateRef,
  contentChild,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GpAvatarComponent,
  GpBadgeComponent,
  GpButtonComponent,
  GpIconComponent,
  GpBadgeSeverity
} from '@generatedpixel/gp-ui';

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
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-list-stacked-feed',
  standalone: true,
  imports: [CommonModule, GpAvatarComponent, GpBadgeComponent, GpButtonComponent, GpIconComponent],
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

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public feedItemTemplate = input<TemplateRef<{ $implicit: GpFeedItem }> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentFeedItemTemplate = contentChild<TemplateRef<{ $implicit: GpFeedItem }>>('feedItemTemplate');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectiveFeedItemTemplate = computed(() => this.feedItemTemplate() || this.contentFeedItemTemplate());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());
}
