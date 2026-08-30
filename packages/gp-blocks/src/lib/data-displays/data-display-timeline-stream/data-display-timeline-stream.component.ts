import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpAvatarComponent, GpIconComponent } from '@generatedpixel/gp-ui';

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
  selector: 'gp-data-display-timeline-stream',
  standalone: true,
  imports: [CommonModule, GpAvatarComponent, GpIconComponent],
  templateUrl: './data-display-timeline-stream.component.html',
  styleUrl: './data-display-timeline-stream.component.scss'
})
export class GpDataDisplayTimelineStreamComponent {
  public title = input<string>('');
  public events = input<GpTimelineStreamEvent[]>([]);

  public eventClick = output<GpTimelineStreamEvent>();

  @Input() public headerTemplate?: TemplateRef<any>;
  @Input() public eventTemplate?: TemplateRef<{ $implicit: GpTimelineStreamEvent }>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('header') public contentHeader?: TemplateRef<any>;
  @ContentChild('eventTemplate') public contentEventTemplate?: TemplateRef<{ $implicit: GpTimelineStreamEvent }>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveHeader(): TemplateRef<any> | undefined {
    return this.headerTemplate || this.contentHeader;
  }

  public get effectiveEventTemplate(): TemplateRef<{ $implicit: GpTimelineStreamEvent }> | undefined {
    return this.eventTemplate || this.contentEventTemplate;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }
}
