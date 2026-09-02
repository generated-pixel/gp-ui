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
import { GpBadge, GpTag, GpBadgeSeverity } from '@generatedpixel/gp-ui';

export interface GpBadgeItem {
  value: string;
  severity?: GpBadgeSeverity;
  isTag?: boolean;
}

export interface GpBadgeClusterGroup {
  id?: string;
  title: string;
  items: GpBadgeItem[];
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-data-display-badge-clusters',
  standalone: true,
  imports: [CommonModule, GpBadge, GpTag],
  templateUrl: './data-display-badge-clusters.html',
  styleUrl: './data-display-badge-clusters.scss'
})
export class GpDataDisplayBadgeClusters {
  public title = input<string>('');
  public subtitle = input<string>('');
  public groups = input<GpBadgeClusterGroup[]>([]);

  public itemClick = output<GpBadgeItem>();

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public badgeTemplate = input<TemplateRef<{ $implicit: GpBadgeItem }> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentBadgeTemplate = contentChild<TemplateRef<{ $implicit: GpBadgeItem }>>('badgeTemplate');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectiveBadgeTemplate = computed(() => this.badgeTemplate() || this.contentBadgeTemplate());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());
}
