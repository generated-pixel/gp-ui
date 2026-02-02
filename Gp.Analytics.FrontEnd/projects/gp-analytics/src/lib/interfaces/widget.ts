import { WidgetType } from '../enums/widget-types';
import { Guid } from '../types/guid';
import { WidgetTypeCalendar } from './widget-type-calendar';
import { WidgetTypeChart } from './widget-type-chart';
import { WidgetTypeImage } from './widget-type-image';
import { WidgetTypeGauge } from './widget-type-gauge';
import { WidgetTypeTable } from './widget-type-table';
import { WidgetTypeText } from './widget-type-text';

export interface Widget {
  widgetId: Guid;
  title?: string;
  description?: string;
  widgetType: WidgetType;

  data?:
    | WidgetTypeCalendar
    | WidgetTypeChart
    | WidgetTypeImage
    | WidgetTypeGauge
    | WidgetTypeTable
    | WidgetTypeText;

  properties?: { [key: string]: any };
}
