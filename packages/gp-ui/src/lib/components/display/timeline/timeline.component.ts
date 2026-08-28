import { GpBaseComponent } from '../../../base/gp-base.component';
import {
  Component,
  input,
  contentChild,
  TemplateRef,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';

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
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class GpTimelineComponent extends GpBaseComponent {
  public value = input<GpTimelineEvent[]>([]);
  public layout = input<'vertical' | 'horizontal'>('vertical');
  public align = input<'left' | 'right' | 'alternate'>('alternate');

  public contentTemplate = contentChild<TemplateRef<any>>('content');
  public oppositeTemplate = contentChild<TemplateRef<any>>('opposite');
  public markerTemplate = contentChild<TemplateRef<any>>('marker');
}
