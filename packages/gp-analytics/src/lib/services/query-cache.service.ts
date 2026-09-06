import { Injectable, signal } from '@angular/core';
import { GpQueryCacheEntry } from '../interfaces/gp-query-cache-entry.interface';
import { GpQueryCacheStats } from '../interfaces/gp-query-cache-stats.interface';

/**
 * High-performance LRU / TTL Query Cache Service.
 * Provides memoization for analytical queries, aggregations,
 * and calculations across dashboards, preview tables, and reports.
 */
@Injectable({ providedIn: 'root' })
export class GpQueryCacheService {
  private readonly defaultTtlMs = 60000; // 60 seconds default
  private readonly maxEntries = 200;
  private readonly cache = new Map<string, GpQueryCacheEntry>();

  private hitsCount = 0;
  private missesCount = 0;
  private evictionsCount = 0;

  get cacheSize(): number {
    return this.cache.size;
  }

  /**
   * Generates a deterministic cache key from parameters.
   */
  buildKey(prefix: string, payload: unknown): string {
    const serialized = typeof payload === 'string' ? payload : JSON.stringify(payload);
    return `${prefix}:${serialized}`;
  }

  /**
   * Retrieves a cached entry if present and not expired.
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      this.missesCount++;
      return null;
    }

    // Check expiration
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.missesCount++;
      return null;
    }

    // LRU refresh: re-insert key to mark as most recently used
    this.cache.delete(key);
    entry.hits++;
    this.cache.set(key, entry);
    this.hitsCount++;

    return entry.data as T;
  }

  /**
   * Stores an entry with TTL and enforces LRU capacity limits.
   */
  set<T>(key: string, data: T, ttlMs: number = this.defaultTtlMs): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxEntries) {
      // Evict oldest entry (first item in Map)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
        this.evictionsCount++;
      }
    }

    const now = Date.now();
    const entry: GpQueryCacheEntry<T> = {
      key,
      data,
      timestamp: now,
      hits: 0,
      expiresAt: now + ttlMs
    };

    this.cache.set(key, entry);
  }

  /**
   * Checks if an unexpired key exists in cache.
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  /**
   * Invalidates entries matching a prefix or pattern.
   */
  invalidate(keyOrPrefix?: string): void {
    if (!keyOrPrefix) {
      this.clear();
      return;
    }

    for (const key of Array.from(this.cache.keys())) {
      if (key === keyOrPrefix || key.startsWith(keyOrPrefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clears the entire cache.
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Retrieves runtime cache performance statistics.
   */
  getStats(): GpQueryCacheStats {
    const total = this.hitsCount + this.missesCount;
    const hitRatio = total > 0 ? Number((this.hitsCount / total).toFixed(4)) : 0;

    return {
      size: this.cache.size,
      maxSize: this.maxEntries,
      hits: this.hitsCount,
      misses: this.missesCount,
      hitRatio,
      evictions: this.evictionsCount
    };
  }

  /**
   * Resets hit/miss telemetry statistics.
   */
  resetStats(): void {
    this.hitsCount = 0;
    this.missesCount = 0;
    this.evictionsCount = 0;
  }
}
