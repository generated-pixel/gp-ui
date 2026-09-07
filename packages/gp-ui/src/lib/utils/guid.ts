/**
 * gp-ui - Enterprise RFC 4122 & RFC 9562 Compliant GUID / UUID Implementation
 */

/**
 * Branded type representing a verified GUID string in standard hyphenated lowercase form.
 */
export type GuidString = string & { readonly __brand: unique symbol };

/**
 * Format specifiers for GUID string representation:
 * - 'D': 32 digits separated by hyphens (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx) [Default]
 * - 'N': 32 digits with no hyphens (xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx)
 * - 'B': Hyphenated digits enclosed in braces ({xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx})
 * - 'P': Hyphenated digits enclosed in parentheses ((xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx))
 */
export type GuidFormat = 'D' | 'N' | 'B' | 'P';

/** Standard 36-character hyphenated UUID regex */
const GUID_HYPHEN_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** 32-character unhyphenated hex regex */
const GUID_HEX_REGEX = /^[0-9a-f]{32}$/i;

const EMPTY_GUID_STRING = '00000000-0000-0000-0000-000000000000' as GuidString;

// Monotonic state tracking for UUID v7 generation
let lastV7Timestamp = -1;
let v7SequenceCounter = 0;

/**
 * Cryptographically secure pseudo-random byte generator.
 */
function getRandomBytes(count: number): Uint8Array {
  const bytes = new Uint8Array(count);
  if (
    typeof globalThis !== 'undefined' &&
    globalThis.crypto &&
    typeof globalThis.crypto.getRandomValues === 'function'
  ) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    // Fallback in non-crypto environments
    for (let i = 0; i < count; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return bytes;
}

/**
 * Converts a 16-byte Uint8Array into a standard 36-character lowercase hyphenated GUID string.
 */
function bytesToGuidString(bytes: Uint8Array): GuidString {
  const hex: string[] = [];
  for (let i = 0; i < 16; i++) {
    hex.push(bytes[i].toString(16).padStart(2, '0'));
  }
  return `${hex[0]}${hex[1]}${hex[2]}${hex[3]}-${hex[4]}${hex[5]}-${hex[6]}${hex[7]}-${hex[8]}${hex[9]}-${hex[10]}${hex[11]}${hex[12]}${hex[13]}${hex[14]}${hex[15]}`.toLowerCase() as GuidString;
}

/**
 * Normalizes any valid GUID string representation (braced, unhyphenated, mixed case)
 * into a standard lowercase hyphenated GuidString, or returns null if invalid.
 */
function normalizeGuid(input: string | null | undefined): GuidString | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  let cleaned = input.trim();

  // Strip enclosing braces or parentheses if present
  if ((cleaned.startsWith('{') && cleaned.endsWith('}')) || (cleaned.startsWith('(') && cleaned.endsWith(')'))) {
    cleaned = cleaned.slice(1, -1).trim();
  }

  // Check standard 36-char hyphenated format
  if (cleaned.length === 36 && GUID_HYPHEN_REGEX.test(cleaned)) {
    return cleaned.toLowerCase() as GuidString;
  }

  // Check 32-char unhyphenated hex format
  if (cleaned.length === 32 && GUID_HEX_REGEX.test(cleaned)) {
    const formatted = `${cleaned.slice(0, 8)}-${cleaned.slice(8, 12)}-${cleaned.slice(12, 16)}-${cleaned.slice(16, 20)}-${cleaned.slice(20)}`;
    return formatted.toLowerCase() as GuidString;
  }

  return null;
}

/**
 * Enterprise Immutable GUID / UUID Value Object.
 * Supports RFC 4122 v4 and RFC 9562 v7 generation, bidirectional conversion,
 * flexible parsing, formatting, and equality comparison.
 */
export class Guid {
  /**
   * Constant string representation of an empty (all zeroes) GUID.
   */
  public static readonly EMPTY: GuidString = EMPTY_GUID_STRING;

  private readonly _value: GuidString;

  /**
   * Initializes a new Guid instance from a valid string, byte array, or existing Guid.
   * Throws an Error if the input is not a valid GUID representation.
   */
  constructor(value: string | Uint8Array | number[] | Guid) {
    if (value instanceof Guid) {
      this._value = value._value;
      return;
    }

    if (value instanceof Uint8Array || Array.isArray(value)) {
      if (value.length !== 16) {
        throw new TypeError(`Invalid byte length for GUID: expected 16 bytes, received ${value.length}.`);
      }
      const bytes = value instanceof Uint8Array ? value : new Uint8Array(value);
      this._value = bytesToGuidString(bytes);
      return;
    }

    const normalized = normalizeGuid(value);
    if (!normalized) {
      throw new TypeError(`Invalid GUID string format: "${value}". Expected valid 32 or 36 hex-character GUID.`);
    }

    this._value = normalized;
  }

  /**
   * Returns a singleton Guid instance representing the empty GUID (00000000-0000-0000-0000-000000000000).
   */
  public static get empty(): Guid {
    return new Guid(EMPTY_GUID_STRING);
  }

  /**
   * Returns the normalized standard lowercase hyphenated string value of this GUID.
   */
  public get value(): GuidString {
    return this._value;
  }

  /**
   * Returns true if this GUID is equal to the empty GUID.
   */
  public get isEmpty(): boolean {
    return this._value === EMPTY_GUID_STRING;
  }

  /**
   * Returns the UUID version number (e.g. 4 for v4, 7 for v7, 1 for v1) or 0 for empty GUID.
   */
  public get version(): number {
    if (this.isEmpty) {
      return 0;
    }
    // Version is in the 13th character (index 14 in hyphenated string: xxxxxxxx-xxxx-Vxxx-xxxx-xxxxxxxxxxxx)
    const verChar = this._value.charAt(14);
    const ver = parseInt(verChar, 16);
    return isNaN(ver) ? 0 : ver;
  }

  /**
   * Returns the UUID variant string (e.g. 'rfc4122', 'ncs', 'microsoft', 'future').
   */
  public get variant(): 'rfc4122' | 'ncs' | 'microsoft' | 'reserved' {
    if (this.isEmpty) {
      return 'rfc4122';
    }
    // Variant is determined by upper bits of character at index 19
    const varChar = parseInt(this._value.charAt(19), 16);
    if ((varChar & 0x8) === 0) {
      return 'ncs';
    }
    if ((varChar & 0xc) === 0x8) {
      return 'rfc4122';
    }
    if ((varChar & 0xe) === 0xc) {
      return 'microsoft';
    }
    return 'reserved';
  }

  /**
   * Extracts the embedded UTC timestamp from a UUID Version 7 (or returns null if not a v7 GUID).
   */
  public getTimestamp(): Date | null {
    if (this.version !== 7) {
      return null;
    }
    // High 48 bits (first 12 hex characters, ignoring first hyphen at index 8)
    const part1 = this._value.slice(0, 8);
    const part2 = this._value.slice(9, 13);
    const hex = part1 + part2;
    const epochMs = parseInt(hex, 16);
    return isNaN(epochMs) ? null : new Date(epochMs);
  }

  // --- Generation ---

  /**
   * Generates a new cryptographically random UUID Version 4 (alias to Guid.v4()).
   */
  public static newGuid(): Guid {
    return this.v4();
  }

  /**
   * Generates a new RFC 4122 Version 4 (random) GUID.
   */
  public static v4(): Guid {
    const bytes = getRandomBytes(16);

    // Version 4: set bits 4-7 of byte 6 to 0b0100 (0x4)
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    // Variant 1: set bits 6-7 of byte 8 to 0b10 (0x80)
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    return new Guid(bytes);
  }

  /**
   * Generates a new RFC 9562 Version 7 (Unix Epoch time-ordered) GUID.
   *
   * Features:
   * - 48-bit millisecond timestamp provides natural chronological ordering.
   * - Monotonic counter ensures strict temporal sortability even if multiple GUIDs
   *   are generated within the same millisecond.
   * - Excellent for database primary keys, distributed tracing, and time-ordered events.
   *
   * @param customTimestampMs Optional custom timestamp in milliseconds (defaults to Date.now()).
   */
  public static v7(customTimestampMs?: number): Guid {
    const bytes = getRandomBytes(16);
    const ts = customTimestampMs !== undefined ? customTimestampMs : Date.now();

    // 48-bit timestamp into bytes 0..5 (big-endian)
    bytes[0] = Math.floor(ts / 0x10000000000) & 0xff;
    bytes[1] = Math.floor(ts / 0x100000000) & 0xff;
    bytes[2] = Math.floor(ts / 0x1000000) & 0xff;
    bytes[3] = Math.floor(ts / 0x10000) & 0xff;
    bytes[4] = Math.floor(ts / 0x100) & 0xff;
    bytes[5] = ts & 0xff;

    // Sub-millisecond monotonic counter
    if (ts === lastV7Timestamp) {
      v7SequenceCounter = (v7SequenceCounter + 1) & 0xfff; // 12-bit rollover
    } else {
      lastV7Timestamp = ts;
      // Initialize counter with random 12-bit seed
      v7SequenceCounter = ((bytes[6] << 8) | bytes[7]) & 0x7ff;
    }

    // Version 7 in upper 4 bits of byte 6 (0x70) + upper 4 bits of counter
    bytes[6] = 0x70 | ((v7SequenceCounter >> 8) & 0x0f);
    // Lower 8 bits of counter in byte 7
    bytes[7] = v7SequenceCounter & 0xff;

    // Variant 1 in upper 2 bits of byte 8 (0x80)
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    return new Guid(bytes);
  }

  // --- Parsing & Validation ---

  /**
   * Parses a string into a Guid instance. Throws a TypeError if invalid.
   */
  public static parse(input: string | Guid): Guid {
    if (input instanceof Guid) {
      return input;
    }
    return new Guid(input);
  }

  /**
   * Attempts to parse a string into a Guid.
   *
   * Signature 1: `Guid.tryParse(input)` returns `Guid` instance or `null` if invalid.
   * Signature 2: `Guid.tryParse(input, out)` returns `boolean` and sets `out.value`.
   */
  public static tryParse(input: string | null | undefined): Guid | null;
  public static tryParse(input: string | null | undefined, out: { value: Guid | null }): boolean;
  public static tryParse(input: string | null | undefined, out?: { value: Guid | null }): Guid | null | boolean {
    const normalized = normalizeGuid(input);
    const parsed = normalized ? new Guid(normalized) : null;

    if (out && typeof out === 'object') {
      out.value = parsed;
      return parsed !== null;
    }

    return parsed;
  }

  /**
   * Checks whether a given string is a valid GUID format.
   */
  public static isValid(input: string | null | undefined): boolean {
    return normalizeGuid(input) !== null;
  }

  /**
   * Creates a Guid instance from a string or returns Guid.empty if invalid.
   */
  public static fromString(input: string | null | undefined): Guid {
    const parsed = this.tryParse(input);
    return parsed ?? this.empty;
  }

  /**
   * Creates a Guid instance from a 16-byte array or buffer.
   */
  public static fromByteArray(bytes: Uint8Array | number[]): Guid {
    return new Guid(bytes);
  }

  // --- Serialization & Formatting ---

  /**
   * Returns a 16-byte Uint8Array representing this GUID in binary form.
   */
  public toByteArray(): Uint8Array {
    const hex = this._value.replace(/-/g, '');
    const bytes = new Uint8Array(16);
    for (let i = 0; i < 16; i++) {
      bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }
    return bytes;
  }

  /**
   * Returns the string representation in specified format:
   * - 'D' (Default): xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   * - 'N': xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (no hyphens)
   * - 'B': {xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}
   * - 'P': (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
   */
  public toString(format: GuidFormat = 'D'): string {
    switch (format.toUpperCase()) {
      case 'N':
        return this._value.replace(/-/g, '');
      case 'B':
        return `{${this._value}}`;
      case 'P':
        return `(${this._value})`;
      case 'D':
      default:
        return this._value;
    }
  }

  /**
   * Returns the standard string representation for JSON serialization.
   */
  public toJSON(): string {
    return this._value;
  }

  /**
   * Returns the primitive string value for string coercion.
   */
  public valueOf(): string {
    return this._value;
  }

  // --- Equality & Comparison ---

  /**
   * Determines whether this Guid is equal to another Guid or string representation.
   */
  public equals(other: Guid | string | null | undefined): boolean {
    if (!other) {
      return false;
    }
    if (other instanceof Guid) {
      return this._value === other._value;
    }
    const normalized = normalizeGuid(other);
    return normalized !== null && this._value === normalized;
  }

  /**
   * Static equality helper comparing two GUIDs or string representations.
   */
  public static equals(a: Guid | string | null | undefined, b: Guid | string | null | undefined): boolean {
    if (a === b) {
      return true;
    }
    if (!a || !b) {
      return false;
    }

    const normA = a instanceof Guid ? a._value : normalizeGuid(a);
    const normB = b instanceof Guid ? b._value : normalizeGuid(b);

    if (!normA || !normB) {
      return false;
    }
    return normA === normB;
  }

  /**
   * Compares this Guid with another for sorting.
   * Returns negative number if this < other, 0 if equal, positive number if this > other.
   */
  public compareTo(other: Guid | string): number {
    const otherNorm = other instanceof Guid ? other._value : normalizeGuid(other);
    if (!otherNorm) {
      return 1;
    }
    return this._value.localeCompare(otherNorm);
  }

  /**
   * Static comparison function suitable for Array.prototype.sort.
   */
  public static compare(a: Guid | string, b: Guid | string): number {
    const normA = a instanceof Guid ? a._value : (normalizeGuid(a) ?? '');
    const normB = b instanceof Guid ? b._value : (normalizeGuid(b) ?? '');
    return normA.localeCompare(normB);
  }
}
