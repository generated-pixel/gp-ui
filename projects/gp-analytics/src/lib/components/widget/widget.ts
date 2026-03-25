import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgStyle } from '@angular/common';

import { gpAnalyticsThemeCssVariables } from '../../config/gp-analytics-config';
import { GpIconMapperService } from '../../icons/gp-icon-mapper.service';
import { GpIconName } from '../../icons/gp-icon-names';
import { DesignerArtifactType, GraphVisualizationType } from '../../interfaces/selected-field';
import { DesignedItem, DesignedItemDataPoint } from '../../interfaces/designed-item';
import { GpAnalyticsService } from '../../services/gp-analytics.service';
import { GP_ANALYTICS_CONFIG, GP_ANALYTICS_TRANSLATIONS } from '../../tokens/gp-analytics.token';
import { GpIcon } from '../icon/icon';

@Component({
  selector: 'gp-widget',
  imports: [NgStyle, GpIcon],
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
  private readonly iconMapper = inject(GpIconMapperService);

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

  protected artifactTypeLabel(type: DesignerArtifactType): string {
    if (type === 'graph') {
      return this.t.artifactTypeGraph;
    }

    if (type === 'kpi') {
      return this.t.artifactTypeKpi;
    }

    return this.t.artifactTypeTabular;
  }

  protected graphTypeLabel(type: GraphVisualizationType): string {
    if (type === 'pie') {
      return this.t.graphTypePie;
    }

    if (type === 'stacked-bar') {
      return this.t.graphTypeStackedBar;
    }

    if (type === 'column') {
      return this.t.graphTypeColumn;
    }

    if (type === 'stacked-column') {
      return this.t.graphTypeStackedColumn;
    }

    if (type === 'radial') {
      return this.t.graphTypeRadial;
    }

    return this.t.graphTypeBar;
  }

  protected artifactTypeIcon(type: DesignerArtifactType): GpIconName {
    return this.iconMapper.artifact(type);
  }

  protected graphTypeIcon(type: GraphVisualizationType): GpIconName {
    return this.iconMapper.graphType(type);
  }

  protected formatGeneratedAt(value: string): string {
    return this.analytics.formatDate(value, 'long');
  }

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
