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
import { GpProgressBarComponent } from '@generatedpixel/gp-ui';

export interface GpMeterMetricItem {
  id?: string;
  label: string;
  current: string | number;
  max: string | number;
  pct: number;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public meterTemplate = input<TemplateRef<{ $implicit: GpMeterMetricItem }> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentMeterTemplate = contentChild<TemplateRef<{ $implicit: GpMeterMetricItem }>>('meterTemplate');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectiveMeterTemplate = computed(() => this.meterTemplate() || this.contentMeterTemplate());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());
}
