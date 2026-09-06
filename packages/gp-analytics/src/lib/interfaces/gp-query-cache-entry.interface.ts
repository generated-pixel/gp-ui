export interface GpQueryCacheEntry<T = any> {
  key: string;
  data: T;
  timestamp: number;
  hits: number;
  expiresAt: number;
}
