import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpProgressBarComponent } from '@generatedpixel/gp-ui';

export interface GpMeterMetricItem {
  id?: string;
  label: string;
  current: string | number;
  max: string | number;
  pct: number;
}

@Component({
  selector: 'gp-data-display-meter-metrics',
  standalone: true,
  imports: [CommonModule, GpProgressBarComponent],
  templateUrl: './data-display-meter-metrics.component.html',
  styleUrl: './data-display-meter-metrics.component.scss'
})
export class GpDataDisplayMeterMetricsComponent {
  public title = input<string>('');
  public subtitle = input<string>('');
  public meters = input<GpMeterMetricItem[]>([]);

  public meterClick = output<GpMeterMetricItem>();

  @Input() public headerTemplate?: TemplateRef<any>;
  @Input() public meterTemplate?: TemplateRef<{ $implicit: GpMeterMetricItem }>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('header') public contentHeader?: TemplateRef<any>;
  @ContentChild('meterTemplate') public contentMeterTemplate?: TemplateRef<{ $implicit: GpMeterMetricItem }>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveHeader(): TemplateRef<any> | undefined {
    return this.headerTemplate || this.contentHeader;
  }

  public get effectiveMeterTemplate(): TemplateRef<{ $implicit: GpMeterMetricItem }> | undefined {
    return this.meterTemplate || this.contentMeterTemplate;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }
}
