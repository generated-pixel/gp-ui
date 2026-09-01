import { Component, input, output, TemplateRef, contentChild, computed, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpBadgeSeverity } from '@generatedpixel/gp-ui';

export interface GpDescriptionListItem {
  label: string;
  value: string;
  badge?: boolean;
  badgeSeverity?: GpBadgeSeverity;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public itemTemplate = input<TemplateRef<{ $implicit: GpDescriptionListItem }> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentItemTemplate = contentChild<TemplateRef<{ $implicit: GpDescriptionListItem }>>('itemTemplate');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectiveItemTemplate = computed(() => this.itemTemplate() || this.contentItemTemplate());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());
}
