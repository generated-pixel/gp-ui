import { ApiErrorData } from './api-error-data';

export interface ApiError {
  code?: string | null;
  message?: string | null;
  errorData?: ApiErrorData[] | null;
}
