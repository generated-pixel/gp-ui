import { GpBaseComponent } from '../../../base/gp-base.component';
import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  effect,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';
import { ZIndexService } from '../../../overlay/z-index.service';

export type GpDrawerPosition = 'left' | 'right' | 'top' | 'bottom';

@Component({
  selector: 'gp-drawer',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss'
})
export class GpDrawerComponent extends GpBaseComponent {
  private zIndexService = inject(ZIndexService);

  public header = input<string>('');
  public position = input<GpDrawerPosition>('left');
  public modal = input<boolean>(true);
  public dismissable = input<boolean>(true);
  public visibleInput = input<boolean | undefined>(undefined, { alias: 'visibleProp' });
  public visibleBinding = input<boolean | undefined>(undefined, { alias: 'visible' });

  public visibleChange = output<boolean>();

  protected visible = signal<boolean>(false);
  protected zIndex = signal<number>(1100);

  constructor() {
    super();
    effect(() => {
      const v = this.visibleInput() ?? this.visibleBinding();
      if (v !== undefined && v !== this.visible()) {
        if (v) {
          this.show();
        } else {
          this.close();
        }
      }
    });
  }

  public show(): void {
    this.zIndex.set(this.zIndexService.get('modal'));
    this.visible.set(true);
    this.visibleChange.emit(true);
  }

  public close(): void {
    this.visible.set(false);
    this.visibleChange.emit(false);
  }

  public onMaskClick(): void {
    if (this.dismissable()) {
      this.close();
    }
  }
}
