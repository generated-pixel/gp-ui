import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';

@Component({
  selector: 'gp-chip',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (visible()) {
      <div class="gp-chip">
        @if (image) {
          <img [src]="image" [alt]="label || 'Chip image'" class="gp-chip-img" />
        } @else if (icon) {
          <gp-icon [name]="icon" size="0.9em" class="gp-chip-icon" />
        }
        <span class="gp-chip-label">{{ label }}</span>
        <ng-content />
        @if (removable) {
          <button
            type="button"
            class="gp-chip-remove-btn"
            (click)="remove($event)"
            aria-label="Remove chip"
          >
            <gp-icon name="times" size="0.75em" />
          </button>
        }
      </div>
    }
  `,
  styles: [`
    .gp-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0.75rem;
      background: var(--gp-surface-section);
      color: var(--gp-text-color);
      border-radius: var(--gp-border-radius-full);
      font-size: var(--gp-font-size-sm);
    }
    .gp-chip-img {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      margin-left: -0.5rem;
      object-fit: cover;
    }
    .gp-chip-icon {
      color: var(--gp-text-color-secondary);
    }
    .gp-chip-remove-btn {
      background: none;
      border: none;
      color: var(--gp-text-color-muted);
      cursor: pointer;
      padding: 0.15rem;
      display: inline-flex;
      border-radius: 50%;
      margin-right: -0.25rem;
    }
    .gp-chip-remove-btn:hover {
      color: var(--gp-danger);
    }
  `]
})
export class GpChipComponent {
  @Input() label = '';
  @Input() icon = '';
  @Input() image = '';
  @Input() removable = false;

  @Output() onRemove = new EventEmitter<{ originalEvent: MouseEvent }>();

  protected visible = signal<boolean>(true);

  public remove(event: MouseEvent): void {
    event.stopPropagation();
    this.visible.set(false);
    this.onRemove.emit({ originalEvent: event });
  }
}
