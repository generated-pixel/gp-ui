import { ApiDebugInfo } from './api-debug-info';
import { ApiError } from './api-error';

export interface ApiResponseBase {
  success: boolean;
  dateTime: string;
  stackTrace?: string | null;
  debug: ApiDebugInfo;
  error?: ApiError | null;
}
