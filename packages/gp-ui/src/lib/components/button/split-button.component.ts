import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, ElementRef, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpButtonSeverity, GpButtonSize, GpButtonVariant } from './button.component';
import { GpIconComponent } from '../../icons/icon.component';

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
  template: `
    <div class="gp-split-button" [class.gp-split-button-expanded]="overlayVisible()">
      <gp-button
        [label]="label"
        [icon]="icon"
        [severity]="severity"
        [variant]="variant"
        [size]="size"
        [disabled]="disabled"
        (onClickEvent)="onDefaultClick($event)"
      />
      <gp-button
        icon="chevron-down"
        [severity]="severity"
        [variant]="variant"
        [size]="size"
        [disabled]="disabled"
        [iconOnly]="true"
        (onClickEvent)="toggleOverlay($event)"
        class="gp-split-button-dropdown"
      />

      @if (overlayVisible()) {
        <div class="gp-menu-overlay gp-split-button-menu" role="menu">
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
                  <span class="gp-menu-item-content">
                    @if (item.icon) {
                      <gp-icon [name]="item.icon" class="gp-menu-item-icon" />
                    }
                    <span class="gp-menu-item-text">{{ item.label }}</span>
                  </span>
                </li>
              }
            }
          </ul>
        </div>
      }
    </div>
  `,
  styles: [`
    .gp-split-button {
      display: inline-flex;
      position: relative;
    }
    .gp-split-button > .gp-button:first-child {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    .gp-split-button > .gp-split-button-dropdown .gp-button {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      margin-left: -1px;
      padding-left: 0.4rem;
      padding-right: 0.4rem;
    }
    .gp-menu-overlay {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 4px;
      background: var(--gp-surface-overlay);
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius);
      box-shadow: var(--gp-shadow-lg);
      min-width: 12rem;
      z-index: 1050;
      padding: 0.35rem 0;
      animation: gp-slide-down 0.15s ease-out;
    }
    .gp-menu-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .gp-menu-item {
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      font-size: var(--gp-font-size-sm);
      color: var(--gp-text-color);
      transition: background var(--gp-transition-duration);
    }
    .gp-menu-item:hover:not(.gp-menu-item-disabled) {
      background: var(--gp-surface-hover);
    }
    .gp-menu-item-disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .gp-menu-item-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .gp-menu-separator {
      height: 1px;
      background: var(--gp-surface-divider);
      margin: 0.35rem 0;
    }
  `]
})
export class GpSplitButtonComponent {
  @Input() label = '';
  @Input() icon = '';
  @Input() model: GpMenuItem[] = [];
  @Input() severity: GpButtonSeverity = 'primary';
  @Input() variant: GpButtonVariant = 'filled';
  @Input() size: GpButtonSize = 'md';
  @Input() disabled = false;

  @Output() onClickEvent = new EventEmitter<MouseEvent>();

  protected overlayVisible = signal<boolean>(false);

  constructor(private el: ElementRef) {}

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
    this.overlayVisible.update(v => !v);
  }

  protected onItemClick(item: GpMenuItem, event: MouseEvent): void {
    if (item.disabled) return;
    if (item.command) {
      item.command({ originalEvent: event, item });
    }
    this.overlayVisible.set(false);
  }
}
