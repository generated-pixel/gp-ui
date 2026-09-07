import { Injectable, signal, computed } from '@angular/core';
import { GpBlockUIOptions, GpBlockUIState } from './block-ui.interface';

/**
 * Enterprise BlockUI Service.
 * Allows programmatic blocking and unblocking of the entire application viewport
 * or specific named targets and selectors from anywhere in the application.
 */
@Injectable({
  providedIn: 'root'
})
export class GpBlockUIService {
  private globalState = signal<GpBlockUIState>({ blocked: false });
  private targetStates = signal<Record<string, GpBlockUIState>>({});

  /** Signal indicating whether the global document overlay is currently blocked */
  public readonly isGlobalBlocked = computed(() => {
    return this.globalState().blocked;
  });

  /** Readonly signal of the global blocking state including options */
  public readonly global = this.globalState.asReadonly();

  /** Readonly signal of all target states */
  public readonly targets = this.targetStates.asReadonly();

  /**
   * Blocks the document or a named target container.
   *
   * @param target Optional name or selector of target. Omit or pass 'document' / 'body' for global.
   * @param options Optional configuration options (message, spinner, blur, etc.).
   */
  public block(target?: string, options?: GpBlockUIOptions): void {
    if (!target || target === 'document' || target === 'body') {
      this.globalState.set({ blocked: true, options });
      return;
    }

    this.targetStates.update((prev) => {
      return {
        ...prev,
        [target]: { blocked: true, options }
      };
    });
  }

  /**
   * Unblocks the document or a named target container.
   *
   * @param target Optional name or selector of target. Omit or pass 'document' / 'body' for global.
   */
  public unblock(target?: string): void {
    if (!target || target === 'document' || target === 'body') {
      this.globalState.set({ blocked: false });
      return;
    }

    this.targetStates.update((prev) => {
      const next = { ...prev };
      delete next[target];
      return next;
    });
  }

  /**
   * Checks whether the document or a specific target is currently blocked.
   *
   * @param target Optional name or selector of target. Omit or pass 'document' / 'body' for global.
   */
  public isBlocked(target?: string): boolean {
    if (!target || target === 'document' || target === 'body') {
      return this.globalState().blocked;
    }

    const state = this.targetStates()[target];
    if (state) {
      return state.blocked;
    }

    return false;
  }

  /**
   * Returns the current options for the document or a specific target.
   *
   * @param target Optional name or selector of target. Omit or pass 'document' / 'body' for global.
   */
  public getOptions(target?: string): GpBlockUIOptions | undefined {
    if (!target || target === 'document' || target === 'body') {
      return this.globalState().options;
    }

    return this.targetStates()[target]?.options;
  }
}
