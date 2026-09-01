import { Component, input, output, TemplateRef, contentChild, computed, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpKpiCardItem {
  id?: string;
  label: string;
  value: string;
  change: string;
  isUp?: boolean;
  caption?: string;
  icon: string;
  iconBg?: string;
  iconColor?: string;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-data-display-kpi-cards',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './data-display-kpi-cards.component.html',
  styleUrl: './data-display-kpi-cards.component.scss'
})
export class GpDataDisplayKpiCardsComponent {
  public kpis = input<GpKpiCardItem[]>([]);

  public kpiClick = output<GpKpiCardItem>();

  public cardTemplate = input<TemplateRef<{ $implicit: GpKpiCardItem }> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentCardTemplate = contentChild<TemplateRef<{ $implicit: GpKpiCardItem }>>('cardTemplate');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveCardTemplate = computed(() => this.cardTemplate() || this.contentCardTemplate());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());
}
