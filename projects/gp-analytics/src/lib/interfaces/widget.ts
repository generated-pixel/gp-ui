import { WidgetType } from '../enums/widget-types';
import { Guid } from '../types/guid';

export interface Widget {
  widgetId: Guid;
  title: string;
  description: string;
  widgetType: WidgetType;
}
