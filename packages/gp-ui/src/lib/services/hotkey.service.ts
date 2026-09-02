import { Injectable, NgZone, inject } from '@angular/core';

export interface GpHotkeyOptions {
  description?: string;
  group?: string;
  scope?: string;
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

export interface GpHotkeyBinding {
  keys: string;
  normalizedKeys: string;
  callback: (event: KeyboardEvent) => void;
  options: GpHotkeyOptions;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class GpHotkeyService {
  private zone = inject(NgZone);
  private bindings = new Map<string, GpHotkeyBinding>();
  private activeScopes: string[] = ['global'];
  private listenerActive = false;
  private nextId = 0;

  constructor() {
    this.initGlobalListener();
  }

  /**
   * Registers a keyboard shortcut.
   * e.g. 'meta.k', 'ctrl.s', 'shift.alt.d', 'escape'
   */
  public register(keys: string, callback: (event: KeyboardEvent) => void, options: GpHotkeyOptions = {}): () => void {
    const id = `hotkey-${++this.nextId}`;
    const normalizedKeys = this.normalizeKeyCombo(keys);

    const binding: GpHotkeyBinding = {
      keys,
      normalizedKeys,
      callback,
      options: {
        scope: 'global',
        preventDefault: true,
        stopPropagation: true,
        ...options
      },
      id
    };

    this.bindings.set(id, binding);

    return () => {
      this.bindings.delete(id);
    };
  }

  /**
   * Pushes a new active scope (e.g. when opening a modal dialog or overlay).
   */
  public pushScope(scope: string): void {
    this.activeScopes.push(scope);
  }

  /**
   * Pops an active scope.
   */
  public popScope(scope?: string): void {
    if (scope) {
      const idx = this.activeScopes.lastIndexOf(scope);
      if (idx !== -1) {
        this.activeScopes.splice(idx, 1);
      }
    } else if (this.activeScopes.length > 1) {
      this.activeScopes.pop();
    }
  }

  /**
   * Returns all currently registered hotkey bindings.
   */
  public getRegisteredHotkeys(): GpHotkeyBinding[] {
    return Array.from(this.bindings.values());
  }

  private initGlobalListener(): void {
    if (typeof window === 'undefined' || this.listenerActive) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      window.addEventListener('keydown', (event: KeyboardEvent) => {
        this.handleKeyDown(event);
      });
    });

    this.listenerActive = true;
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const currentScope = this.activeScopes[this.activeScopes.length - 1] || 'global';
    const pressed = this.getEventKeyCombo(event);

    for (const binding of this.bindings.values()) {
      const bindingScope = binding.options.scope || 'global';
      // Match scope (allow global or matching scope)
      if (bindingScope !== 'global' && bindingScope !== currentScope) {
        continue;
      }

      if (binding.normalizedKeys === pressed) {
        if (binding.options.preventDefault) {
          event.preventDefault();
        }
        if (binding.options.stopPropagation) {
          event.stopPropagation();
        }

        this.zone.run(() => {
          binding.callback(event);
        });
        break;
      }
    }
  }

  private normalizeKeyCombo(combo: string): string {
    const parts = combo
      .toLowerCase()
      .replace(/\s+/g, '')
      .split(/[.+]/)
      .map((p) => {
        if (p === 'cmd' || p === 'command' || p === 'meta') {
          return 'meta';
        }
        if (p === 'control') {
          return 'ctrl';
        }
        if (p === 'esc') {
          return 'escape';
        }
        return p;
      });

    const hasMeta = parts.includes('meta');
    const hasCtrl = parts.includes('ctrl');
    const hasAlt = parts.includes('alt');
    const hasShift = parts.includes('shift');

    const regularKeys = parts.filter((p) => !['meta', 'ctrl', 'alt', 'shift'].includes(p)).sort();

    const normalized: string[] = [];
    if (hasCtrl) {
      normalized.push('ctrl');
    }
    if (hasAlt) {
      normalized.push('alt');
    }
    if (hasShift) {
      normalized.push('shift');
    }
    if (hasMeta) {
      normalized.push('meta');
    }
    normalized.push(...regularKeys);

    return normalized.join('+');
  }

  private getEventKeyCombo(event: KeyboardEvent): string {
    const parts: string[] = [];
    if (event.ctrlKey) {
      parts.push('ctrl');
    }
    if (event.altKey) {
      parts.push('alt');
    }
    if (event.shiftKey) {
      parts.push('shift');
    }
    if (event.metaKey) {
      parts.push('meta');
    }

    let key = event.key.toLowerCase();
    if (key === 'escape' || key === 'esc') {
      key = 'escape';
    }
    if (!['control', 'alt', 'shift', 'meta'].includes(key)) {
      parts.push(key);
    }

    return parts.join('+');
  }
}
