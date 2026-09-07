import { describe, it, expect, beforeEach } from 'vitest';
import { GpQueryCacheService } from './query-cache.service';

describe('GpQueryCacheService', () => {
  let service: GpQueryCacheService;

  beforeEach(() => {
    service = new GpQueryCacheService();
  });

  it('should store and retrieve cached values', () => {
    const key = service.buildKey('test', { id: 1 });
    service.set(key, { value: 42 });

    expect(service.has(key)).toBe(true);
    expect(service.get(key)).toEqual({ value: 42 });
  });

  it('should record hits and misses in stats', () => {
    service.set('k1', 'data1');

    service.get('k1'); // hit
    service.get('k1'); // hit
    service.get('nonexistent'); // miss

    const stats = service.getStats();
    expect(stats.hits).toBe(2);
    expect(stats.misses).toBe(1);
    expect(stats.hitRatio).toBeCloseTo(2 / 3, 2);
  });

  it('should invalidate entries by key prefix', () => {
    service.set('dataset:1:rows', [1, 2, 3]);
    service.set('dataset:1:stats', { count: 3 });
    service.set('dataset:2:rows', [4, 5]);

    service.invalidate('dataset:1');

    expect(service.has('dataset:1:rows')).toBe(false);
    expect(service.has('dataset:1:stats')).toBe(false);
    expect(service.has('dataset:2:rows')).toBe(true);
  });

  it('should expire entries when TTL lapses', async () => {
    service.set('short-lived', 'temporary', 10); // 10ms TTL
    expect(service.has('short-lived')).toBe(true);

    await new Promise((resolve) => setTimeout(resolve, 25));

    expect(service.has('short-lived')).toBe(false);
    expect(service.get('short-lived')).toBeNull();
  });

  it('should clear all entries', () => {
    service.set('k1', 1);
    service.set('k2', 2);
    expect(service.cacheSize).toBe(2);

    service.clear();
    expect(service.cacheSize).toBe(0);
    expect(service.get('k1')).toBeNull();
  });
});
