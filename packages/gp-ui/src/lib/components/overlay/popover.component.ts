import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, signal, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gp-popover',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (visible()) {
      <div
        class="gp-popover"
        [style.top.px]="top()"
        [style.left.px]="left()"
        (click)="$event.stopPropagation()"
      >
        <ng-content />
      </div>
    }
  `,
  styles: [`
    .gp-popover {
      position: absolute;
      background: var(--gp-surface-overlay);
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius);
      box-shadow: var(--gp-shadow-lg);
      padding: 1rem;
      z-index: 1050;
      animation: gp-slide-down 0.15s ease-out;
      min-width: 14rem;
    }
  `]
})
export class GpPopoverComponent {
  @Output() onShow = new EventEmitter<void>();
  @Output() onHide = new EventEmitter<void>();

  protected visible = signal<boolean>(false);
  protected top = signal<number>(0);
  protected left = signal<number>(0);

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.hide();
    }
  }

  public toggle(event: MouseEvent, target?: HTMLElement): void {
    event.stopPropagation();
    if (this.visible()) {
      this.hide();
    } else {
      this.show(event, target);
    }
  }

  public show(event: MouseEvent, target?: HTMLElement): void {
    const el = target || (event.currentTarget as HTMLElement);
    if (el) {
      const rect = el.getBoundingClientRect();
      this.top.set(rect.bottom + window.scrollY + 6);
      this.left.set(rect.left + window.scrollX);
    }
    this.visible.set(true);
    this.onShow.emit();
  }

  public hide(): void {
    if (this.visible()) {
      this.visible.set(false);
      this.onHide.emit();
    }
  }
}
