import { Component, ChangeDetectionStrategy, ViewEncapsulation, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpBadgeSeverity } from '@generatedpixel/gp-ui';
import { GpChartWidgetData, GpChartWidgetMonthlyData } from '../../models/grid-widget.model';
import { GpGridItem } from '../../models/grid-item.model';

@Component({
  selector: 'gp-grid-chart-widget',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './grid-chart-widget.component.html',
  styleUrl: './grid-chart-widget.component.scss',
  host: {
    class: 'gp-grid-chart-widget-host'
  }
})
export class GpGridChartWidgetComponent {
  public data = input<GpChartWidgetData | undefined>(undefined);
  public item = input<GpGridItem | undefined>(undefined);
  public title = input<string>('');
  public subtitle = input<string>('');
  public badge = input<string>('');
  public badgeSeverity = input<GpBadgeSeverity>('success');
  public monthlyData = input<GpChartWidgetMonthlyData[]>([]);

  public timeRangeChange = output<string>();
  public columnClick = output<GpChartWidgetMonthlyData>();

  public effectiveTitle = computed(() => this.title() || this.data()?.title || this.item()?.title || 'Chart Overview');
  public effectiveSubtitle = computed(() => this.subtitle() || this.data()?.subtitle || '');
  public effectiveBadge = computed(() => this.badge() || this.data()?.badge || '');
  public effectiveBadgeSeverity = computed<GpBadgeSeverity>(() => this.badgeSeverity() || this.data()?.badgeSeverity || 'success');
  public effectiveMonthlyData = computed(() => {
    if (this.monthlyData() && this.monthlyData().length > 0) return this.monthlyData();
    if (this.data()?.monthlyData && this.data()!.monthlyData!.length > 0) return this.data()!.monthlyData!;
    return [
      { month: 'Jan', amt: '$12k', pct: 45 },
      { month: 'Feb', amt: '$19k', pct: 65 },
      { month: 'Mar', amt: '$24k', pct: 80 },
      { month: 'Apr', amt: '$18k', pct: 55 },
      { month: 'May', amt: '$29k', pct: 95 },
      { month: 'Jun', amt: '$33k', pct: 100 }
    ];
  });
}
