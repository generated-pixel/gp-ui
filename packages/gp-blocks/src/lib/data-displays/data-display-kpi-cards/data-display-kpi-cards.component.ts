import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
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

  @Input() public cardTemplate?: TemplateRef<{ $implicit: GpKpiCardItem }>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('cardTemplate') public contentCardTemplate?: TemplateRef<{ $implicit: GpKpiCardItem }>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveCardTemplate(): TemplateRef<{ $implicit: GpKpiCardItem }> | undefined {
    return this.cardTemplate || this.contentCardTemplate;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }
}
