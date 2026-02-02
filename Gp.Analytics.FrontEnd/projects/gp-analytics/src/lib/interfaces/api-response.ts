import { ApiDataField } from './api-data-field';
import { ApiPaginationField } from './api-pagination-field';
import { ApiResponseBase } from './api-response-base';

export interface ApiResponse extends ApiResponseBase {
  recordCount: number;
  totalRecordCount: number;
  data: Array<Record<string, ApiDataField>>;
  pagination?: ApiPaginationField | null;
}
