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
  template: `
    <div class="gp-timeline" [class]="'gp-timeline-' + layout + ' gp-timeline-align-' + align">
      @for (event of value; track $index; let last = $last) {
        <div class="gp-timeline-event">
          <div class="gp-timeline-event-opposite">
            <ng-container *ngTemplateOutlet="oppositeTemplate; context: { $implicit: event }" />
            @if (!oppositeTemplate && event.date) {
              <span class="gp-timeline-date">{{ event.date }}</span>
            }
          </div>

          <div class="gp-timeline-event-separator">
            <div class="gp-timeline-event-marker" [style.background-color]="event.color || null">
              <ng-container *ngTemplateOutlet="markerTemplate; context: { $implicit: event }" />
              @if (!markerTemplate && event.icon) {
                <gp-icon [name]="event.icon" size="0.75em" />
              }
            </div>
            @if (!last) {
              <div class="gp-timeline-event-connector"></div>
            }
          </div>

          <div class="gp-timeline-event-content">
            <ng-container *ngTemplateOutlet="contentTemplate; context: { $implicit: event }" />
            @if (!contentTemplate) {
              <div class="gp-timeline-status">{{ event.status }}</div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .gp-timeline {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    .gp-timeline-event {
      display: flex;
      position: relative;
      min-height: 4rem;
    }
    .gp-timeline-event-opposite {
      flex: 1;
      padding: 0 1rem;
      text-align: right;
      font-size: var(--gp-font-size-xs);
      color: var(--gp-text-color-muted);
    }
    .gp-timeline-event-separator {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 0;
    }
    .gp-timeline-event-marker {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      background: var(--gp-primary);
      color: var(--gp-primary-text);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
    }
    .gp-timeline-event-connector {
      flex: 1;
      width: 2px;
      background: var(--gp-surface-divider);
    }
    .gp-timeline-event-content {
      flex: 1;
      padding: 0 1rem 1rem 1rem;
    }
    .gp-timeline-status {
      font-weight: 600;
      font-size: var(--gp-font-size-sm);
      color: var(--gp-text-color);
    }
    .gp-timeline-align-left .gp-timeline-event-opposite { display: none; }
  `]
})
export class GpTimelineComponent {
  @Input() value: GpTimelineEvent[] = [];
  @Input() layout: 'vertical' | 'horizontal' = 'vertical';
  @Input() align: 'left' | 'right' | 'alternate' = 'alternate';

  @ContentChild('content') contentTemplate?: TemplateRef<any>;
  @ContentChild('opposite') oppositeTemplate?: TemplateRef<any>;
  @ContentChild('marker') markerTemplate?: TemplateRef<any>;
}
