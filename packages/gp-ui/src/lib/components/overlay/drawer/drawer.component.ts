import { GpBaseComponent } from '../../../base/gp-base.component';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
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

  @Input() header = '';
  @Input() position: GpDrawerPosition = 'left';
  @Input() modal = true;
  @Input() dismissable = true;

  @Output() visibleChange = new EventEmitter<boolean>();

  protected visible = signal<boolean>(false);
  protected zIndex = signal<number>(1100);

  @Input() set visibleProp(val: boolean) {
    if (val !== this.visible()) {
      if (val) {
        this.show();
      } else this.close();
    }
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
    if (this.dismissable) {
      this.close();
    }
  }
}
