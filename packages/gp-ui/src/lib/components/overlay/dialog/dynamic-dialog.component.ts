import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  Type,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
  Injector
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpFocusTrapDirective } from '../../../overlay/focus-trap.directive';
import {
  GpDialogRef,
  GpDynamicDialogConfig,
  GP_DIALOG_CONFIG,
  GP_DIALOG_DATA,
  GP_DIALOG_REF
} from '../../../services/dialog.interface';

@Component({
  selector: 'gp-dynamic-dialog',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpFocusTrapDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dynamic-dialog.component.html',
  styleUrl: './dynamic-dialog.component.scss'
})
export class GpDynamicDialogComponent implements AfterViewInit {
  @ViewChild('contentHost', { read: ViewContainerRef }) contentHost!: ViewContainerRef;

  public childComponentType!: Type<any>;
  public config!: GpDynamicDialogConfig;
  public dialogRef!: GpDialogRef;

  public maximized = signal<boolean>(false);

  public ngAfterViewInit(): void {
    if (this.childComponentType && this.contentHost) {
      const customInjector = Injector.create({
        providers: [
          { provide: GP_DIALOG_CONFIG, useValue: this.config },
          { provide: GP_DIALOG_DATA, useValue: this.config.data },
          { provide: GP_DIALOG_REF, useValue: this.dialogRef }
        ],
        parent: this.contentHost.injector
      });

      this.contentHost.createComponent(this.childComponentType, {
        injector: customInjector
      });
    }
  }

  public close(): void {
    this.dialogRef.close();
  }

  public toggleMaximize(): void {
    this.maximized.update((m) => !m);
  }

  public onMaskClick(event: MouseEvent): void {
    if (this.config.dismissableMask !== false) {
      this.close();
    }
  }
}
