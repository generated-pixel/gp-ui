import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgStyle } from '@angular/common';

import { gpAnalyticsThemeCssVariables } from '../../config/gp-analytics-config';
import { DesignedItem, DesignedItemDataPoint } from '../../interfaces/designed-item';
import { GpAnalyticsService } from '../../services/gp-analytics.service';
import { GP_ANALYTICS_CONFIG, GP_ANALYTICS_TRANSLATIONS } from '../../tokens/gp-analytics.token';

@Component({
  selector: 'gp-widget',
  imports: [NgStyle],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './widget.html',
  styleUrls: ['./widget.css'],
})
export class Widget {
  readonly title = input<string | undefined>(undefined);
  readonly highlighted = input(false);
  readonly item = input<DesignedItem | undefined>(undefined);

  private readonly config = inject(GP_ANALYTICS_CONFIG, { optional: true });
  protected readonly t = inject(GP_ANALYTICS_TRANSLATIONS);
  private readonly analytics = inject(GpAnalyticsService);

  protected readonly resolvedTitle = computed(
    () => this.title() ?? this.item()?.metadata.name ?? this.t.widgetDefaultTitle,
  );
  protected readonly effectiveHighlighted = computed(
    () => this.highlighted() || this.item()?.style?.highlighted === true,
  );
  protected readonly toneClass = computed(() => {
    const tone = this.item()?.style?.tone;
    return tone ? `gp-widget--tone-${tone}` : '';
  });
  protected readonly customStyle = computed(() => {
    const style = this.item()?.style;

    return {
      ...gpAnalyticsThemeCssVariables(this.config?.theme),
      ...(style?.borderColor ? { '--gp-widget-border-color': style.borderColor } : {}),
      ...(style?.backgroundColor ? { '--gp-widget-bg': style.backgroundColor } : {}),
      ...(style?.textColor ? { '--gp-widget-text': style.textColor } : {}),
    };
  });
  protected readonly compact = computed(() => this.item()?.style?.compact === true);

  protected formatPointValue(point: DesignedItemDataPoint): string {
    if (point.value === null || point.value === undefined) {
      return this.t.widgetItemNoValueLabel;
    }

    if (point.valueType === 'number') {
      return this.analytics.formatNumber(Number(point.value));
    }

    if (point.valueType === 'currency') {
      return this.analytics.formatCurrency(Number(point.value), point.currencyCode);
    }

    if (point.valueType === 'percent') {
      return this.analytics.formatNumber(Number(point.value), {
        style: 'percent',
        maximumFractionDigits: 2,
      });
    }

    if (point.valueType === 'date') {
      return this.analytics.formatDate(String(point.value), 'short');
    }

    if (point.valueType === 'datetime') {
      return this.analytics.formatDate(String(point.value), 'long');
    }

    if (point.valueType === 'boolean') {
      return point.value ? this.t.widgetItemBooleanTrueLabel : this.t.widgetItemBooleanFalseLabel;
    }

    return String(point.value);
  }
}
