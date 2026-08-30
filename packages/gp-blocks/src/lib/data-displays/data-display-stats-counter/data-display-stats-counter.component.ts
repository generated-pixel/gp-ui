import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface GpStatsCounterItem {
  id?: string;
  number: string;
  label: string;
  desc?: string;
}

@Component({
  selector: 'gp-data-display-stats-counter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-display-stats-counter.component.html',
  styleUrl: './data-display-stats-counter.component.scss'
})
export class GpDataDisplayStatsCounterComponent {
  public counters = input<GpStatsCounterItem[]>([]);

  public counterClick = output<GpStatsCounterItem>();

  @Input() public counterTemplate?: TemplateRef<{ $implicit: GpStatsCounterItem }>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('counterTemplate') public contentCounterTemplate?: TemplateRef<{ $implicit: GpStatsCounterItem }>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveCounterTemplate(): TemplateRef<{ $implicit: GpStatsCounterItem }> | undefined {
    return this.counterTemplate || this.contentCounterTemplate;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }
}
