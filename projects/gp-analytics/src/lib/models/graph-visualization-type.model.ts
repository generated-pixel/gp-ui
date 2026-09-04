export type GraphVisualizationType =
  | 'bar'
  | 'column'
  | 'stacked-bar'
  | 'stacked-column'
  | 'pie'
  | 'radial';

export type GraphFieldRole = 'x-axis' | 'y-axis' | 'series' | 'tooltip';
export type KpiFieldRole = 'value' | 'compare';
