import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  output,
  computed,
  Signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GpAvatarComponent,
  GpBadgeComponent,
  GpButtonComponent,
  GpIconComponent,
  GpSkeletonComponent
} from '@generatedpixel/gp-ui';
import { GpListWidgetData, GpGridListItem } from '../../models/grid-widget.model';
import { normalizeListWidgetData } from '../../services/widget-data-resolver';
import { GpGridWidgetBase } from '../../base/gp-grid-widget.base';

@Component({
  selector: 'gp-grid-list-widget',
  standalone: true,
  imports: [CommonModule, GpAvatarComponent, GpBadgeComponent, GpButtonComponent, GpIconComponent, GpSkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './grid-list-widget.component.html',
  styleUrl: './grid-list-widget.component.scss',
  host: {
    class: 'gp-grid-list-widget-host'
  }
})
export class GpGridListWidgetComponent extends GpGridWidgetBase<GpListWidgetData> {
  public title = input<string>('');
  public actionLabel = input<string>('');
  public items = input<GpGridListItem[]>([]);

  public itemClick = output<GpGridListItem>();
  public actionClick = output<void>();

  public override normalizedData: Signal<GpListWidgetData> = computed(() => {
    return normalizeListWidgetData(this.rawData());
  });

  public effectiveTitle = computed(() => this.title() || this.normalizedData().title || this.item()?.title || 'Activity Feed');
  public effectiveActionLabel = computed(() => this.actionLabel() || this.normalizedData().actionLabel || '');

  public effectiveItems = computed<GpGridListItem[]>(() => {
    if (this.items() && this.items().length > 0) return this.items();
    if (this.normalizedData().items && this.normalizedData().items!.length > 0) {
      return this.normalizedData().items!;
    }
    return [];
  });

  public onItemClicked(item: GpGridListItem, event?: Event): void {
    if (item.routerLink) {
      const navConfig = {
        routerLink: item.routerLink,
        queryParams: item.queryParams
      };
      this.executeNavigation(navConfig, event);
    }

    if (item.onClick) {
      item.onClick(item);
    }
    if (this.normalizedData().onItemClick) {
      this.normalizedData().onItemClick!(item);
    }

    this.itemClick.emit(item);
  }

  public onActionClicked(event?: Event): void {
    if (this.normalizedData().routerLink) {
      const navConfig = {
        routerLink: this.normalizedData().routerLink,
        queryParams: this.normalizedData().queryParams
      };
      this.executeNavigation(navConfig, event);
    }
    this.actionClick.emit();
  }
}
