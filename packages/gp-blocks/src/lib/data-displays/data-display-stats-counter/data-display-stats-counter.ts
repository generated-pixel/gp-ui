import {
  Component,
  input,
  output,
  TemplateRef,
  contentChild,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface GpStatsCounterItem {
  id?: string;
  number: string;
  label: string;
  desc?: string;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-data-display-stats-counter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-display-stats-counter.html',
  styleUrl: './data-display-stats-counter.scss'
})
export class GpDataDisplayStatsCounter {
  public counters = input<GpStatsCounterItem[]>([]);

  public counterClick = output<GpStatsCounterItem>();

  public counterTemplate = input<TemplateRef<{ $implicit: GpStatsCounterItem }> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentCounterTemplate = contentChild<TemplateRef<{ $implicit: GpStatsCounterItem }>>('counterTemplate');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveCounterTemplate = computed(() => this.counterTemplate() || this.contentCounterTemplate());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());
}
