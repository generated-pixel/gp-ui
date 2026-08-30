import { Component, ChangeDetectionStrategy, ViewEncapsulation, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';
import { GpKpiWidgetData } from '../../models/grid-widget.model';
import { GpGridItem } from '../../models/grid-item.model';

@Component({
  selector: 'gp-grid-kpi-widget',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './grid-kpi-widget.component.html',
  styleUrl: './grid-kpi-widget.component.scss',
  host: {
    class: 'gp-grid-kpi-widget-host'
  }
})
export class GpGridKpiWidgetComponent {
  public data = input<GpKpiWidgetData | undefined>(undefined);
  public item = input<GpGridItem | undefined>(undefined);
  public label = input<string>('');
  public value = input<string | number>('');
  public change = input<string>('');
  public trend = input<'pos' | 'neg' | 'neutral' | 'positive' | 'negative' | undefined>(undefined);
  public icon = input<string>('');
  public iconBg = input<string>('');
  public iconColor = input<string>('');
  public subtitle = input<string>('');

  public kpiClick = output<GpKpiWidgetData | GpGridItem | undefined>();

  public effectiveLabel = computed(() => this.label() || this.data()?.label || this.item()?.title || '');
  public effectiveValue = computed(() => this.value() || this.data()?.value || '');
  public effectiveChange = computed(() => this.change() || this.data()?.change || this.data()?.trendText || this.data()?.meta || '');
  public effectiveTrend = computed<'pos' | 'neg' | 'neutral'>(() => {
    const raw = this.trend() || this.data()?.trend || this.data()?.trendType;
    if (raw === 'pos' || raw === 'positive') return 'pos';
    if (raw === 'neg' || raw === 'negative') return 'neg';
    if (raw === 'neutral') return 'neutral';
    const c = this.effectiveChange();
    if (c.startsWith('+')) return 'pos';
    if (c.startsWith('-')) return 'neg';
    return 'neutral';
  });
  public effectiveIcon = computed(() => this.icon() || this.data()?.icon || this.item()?.icon || 'chart-line');
  public effectiveIconBg = computed(() => this.iconBg() || this.data()?.iconBg || 'var(--gp-primary-light, rgba(99, 102, 241, 0.1))');
  public effectiveIconColor = computed(() => this.iconColor() || this.data()?.iconColor || 'var(--gp-primary, #6366f1)');
  public effectiveSubtitle = computed(() => this.subtitle() || this.data()?.subtitle || '');

  public onClick(): void {
    this.kpiClick.emit(this.data() || this.item());
  }
}
