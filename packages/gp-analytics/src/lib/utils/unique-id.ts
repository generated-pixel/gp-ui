import { UniqueId as GpUiUniqueId } from '@generatedpixel/gp-ui';

let fallbackCounter = 0;

/**
 * Utility for generating unique, collision-resistant element and input identifiers.
 */
export class UniqueId {
  /**
   * Generates a unique identifier with the given prefix.
   * Uses `@generatedpixel/gp-ui` UniqueId generator when available, with resilient fallback.
   */
  static generate(prefix = 'gp_ana_'): string {
    try {
      if (typeof GpUiUniqueId?.generate === 'function') {
        return GpUiUniqueId.generate(prefix);
      }
    } catch {
      // ignore and use fallback
    }
    fallbackCounter += 1;
    return `${prefix}${Date.now().toString(36)}_${fallbackCounter.toString(36)}`;
  }
}
