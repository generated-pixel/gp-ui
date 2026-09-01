import { Component, computed, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpBadgeComponent } from '../../feedback/badge/badge.component';
import { GpProgressBarComponent } from '../../feedback/progress-bar/progress-bar.component';
import { GpStatTrendDirection } from './stat-card.interface';

@Component({
  selector: 'gp-stat-card',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpBadgeComponent, GpProgressBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss'
})
export class GpStatCardComponent {
  public title = input<string>('', { alias: 'title' });
  public value = input<string | number>('', { alias: 'value' });
  public prefix = input<string | undefined>(undefined);
  public suffix = input<string | undefined>(undefined);
  public subtitle = input<string | undefined>(undefined);
  public icon = input<string | undefined>(undefined);
  public iconColor = input<string | undefined>(undefined);
  public iconBg = input<string | undefined>(undefined);
  public badge = input<string | undefined>(undefined);
  public badgeSeverity = input<'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'contrast'>('primary');
  public progress = input<number | undefined>(undefined);
  public progressSeverity = input<'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger'>('primary');
  public glass = input<boolean>(false);
  public interactive = input<boolean>(false);
  public styleClass = input<string>('');

  public trend = input<{
    value: string | number;
    direction: GpStatTrendDirection;
    label?: string;
    isPositive?: boolean;
  } | undefined>(undefined);

  protected trendSeverity = computed(() => {
    const t = this.trend();
    if (!t) {
      return 'neutral';
    }
    if (t.isPositive !== undefined) {
      return t.isPositive ? 'positive' : 'negative';
    }
    if (t.direction === 'up') {
      return 'positive';
    }
    if (t.direction === 'down') {
      return 'negative';
    }
    return 'neutral';
  });

  protected trendIcon = computed(() => {
    const t = this.trend();
    if (!t) {
      return 'minus';
    }
    if (t.direction === 'up') {
      return 'arrow-up';
    }
    if (t.direction === 'down') {
      return 'arrow-down';
    }
    return 'minus';
  });
}
