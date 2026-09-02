import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  input,
  output,
  computed,
  signal,
  Signal
} from '@angular/core';

import { GpBadgeComponent, GpBadgeSeverity, GpIconComponent, GpSkeletonComponent } from '@generatedpixel/gp-ui';
import { GpChartWidgetData, GpChartWidgetMonthlyData } from '../../models/grid-widget.model';
import { normalizeChartWidgetData } from '../../services/widget-data-resolver';
import { GpGridWidgetBase } from '../../base/gp-grid-widget.base';

@Component({
  selector: 'gp-grid-chart-widget',
  standalone: true,
  imports: [GpBadgeComponent, GpIconComponent, GpSkeletonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './grid-chart-widget.component.html',
  styleUrl: './grid-chart-widget.component.scss',
  host: {
    class: 'gp-grid-chart-widget-host'
  }
})
export class GpGridChartWidgetComponent extends GpGridWidgetBase<GpChartWidgetData> {
  public title = input<string>('');
  public subtitle = input<string>('');
  public badge = input<string>('');
  public badgeSeverity = input<GpBadgeSeverity>('success');
  public monthlyData = input<GpChartWidgetMonthlyData[]>([]);
  public timeRangeOptions = input<string[] | undefined>(undefined);
  public selectedTimeRange = input<string | undefined>(undefined);

  public timeRangeChange = output<string>();
  public columnClick = output<GpChartWidgetMonthlyData>();

  public activeRange = signal<string>('30D');

  public override normalizedData: Signal<GpChartWidgetData> = computed(() => {
    return normalizeChartWidgetData(this.rawData());
  });

  public effectiveTitle = computed(
    () => this.title() || this.normalizedData().title || this.item()?.title || 'Revenue & Performance'
  );
  public effectiveSubtitle = computed(() => this.subtitle() || this.normalizedData().subtitle || '');
  public effectiveBadge = computed(() => this.badge() || this.normalizedData().badge || '');
  public effectiveBadgeSeverity = computed<GpBadgeSeverity>(
    () => this.badgeSeverity() || this.normalizedData().badgeSeverity || 'success'
  );
  public effectiveRanges = computed(
    () => this.timeRangeOptions() || this.normalizedData().timeRangeOptions || ['7D', '30D', '90D', '1Y']
  );

  public effectiveMonthlyData = computed<GpChartWidgetMonthlyData[]>(() => {
    if (this.monthlyData() && this.monthlyData().length > 0) {
      return this.monthlyData();
    }
    if (this.normalizedData().monthlyData && this.normalizedData().monthlyData!.length > 0) {
      return this.normalizedData().monthlyData!;
    }
    return [
      { month: 'Jan', amt: '$12k', pct: 45 },
      { month: 'Feb', amt: '$19k', pct: 65 },
      { month: 'Mar', amt: '$24k', pct: 80 },
      { month: 'Apr', amt: '$18k', pct: 55 },
      { month: 'May', amt: '$29k', pct: 95 },
      { month: 'Jun', amt: '$33k', pct: 100 }
    ];
  });

  public setRange(range: string): void {
    this.activeRange.set(range);
    this.timeRangeChange.emit(range);
    if (this.normalizedData().onSelectTimeRange) {
      this.normalizedData().onSelectTimeRange!(range);
    }
  }

  public onBarClicked(col: GpChartWidgetMonthlyData, event?: Event): void {
    if (col.routerLink) {
      const navConfig = {
        routerLink: col.routerLink,
        queryParams: col.queryParams
      };
      this.executeNavigation(navConfig, event);
    }

    if (this.normalizedData().onBarClick) {
      this.normalizedData().onBarClick!(col);
    }

    this.columnClick.emit(col);
  }
}
