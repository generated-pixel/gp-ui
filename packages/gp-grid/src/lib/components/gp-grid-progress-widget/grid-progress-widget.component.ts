import { Component, ChangeDetectionStrategy, ViewEncapsulation, input, output, computed, Signal } from '@angular/core';

import { GpProgressBarComponent, GpIconComponent, GpSkeletonComponent } from '@generatedpixel/gp-ui';
import { GpProgressWidgetData, GpGridProgressItem } from '../../models/grid-widget.model';
import { normalizeProgressWidgetData } from '../../services/widget-data-resolver';
import { GpGridWidgetBase } from '../../base/gp-grid-widget.base';

@Component({
  selector: 'gp-grid-progress-widget',
  standalone: true,
  imports: [GpProgressBarComponent, GpIconComponent, GpSkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './grid-progress-widget.component.html',
  styleUrl: './grid-progress-widget.component.scss',
  host: {
    class: 'gp-grid-progress-widget-host'
  }
})
export class GpGridProgressWidgetComponent extends GpGridWidgetBase<GpProgressWidgetData> {
  public title = input<string>('');
  public target = input<string>('');
  public items = input<GpGridProgressItem[]>([]);

  public itemClick = output<GpGridProgressItem>();

  public override normalizedData: Signal<GpProgressWidgetData> = computed(() => {
    return normalizeProgressWidgetData(this.rawData());
  });

  public effectiveTitle = computed(
    () =>
      this.title() ||
      this.normalizedData().title ||
      this.normalizedData().goalsTitle ||
      this.item()?.title ||
      'Target Goals'
  );
  public effectiveTarget = computed(
    () => this.target() || this.normalizedData().target || this.normalizedData().goalsTarget || ''
  );

  public effectiveItems = computed<GpGridProgressItem[]>(() => {
    if (this.items() && this.items().length > 0) return this.items();
    if (this.normalizedData().items && this.normalizedData().items!.length > 0) {
      return this.normalizedData().items!;
    }
    return [
      { label: 'Q1 Enterprise Growth', valueText: '84%', percentage: 84 },
      { label: 'Cloud Migrations', valueText: '62%', percentage: 62 },
      { label: 'SLA Uptime Compliance', valueText: '99.9%', percentage: 99 }
    ];
  });

  public onItemClicked(progressItem: GpGridProgressItem, event?: Event): void {
    if (progressItem.routerLink) {
      const navConfig = {
        routerLink: progressItem.routerLink,
        queryParams: progressItem.queryParams
      };
      this.executeNavigation(navConfig, event);
    }

    if (progressItem.onClick) {
      progressItem.onClick(progressItem);
    }
    if (this.normalizedData().onItemClick) {
      this.normalizedData().onItemClick!(progressItem);
    }

    this.itemClick.emit(progressItem);
  }
}
