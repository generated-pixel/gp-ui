import { InjectionToken, TemplateRef, Type } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { GpAppendToTarget } from '../overlay/append-to.interface';

/**
 * Configuration options for opening a dynamic dialog via GpDialogService.
 */
export interface GpDynamicDialogConfig<TData = any> {
  header?: string;
  data?: TData;
  width?: string;
  maxWidth?: string;
  height?: string;
  closable?: boolean;
  maximizable?: boolean;
  dismissableMask?: boolean;
  showHeader?: boolean;
  showFooter?: boolean;
  styleClass?: string;
  contentStyle?: Record<string, any>;
  ariaLabel?: string;
  appendTo?: GpAppendToTarget;
}

/**
 * Injection token for accessing the dynamic dialog configuration and custom data.
 */
export const GP_DIALOG_CONFIG = new InjectionToken<GpDynamicDialogConfig>('GP_DIALOG_CONFIG');

/**
 * Injection token for accessing data passed to the dynamic dialog.
 */
export const GP_DIALOG_DATA = new InjectionToken<any>('GP_DIALOG_DATA');

/**
 * Handle reference to an active dynamic dialog instance.
 */
export class GpDialogRef<TResult = any> {
  private readonly onCloseSubject = new Subject<TResult | undefined>();
  private readonly onDestroySubject = new Subject<void>();

  public readonly onClose: Observable<TResult | undefined> = this.onCloseSubject.asObservable();
  public readonly onDestroy: Observable<void> = this.onDestroySubject.asObservable();

  /**
   * Closes the dialog and emits the optional result to subscribers.
   */
  public close(result?: TResult): void {
    this.onCloseSubject.next(result);
    this.onCloseSubject.complete();
    this.destroy();
  }

  /**
   * Destroys the dialog and completes streams.
   */
  public destroy(): void {
    this.onDestroySubject.next();
    this.onDestroySubject.complete();
  }
}

/**
 * Injection token for injecting GpDialogRef in dynamic child components.
 */
export const GP_DIALOG_REF = new InjectionToken<GpDialogRef>('GP_DIALOG_REF');
