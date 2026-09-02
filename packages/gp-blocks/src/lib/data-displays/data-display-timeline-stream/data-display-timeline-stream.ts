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
import { GpAvatar, GpIcon } from '@generatedpixel/gp-ui';

export interface GpTimelineStreamEvent {
  id?: string;
  title: string;
  time: string;
  desc?: string;
  author?: string;
  icon?: string;
  color?: string;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-data-display-timeline-stream',
  standalone: true,
  imports: [CommonModule, GpAvatar, GpIcon],
  templateUrl: './data-display-timeline-stream.html',
  styleUrl: './data-display-timeline-stream.scss'
})
export class GpDataDisplayTimelineStream {
  public title = input<string>('');
  public events = input<GpTimelineStreamEvent[]>([]);

  public eventClick = output<GpTimelineStreamEvent>();

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public eventTemplate = input<TemplateRef<{ $implicit: GpTimelineStreamEvent }> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentEventTemplate = contentChild<TemplateRef<{ $implicit: GpTimelineStreamEvent }>>('eventTemplate');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectiveEventTemplate = computed(() => this.eventTemplate() || this.contentEventTemplate());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());
}
