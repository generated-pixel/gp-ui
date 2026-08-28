import { GpBaseComponent } from '../../../base/gp-base.component';
import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ElementRef,
  HostListener,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GpButtonComponent, GpButtonSeverity, GpButtonSize, GpButtonVariant } from '../button/button.component';
import { GpIconComponent } from '../../../icons/icon.component';

export interface GpMenuItem {
  label?: string;
  icon?: string;
  command?: (event?: any) => void;
  url?: string;
  routerLink?: any;
  disabled?: boolean;
  separator?: boolean;
  badge?: string;
  items?: GpMenuItem[];
  target?: string;
  title?: string;
  expanded?: boolean;
}

@Component({
  selector: 'gp-split-button',
  standalone: true,
  imports: [CommonModule, RouterModule, GpButtonComponent, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './split-button.component.html',
  styleUrl: './split-button.component.scss'
})
export class GpSplitButtonComponent extends GpBaseComponent {
  public label = input<string>('');
  public icon = input<string>('');
  public model = input<GpMenuItem[]>([]);
  public severity = input<GpButtonSeverity>('primary');
  public variant = input<GpButtonVariant>('filled');
  public size = input<GpButtonSize>('md');

  public onClickEvent = output<MouseEvent>();

  public overlayVisible = signal<boolean>(false);

  constructor(private el: ElementRef) {
    super();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.overlayVisible.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.overlayVisible.set(false);
  }

  public onDefaultClick(event: MouseEvent): void {
    if (this.disabled()) {
      return;
    }
    this.onClickEvent.emit(event);
  }

  public toggleOverlay(event: MouseEvent): void {
    if (this.disabled()) {
      return;
    }
    event.stopPropagation();
    this.overlayVisible.update((v) => !v);
  }

  public onItemClick(item: GpMenuItem, event: MouseEvent): void {
    if (item.disabled) {
      return;
    }
    if (item.command) {
      item.command({ originalEvent: event, item });
    }
    this.overlayVisible.set(false);
  }
}
