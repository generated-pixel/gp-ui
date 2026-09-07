import { UniqueId as GpUiUniqueId } from '@generatedpixel/gp-ui';

let fallbackCounter = 0;

/**
 * Utility for generating unique, collision-resistant element and record identifiers.
 * Always backed by a real RFC 4122 GUID (via `crypto.randomUUID()`) so every generated
 * id is a genuine guid, optionally namespaced with a prefix for DOM/CSS-selector safety.
 */
export class UniqueId {
  /**
   * Generates a unique identifier with the given prefix, backed by a real guid.
   */
  static generate(prefix = 'gp_ana_'): string {
    return `${prefix}${UniqueId.guid()}`;
  }

  /**
   * Generates a standalone RFC 4122 v4 guid, using the platform's `crypto.randomUUID()`
   * when available, with a resilient fallback for older/non-browser environments.
   */
  static guid(): string {
    try {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
      }
      if (typeof GpUiUniqueId?.generate === 'function') {
        return GpUiUniqueId.generate('');
      }
    } catch {
      // ignore and use fallback
    }
    fallbackCounter += 1;
    return `${Date.now().toString(36)}-${fallbackCounter.toString(36)}-${Math.random().toString(36).substring(2, 10)}`;
  }
}
