import { Component, ChangeDetectionStrategy, ViewEncapsulation, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpProgressBarComponent } from '@generatedpixel/gp-ui';
import { GpProgressWidgetData, GpGridProgressItem } from '../../models/grid-widget.model';
import { GpGridItem } from '../../models/grid-item.model';

@Component({
  selector: 'gp-grid-progress-widget',
  standalone: true,
  imports: [CommonModule, GpProgressBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './grid-progress-widget.component.html',
  styleUrl: './grid-progress-widget.component.scss',
  host: {
    class: 'gp-grid-progress-widget-host'
  }
})
export class GpGridProgressWidgetComponent {
  public data = input<GpProgressWidgetData | undefined>(undefined);
  public item = input<GpGridItem | undefined>(undefined);
  public title = input<string>('');
  public target = input<string>('');
  public items = input<GpGridProgressItem[]>([]);

  public effectiveTitle = computed(() => this.title() || this.data()?.title || this.data()?.goalsTitle || this.item()?.title || 'Target Goals');
  public effectiveTarget = computed(() => this.target() || this.data()?.target || this.data()?.goalsTarget || '');
  public effectiveItems = computed<GpGridProgressItem[]>(() => {
    if (this.items() && this.items().length > 0) return this.items();
    if (this.data()?.items && this.data()!.items!.length > 0) return this.data()!.items!;
    if (this.data()?.quotas && this.data()!.quotas!.length > 0) return this.data()!.quotas!;
    return [
      { label: 'Q1 Enterprise Growth', valueText: '84%', percentage: 84 },
      { label: 'Cloud Migrations', valueText: '62%', percentage: 62 },
      { label: 'SLA Uptime Compliance', valueText: '99.9%', percentage: 99 }
    ];
  });
}
