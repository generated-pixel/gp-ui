import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpBadgeSeverity } from '@generatedpixel/gp-ui';

export interface GpDescriptionListItem {
  label: string;
  value: string;
  badge?: boolean;
  badgeSeverity?: GpBadgeSeverity;
}

@Component({
  selector: 'gp-data-display-description-list',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent],
  templateUrl: './data-display-description-list.component.html',
  styleUrl: './data-display-description-list.component.scss'
})
export class GpDataDisplayDescriptionListComponent {
  public title = input<string>('');
  public subtitle = input<string>('');
  public items = input<GpDescriptionListItem[]>([]);

  public itemClick = output<GpDescriptionListItem>();

  @Input() public headerTemplate?: TemplateRef<any>;
  @Input() public itemTemplate?: TemplateRef<{ $implicit: GpDescriptionListItem }>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('header') public contentHeader?: TemplateRef<any>;
  @ContentChild('itemTemplate') public contentItemTemplate?: TemplateRef<{ $implicit: GpDescriptionListItem }>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveHeader(): TemplateRef<any> | undefined {
    return this.headerTemplate || this.contentHeader;
  }

  public get effectiveItemTemplate(): TemplateRef<{ $implicit: GpDescriptionListItem }> | undefined {
    return this.itemTemplate || this.contentItemTemplate;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }
}
