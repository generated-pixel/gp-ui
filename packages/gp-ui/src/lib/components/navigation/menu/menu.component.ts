import { GpBaseComponent } from '../../../base/gp-base.component';
import {
  Component,
  input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ElementRef,
  HostListener,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpMenuItem } from '../../button/split-button/split-button.component';

@Component({
  selector: 'gp-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class GpMenuComponent extends GpBaseComponent {
  public model = input<GpMenuItem[]>([]);
  public popup = input<boolean>(false);

  protected visible = signal<boolean>(false);

  constructor(private el: ElementRef) {
    super();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.popup() && !this.el.nativeElement.contains(event.target)) {
      this.visible.set(false);
    }
  }

  public toggle(event: MouseEvent): void {
    event.stopPropagation();
    this.visible.update((v) => !v);
  }

  public show(event: MouseEvent): void {
    event.stopPropagation();
    this.visible.set(true);
  }

  public hide(): void {
    this.visible.set(false);
  }

  public onItemClick(item: GpMenuItem, event: MouseEvent): void {
    if (item.disabled) {
      return;
    }
    if (item.command) {
      item.command({ originalEvent: event, item });
    }
    if (this.popup()) {
      this.hide();
    }
  }
}
