import {
  Injectable,
  ApplicationRef,
  createComponent,
  EnvironmentInjector,
  Type,
  inject,
  DOCUMENT,
  ElementRef
} from '@angular/core';
import {
  GpDialogRef,
  GpDynamicDialogConfig,
  GP_DIALOG_CONFIG,
  GP_DIALOG_DATA,
  GP_DIALOG_REF
} from './dialog.interface';
import { GpDynamicDialog } from '../components/overlay/dialog/dynamic-dialog';

@Injectable({
  providedIn: 'root'
})
export class GpDialogService {
  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);
  private document = inject(DOCUMENT);

  /**
   * Dynamically opens a modal dialog rendering the given component type.
   * Returns a GpDialogRef handle with an `onClose` Observable of the selected result.
   */
  public open<TData = any, TResult = any>(
    componentType: Type<any>,
    config: GpDynamicDialogConfig<TData> = {}
  ): GpDialogRef<TResult> {
    const dialogRef = new GpDialogRef<TResult>();

    const componentRef = createComponent(GpDynamicDialog, {
      environmentInjector: this.injector
    });

    componentRef.instance.childComponentType = componentType;
    componentRef.instance.config = config;
    componentRef.instance.dialogRef = dialogRef;

    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;

    let targetContainer: HTMLElement = this.document.body;
    if (config.appendTo) {
      if (typeof config.appendTo === 'string' && config.appendTo !== 'body' && config.appendTo !== 'self') {
        const found = this.document.querySelector(config.appendTo) as HTMLElement;
        if (found) {
          targetContainer = found;
        }
      } else if (config.appendTo instanceof ElementRef) {
        targetContainer = config.appendTo.nativeElement;
      } else if (typeof HTMLElement !== 'undefined' && config.appendTo instanceof HTMLElement) {
        targetContainer = config.appendTo;
      }
    }

    targetContainer.appendChild(domElem);

    dialogRef.onDestroy.subscribe(() => {
      this.appRef.detachView(componentRef.hostView);
      componentRef.destroy();
      if (domElem && domElem.parentNode) {
        domElem.parentNode.removeChild(domElem);
      }
    });

    return dialogRef;
  }
}
