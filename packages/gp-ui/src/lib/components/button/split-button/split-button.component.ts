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
}

@Component({
  selector: 'gp-split-button',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
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

  protected overlayVisible = signal<boolean>(false);

  constructor(private el: ElementRef) {
    super();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.overlayVisible.set(false);
    }
  }

  protected onDefaultClick(event: MouseEvent): void {
    this.onClickEvent.emit(event);
  }

  protected toggleOverlay(event: MouseEvent): void {
    event.stopPropagation();
    this.overlayVisible.update((v) => !v);
  }

  protected onItemClick(item: GpMenuItem, event: MouseEvent): void {
    if (item.disabled) {
      return;
    }
    if (item.command) {
      item.command({ originalEvent: event, item });
    }
    this.overlayVisible.set(false);
  }
}
