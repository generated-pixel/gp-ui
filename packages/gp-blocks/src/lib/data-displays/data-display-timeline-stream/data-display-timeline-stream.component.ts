import { Component, input, output } from '@angular/core';
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
}
