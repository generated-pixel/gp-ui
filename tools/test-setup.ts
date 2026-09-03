import { vi, expect } from 'vitest';

// Jasmine compatibility shim for Vitest
const globalObj = typeof globalThis !== 'undefined' ? globalThis : window;

if (typeof (globalObj as any).jasmine === 'undefined') {
  (globalObj as any).jasmine = {
    createSpy: (name?: string) => vi.fn(),
    createSpyObj: (baseName: string, methodNames: string[]) => {
      const obj: Record<string, any> = {};
      for (const m of methodNames) {
        obj[m] = vi.fn();
      }
      return obj;
    },
    any: (type: any) => expect.any(type),
    objectContaining: (sample: any) => expect.objectContaining(sample),
    stringMatching: (sample: any) => expect.stringMatching(sample)
  };
}

if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    })
  });
}

// Extend Vitest / Chai matchers for Jasmine-style boolean assertions
expect.extend({
  toBeTrue(received: unknown) {
    return {
      pass: received === true,
      message: () => `expected ${received} to be true`
    };
  },
  toBeFalse(received: unknown) {
    return {
      pass: received === false,
      message: () => `expected ${received} to be false`
    };
  }
});
