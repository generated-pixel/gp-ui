import { Component, ChangeDetectionStrategy, ViewEncapsulation, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpAvatarComponent, GpBadgeComponent, GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';
import { GpListWidgetData, GpGridListItem } from '../../models/grid-widget.model';
import { GpGridItem } from '../../models/grid-item.model';

@Component({
  selector: 'gp-grid-list-widget',
  standalone: true,
  imports: [CommonModule, GpAvatarComponent, GpBadgeComponent, GpButtonComponent, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './grid-list-widget.component.html',
  styleUrl: './grid-list-widget.component.scss',
  host: {
    class: 'gp-grid-list-widget-host'
  }
})
export class GpGridListWidgetComponent {
  public data = input<GpListWidgetData | undefined>(undefined);
  public item = input<GpGridItem | undefined>(undefined);
  public title = input<string>('');
  public actionLabel = input<string>('');
  public items = input<GpGridListItem[]>([]);

  public itemClick = output<GpGridListItem>();
  public actionClick = output<void>();

  public effectiveTitle = computed(() => this.title() || this.data()?.title || this.item()?.title || 'Activity Feed');
  public effectiveActionLabel = computed(() => this.actionLabel() || this.data()?.actionLabel || '');
  public effectiveItems = computed<GpGridListItem[]>(() => {
    if (this.items() && this.items().length > 0) return this.items();
    if (this.data()?.items && this.data()!.items.length > 0) return this.data()!.items;
    return [];
  });
}
