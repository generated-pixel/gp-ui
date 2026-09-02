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

export interface GpHeaderWithStatItem {
  label: string;
  value: string;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-header-with-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-with-stats.component.html',
  styleUrl: './header-with-stats.component.scss'
})
export class GpHeaderWithStatsComponent {
  public title = input<string>('');
  public description = input<string>('');
  public stats = input<GpHeaderWithStatItem[]>([]);

  public statClick = output<GpHeaderWithStatItem>();

  public titleTemplate = input<TemplateRef<any> | undefined>(undefined);
  public statsTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentTitle = contentChild<TemplateRef<any>>('title');
  public contentStats = contentChild<TemplateRef<any>>('stats');

  public effectiveTitle = computed(() => this.titleTemplate() || this.contentTitle());

  public effectiveStats = computed(() => this.statsTemplate() || this.contentStats());
}
