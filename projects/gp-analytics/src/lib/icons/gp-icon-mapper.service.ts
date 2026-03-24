import { Injectable } from '@angular/core';

import {
  AggregationType,
  DesignerArtifactType,
  GraphFieldRole,
  GraphVisualizationType,
  SortDirection,
} from '../interfaces/selected-field';
import { FieldDataType } from '../interfaces/field';
import { GpIconName } from './gp-icon-names';

/**
 * Central mapping service from analytics domain values to icon names.
 *
 * Keeping all mappings here avoids duplicated switch statements and string
 * literals across components and templates.
 */
@Injectable({ providedIn: 'root' })
export class GpIconMapperService {
  private static readonly ARTIFACT_TO_ICON: Record<DesignerArtifactType, GpIconName> = {
    tabular: 'artifact-tabular',
    graph: 'artifact-graph',
    kpi: 'artifact-kpi',
  };

  private static readonly GRAPH_TO_ICON: Record<GraphVisualizationType, GpIconName> = {
    pie: 'graph-pie',
    bar: 'graph-bar',
    'stacked-bar': 'graph-stacked-bar',
    column: 'graph-column',
    'stacked-column': 'graph-stacked-column',
    radial: 'graph-radial',
  };

  private static readonly FIELD_TYPE_TO_ICON: Record<FieldDataType, GpIconName> = {
    string: 'type-string',
    number: 'type-number',
    integer: 'type-integer',
    boolean: 'type-boolean',
    date: 'type-date',
    datetime: 'type-datetime',
    time: 'type-time',
  };

  private static readonly AGGREGATION_TO_ICON: Record<AggregationType, GpIconName> = {
    none: 'agg-none',
    sum: 'agg-sum',
    avg: 'agg-avg',
    min: 'agg-min',
    max: 'agg-max',
    count: 'agg-count',
    countDistinct: 'agg-count-distinct',
  };

  private static readonly GRAPH_ROLE_TO_ICON: Record<GraphFieldRole, GpIconName> = {
    'x-axis': 'role-x-axis',
    'y-axis': 'role-y-axis',
    series: 'role-series',
    tooltip: 'role-tooltip',
  };

  artifact(value: DesignerArtifactType): GpIconName {
    return GpIconMapperService.ARTIFACT_TO_ICON[value];
  }

  graphType(value: GraphVisualizationType): GpIconName {
    return GpIconMapperService.GRAPH_TO_ICON[value];
  }

  fieldType(value: FieldDataType): GpIconName {
    return GpIconMapperService.FIELD_TYPE_TO_ICON[value];
  }

  aggregation(value: AggregationType): GpIconName {
    return GpIconMapperService.AGGREGATION_TO_ICON[value];
  }

  graphRole(value: GraphFieldRole): GpIconName {
    return GpIconMapperService.GRAPH_ROLE_TO_ICON[value];
  }

  sortDirection(value?: SortDirection): GpIconName {
    if (value === 'asc') {
      return 'sort-asc';
    }
    if (value === 'desc') {
      return 'sort-desc';
    }
    return 'sort-none';
  }
}
