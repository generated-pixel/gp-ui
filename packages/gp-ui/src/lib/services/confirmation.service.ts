import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { GpConfirmation } from './confirmation.interface';

@Injectable({
  providedIn: 'root'
})
export class GpConfirmationService {
  private requireConfirmationSource = new Subject<GpConfirmation>();
  private acceptSource = new Subject<void>();
  private rejectSource = new Subject<void>();

  public readonly requireConfirmation$: Observable<GpConfirmation> = this.requireConfirmationSource.asObservable();
  public readonly accept$: Observable<void> = this.acceptSource.asObservable();
  public readonly reject$: Observable<void> = this.rejectSource.asObservable();

  public confirm(confirmation: GpConfirmation): void {
    this.requireConfirmationSource.next(confirmation);
  }

  public onAccept(): void {
    this.acceptSource.next();
  }

  public onReject(): void {
    this.rejectSource.next();
  }
}
