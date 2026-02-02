import { Guid } from '../types/guid';
import { Widget } from './widget';

export interface Dashboard {
  id: Guid;
  name: string;
  widgets: Widget[];
}
