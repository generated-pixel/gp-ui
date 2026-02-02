import { ApiResponseBase } from './api-response-base';

export interface ApiTranslationsResponse extends ApiResponseBase {
  translations?: Record<string, string> | null;
}
