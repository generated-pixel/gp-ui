import { ApiResponseBase } from './api-response-base';

export interface ApiAuthResponse extends ApiResponseBase {
  token?: string | null;
  tokenExpires?: Date | null;
  refreshToken?: string | null;
  refreshTokenExpires?: Date | null;
}
