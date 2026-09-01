import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GpBottomSheetService {
  private _isOpen = signal(false);

  public readonly isOpen = this._isOpen.asReadonly();

  public open(): void {
    this._isOpen.set(true);
  }

  public close(): void {
    this._isOpen.set(false);
  }

  public toggle(): void {
    this._isOpen.update((v) => !v);
  }
}
