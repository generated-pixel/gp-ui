import { Injectable, signal } from '@angular/core';
import { GpCommandItem } from './command-palette.interface';

@Injectable({
  providedIn: 'root'
})
export class GpCommandPaletteService {
  private _isOpen = signal(false);
  private _registeredCommands = signal<GpCommandItem[]>([]);

  public readonly isOpen = this._isOpen.asReadonly();
  public readonly registeredCommands = this._registeredCommands.asReadonly();

  /**
   * Opens the Command Palette dialog.
   */
  public open(): void {
    this._isOpen.set(true);
  }

  /**
   * Closes the Command Palette dialog.
   */
  public close(): void {
    this._isOpen.set(false);
  }

  /**
   * Toggles the open/closed state of the Command Palette dialog.
   */
  public toggle(): void {
    this._isOpen.update((open) => !open);
  }

  /**
   * Registers one or multiple commands dynamically.
   */
  public registerCommands(commands: GpCommandItem[]): () => void {
    this._registeredCommands.update((current) => [...current, ...commands]);

    return () => {
      const idsToRemove = new Set(commands.map((c) => c.id));
      this._registeredCommands.update((current) => current.filter((c) => !idsToRemove.has(c.id)));
    };
  }

  /**
   * Clears all registered commands.
   */
  public clearCommands(): void {
    this._registeredCommands.set([]);
  }
}
