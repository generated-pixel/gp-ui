import { Directive, input, output, signal } from '@angular/core';
import { GpAnalyticsComponent } from './gp-analytics-component';

/**
 * Abstract foundational component for all analytical widgets,
 * providing unified lifecycle signals, loading states, error boundaries,
 * and user action handlers.
 */
@Directive()
export abstract class GpAnalyticsBaseWidget extends GpAnalyticsComponent {
  readonly widgetId = input<string>('');
  readonly title = input<string>('');
  readonly subtitle = input<string>('');
  readonly description = input<string>('');
  readonly error = input<string | null>(null);

  readonly isFullscreen = signal<boolean>(false);
  readonly isCollapsed = signal<boolean>(false);

  readonly refresh = output<string>();
  readonly exportData = output<{ widgetId: string; format: 'csv' | 'json' | 'png' }>();
  readonly configure = output<string>();

  toggleFullscreen(): void {
    this.isFullscreen.update((val) => !val);
  }

  toggleCollapse(): void {
    this.isCollapsed.update((val) => !val);
  }

  triggerRefresh(): void {
    this.refresh.emit(this.widgetId());
  }

  triggerExport(format: 'csv' | 'json' | 'png' = 'csv'): void {
    this.exportData.emit({ widgetId: this.widgetId(), format });
  }

  triggerConfigure(): void {
    this.configure.emit(this.widgetId());
  }
}
