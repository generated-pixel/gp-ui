import { Component, input, output } from '@angular/core';
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
  selector: 'gp-data-display-kpi-cards',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './data-display-kpi-cards.component.html',
  styleUrl: './data-display-kpi-cards.component.scss'
})
export class GpDataDisplayKpiCardsComponent {
  public kpis = input<GpKpiCardItem[]>([]);

  public kpiClick = output<GpKpiCardItem>();
}
