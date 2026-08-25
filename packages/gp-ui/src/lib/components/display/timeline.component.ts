import { GpEditableBaseComponent } from '../../base/gp-editable-base.component';
import { Component, Input, ContentChild, TemplateRef, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';

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
export class GpTimelineComponent extends GpEditableBaseComponent {
  @Input() override value: GpTimelineEvent[] = [];
  @Input() layout: 'vertical' | 'horizontal' = 'vertical';
  @Input() align: 'left' | 'right' | 'alternate' = 'alternate';

  @ContentChild('content') contentTemplate?: TemplateRef<any>;
  @ContentChild('opposite') oppositeTemplate?: TemplateRef<any>;
  @ContentChild('marker') markerTemplate?: TemplateRef<any>;
}
