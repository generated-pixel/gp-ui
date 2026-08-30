import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpTagComponent, GpBadgeSeverity } from '@generatedpixel/gp-ui';

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
  selector: 'gp-data-display-badge-clusters',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent, GpTagComponent],
  templateUrl: './data-display-badge-clusters.component.html',
  styleUrl: './data-display-badge-clusters.component.scss'
})
export class GpDataDisplayBadgeClustersComponent {
  public title = input<string>('');
  public subtitle = input<string>('');
  public groups = input<GpBadgeClusterGroup[]>([]);

  public itemClick = output<GpBadgeItem>();

  @Input() public headerTemplate?: TemplateRef<any>;
  @Input() public badgeTemplate?: TemplateRef<{ $implicit: GpBadgeItem }>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('header') public contentHeader?: TemplateRef<any>;
  @ContentChild('badgeTemplate') public contentBadgeTemplate?: TemplateRef<{ $implicit: GpBadgeItem }>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveHeader(): TemplateRef<any> | undefined {
    return this.headerTemplate || this.contentHeader;
  }

  public get effectiveBadgeTemplate(): TemplateRef<{ $implicit: GpBadgeItem }> | undefined {
    return this.badgeTemplate || this.contentBadgeTemplate;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }
}
