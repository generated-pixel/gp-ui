import { Component, ChangeDetectionStrategy, ViewEncapsulation, input, output, computed, Signal } from '@angular/core';

import { GpIcon, GpSkeleton } from '@generatedpixel/gp-ui';
import { GpKpiWidgetData } from '../../models/grid-widget.model';
import { GpGridItem } from '../../models/grid-item.model';
import { normalizeKpiWidgetData } from '../../services/widget-data-resolver';
import { GpGridWidgetBase } from '../../base/gp-grid-widget.base';

@Component({
  selector: 'gp-grid-kpi-widget',
  standalone: true,
  imports: [GpIcon, GpSkeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './grid-kpi-widget.html',
  styleUrl: './grid-kpi-widget.scss',
  host: {
    class: 'gp-grid-kpi-widget-host'
  }
})
export class GpGridKpiWidget extends GpGridWidgetBase<GpKpiWidgetData> {
  /**
   * Direct granular inputs.
   */
  public label = input<string>('');
  public value = input<string | number>('');
  public change = input<string>('');
  public trend = input<'pos' | 'neg' | 'neutral' | 'positive' | 'negative' | undefined>(undefined);
  public icon = input<string>('');
  public iconBg = input<string>('');
  public iconColor = input<string>('');
  public subtitle = input<string>('');
  public routerLink = input<string | any[] | undefined>(undefined);
  public queryParams = input<Record<string, any> | undefined>(undefined);

  /**
   * Output emitted when KPI card is clicked.
   */
  public kpiClick = output<GpKpiWidgetData | GpGridItem | undefined>();

  public override normalizedData: Signal<GpKpiWidgetData> = computed(() => {
    return normalizeKpiWidgetData(this.rawData());
  });

  public effectiveLabel = computed(() => this.label() || this.normalizedData().label || this.item()?.title || '');
  public effectiveValue = computed(() => this.value() || this.normalizedData().value || '');
  public effectiveChange = computed(
    () =>
      this.change() ||
      this.normalizedData().change ||
      this.normalizedData().trendText ||
      this.normalizedData().meta ||
      ''
  );
  public effectiveTrend = computed<'pos' | 'neg' | 'neutral'>(() => {
    const raw = this.trend() || this.normalizedData().trend || this.normalizedData().trendType;
    if (raw === 'pos' || raw === 'positive') {
      return 'pos';
    }
    if (raw === 'neg' || raw === 'negative') {
      return 'neg';
    }
    if (raw === 'neutral') {
      return 'neutral';
    }
    const c = this.effectiveChange();
    if (c.startsWith('+')) {
      return 'pos';
    }
    if (c.startsWith('-')) {
      return 'neg';
    }
    return 'neutral';
  });
  public effectiveIcon = computed(() => this.icon() || this.normalizedData().icon || this.item()?.icon || 'chart-line');
  public effectiveIconBg = computed(
    () => this.iconBg() || this.normalizedData().iconBg || 'var(--gp-primary-light, rgba(99, 102, 241, 0.1))'
  );
  public effectiveIconColor = computed(
    () => this.iconColor() || this.normalizedData().iconColor || 'var(--gp-primary, #6366f1)'
  );
  public effectiveSubtitle = computed(() => this.subtitle() || this.normalizedData().subtitle || '');
  public effectiveRouterLink = computed(
    () => this.routerLink() || this.normalizedData().routerLink || this.item()?.routerLink
  );
  public effectiveQueryParams = computed(
    () => this.queryParams() || this.normalizedData().queryParams || this.item()?.queryParams
  );

  public onClick(event?: Event): void {
    const navConfig = {
      routerLink: this.effectiveRouterLink(),
      queryParams: this.effectiveQueryParams()
    };

    this.executeNavigation(navConfig, event);

    if (this.normalizedData().onClick) {
      this.normalizedData().onClick!(this.normalizedData());
    }

    this.kpiClick.emit(this.normalizedData() || this.item());
  }
}
