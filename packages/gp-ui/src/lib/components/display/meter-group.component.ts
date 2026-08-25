import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';

export interface GpMeterItem {
  label: string;
  value: number;
  color?: string;
  icon?: string;
}

@Component({
  selector: 'gp-meter-group',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="gp-metergroup">
      <div class="gp-metergroup-meters">
        @for (meter of value; track meter.label) {
          <div
            class="gp-metergroup-meter"
            [style.width.%]="meter.value"
            [style.background-color]="meter.color || 'var(--gp-primary)'"
          ></div>
        }
      </div>

      <div class="gp-metergroup-labels">
        @for (meter of value; track meter.label) {
          <div class="gp-metergroup-label-item">
            <span class="gp-metergroup-label-dot" [style.background-color]="meter.color || 'var(--gp-primary)'"></span>
            @if (meter.icon) {
              <gp-icon [name]="meter.icon" size="0.85em" />
            }
            <span class="gp-metergroup-label-text">{{ meter.label }}</span>
            <span class="gp-metergroup-label-val">({{ meter.value }}%)</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .gp-metergroup {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      width: 100%;
    }
    .gp-metergroup-meters {
      display: flex;
      height: 0.75rem;
      background: var(--gp-surface-hover);
      border-radius: var(--gp-border-radius-full);
      overflow: hidden;
    }
    .gp-metergroup-meter {
      height: 100%;
      transition: width 0.3s ease;
    }
    .gp-metergroup-labels {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .gp-metergroup-label-item {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-size: var(--gp-font-size-xs);
      color: var(--gp-text-color-secondary);
    }
    .gp-metergroup-label-dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
    }
    .gp-metergroup-label-text {
      font-weight: 500;
      color: var(--gp-text-color);
    }
  `]
})
export class GpMeterGroupComponent {
  @Input() value: GpMeterItem[] = [];
  @Input() max = 100;
}
