import { Guid } from './guid';

/**
 * Utility for generating unique, collision-resistant element and record identifiers.
 * Always backed by a real RFC 4122 guid (via `Guid.newGuid()`) so every generated
 * id is a genuine guid, optionally namespaced with a prefix for DOM/CSS-selector safety.
 */
export class UniqueId {
  /**
   * Generates a unique identifier with the given prefix, backed by a real guid.
   */
  public static generate(prefix = 'gp_id_'): string {
    return `${prefix}${UniqueId.guid()}`;
  }

  /**
   * Generates a standalone RFC 4122 v4 guid string.
   */
  public static guid(): string {
    return Guid.newGuid().toString();
  }
}
