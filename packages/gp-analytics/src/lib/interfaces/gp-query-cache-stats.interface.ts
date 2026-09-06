export interface GpQueryCacheStats {
  size: number;
  maxSize: number;
  hits: number;
  misses: number;
  hitRatio: number;
  evictions: number;
}
