import { GpBase } from '../../../base/gp-base';
import { Component, input, contentChild, TemplateRef, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIcon } from '../../../icons/icon';

export interface GpTimelineEvent {
  status?: string;
  date?: string;
  icon?: string;
  color?: string;
  image?: string;
  [key: string]: any;
}

@Component({
  selector: 'gp-timeline',
  standalone: true,
  imports: [CommonModule, GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss'
})
export class GpTimeline extends GpBase {
  public value = input<GpTimelineEvent[]>([]);
  public layout = input<'vertical' | 'horizontal'>('vertical');
  public align = input<'left' | 'right' | 'alternate'>('alternate');

  public contentTemplate = contentChild<TemplateRef<any>>('content');
  public oppositeTemplate = contentChild<TemplateRef<any>>('opposite');
  public markerTemplate = contentChild<TemplateRef<any>>('marker');
}
