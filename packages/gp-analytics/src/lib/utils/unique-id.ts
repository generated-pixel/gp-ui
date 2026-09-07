import { Guid } from '@generatedpixel/gp-ui';

/**
 * Utility for generating unique, collision-resistant element and record identifiers.
 * Always backed by a real RFC 4122 guid (via `@generatedpixel/gp-ui`'s `Guid.newGuid()`) so
 * every generated id is a genuine guid, optionally namespaced with a prefix for DOM/CSS-selector safety.
 */
export class UniqueId {
  /**
   * Generates a unique identifier with the given prefix, backed by a real guid.
   */
  static generate(prefix = 'gp_ana_'): string {
    return `${prefix}${UniqueId.guid()}`;
  }

  /**
   * Generates a standalone RFC 4122 v4 guid string.
   */
  static guid(): string {
    return Guid.newGuid().toString();
  }
}
