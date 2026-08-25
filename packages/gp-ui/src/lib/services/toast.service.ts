import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { GpToastMessage } from './toast.interface';
import { UniqueId } from '../utils/unique-id';

@Injectable({
  providedIn: 'root'
})
export class GpToastService {
  private messageSource = new Subject<GpToastMessage>();
  private clearSource = new Subject<string | undefined>();

  public readonly message$: Observable<GpToastMessage> = this.messageSource.asObservable();
  public readonly clear$: Observable<string | undefined> = this.clearSource.asObservable();

  public add(message: GpToastMessage): void {
    if (!message.id) {
      message.id = UniqueId.generate('toast_');
    }
    this.messageSource.next(message);
  }

  public addAll(messages: GpToastMessage[]): void {
    messages.forEach(msg => this.add(msg));
  }

  public success(summary: string, detail?: string, life = 3500): void {
    this.add({ severity: 'success', summary, detail, life });
  }

  public info(summary: string, detail?: string, life = 3500): void {
    this.add({ severity: 'info', summary, detail, life });
  }

  public warn(summary: string, detail?: string, life = 4500): void {
    this.add({ severity: 'warning', summary, detail, life });
  }

  public error(summary: string, detail?: string, life = 5000): void {
    this.add({ severity: 'error', summary, detail, life });
  }

  public clear(key?: string): void {
    this.clearSource.next(key);
  }
}
