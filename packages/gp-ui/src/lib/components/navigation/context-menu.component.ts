import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation, ElementRef, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';
import { GpMenuItem } from '../button/split-button.component';

@Component({
  selector: 'gp-context-menu',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (visible()) {
      <div
        class="gp-menu gp-menu-popup gp-context-menu"
        [style.top.px]="position().y"
        [style.left.px]="position().x"
        role="menu"
        (click)="$event.stopPropagation()"
      >
        <ul class="gp-menu-list">
          @for (item of model; track $index) {
            @if (item.separator) {
              <li class="gp-menu-separator" role="separator"></li>
            } @else {
              <li
                class="gp-menu-item"
                [class.gp-menu-item-disabled]="item.disabled"
                role="menuitem"
                (click)="onItemClick(item, $event)"
              >
                <div class="gp-menu-item-link">
                  @if (item.icon) {
                    <gp-icon [name]="item.icon" class="gp-menu-item-icon" />
                  }
                  <span class="gp-menu-item-text">{{ item.label }}</span>
                </div>
              </li>
            }
          }
        </ul>
      </div>
    }
  `,
  styles: [`
    .gp-context-menu {
      position: fixed !important;
      z-index: 1200;
    }
  `]
})
export class GpContextMenuComponent {
  @Input() model: GpMenuItem[] = [];

  protected visible = signal<boolean>(false);
  protected position = signal<{ x: number; y: number }>({ x: 0, y: 0 });

  @HostListener('document:click')
  onDocumentClick(): void {
    this.visible.set(false);
  }

  public show(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.position.set({ x: event.clientX, y: event.clientY });
    this.visible.set(true);
  }

  public hide(): void {
    this.visible.set(false);
  }

  public onItemClick(item: GpMenuItem, event: MouseEvent): void {
    if (item.disabled) return;
    if (item.command) {
      item.command({ originalEvent: event, item });
    }
    this.hide();
  }
}
