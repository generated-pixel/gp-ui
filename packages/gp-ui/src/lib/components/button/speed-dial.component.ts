import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent } from './button.component';
import { GpMenuItem } from './split-button.component';

export type GpSpeedDialDirection = 'up' | 'down' | 'left' | 'right';
export type GpSpeedDialType = 'linear' | 'circle' | 'semi-circle';

@Component({
  selector: 'gp-speed-dial',
  standalone: true,
  imports: [CommonModule, GpButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="gp-speed-dial" [class]="'gp-speed-dial-direction-' + direction">
      <gp-button
        [icon]="visible() ? hideIcon : showIcon"
        [rounded]="true"
        [iconOnly]="true"
        [disabled]="disabled"
        (onClickEvent)="toggle()"
        class="gp-speed-dial-button"
      />

      @if (visible()) {
        <ul class="gp-speed-dial-list" role="menu">
          @for (item of model; track $index) {
            <li class="gp-speed-dial-item" role="none">
              <gp-button
                [icon]="item.icon || 'star'"
                [severity]="'secondary'"
                [rounded]="true"
                [size]="'sm'"
                [disabled]="item.disabled || false"
                (onClickEvent)="onItemClick(item, $event)"
                class="gp-speed-dial-action"
              />
            </li>
          }
        </ul>
      }
    </div>
  `,
  styles: [`
    .gp-speed-dial {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .gp-speed-dial-list {
      position: absolute;
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      gap: 0.5rem;
      z-index: 100;
    }
    .gp-speed-dial-direction-up .gp-speed-dial-list {
      flex-direction: column-reverse;
      bottom: 100%;
      margin-bottom: 0.5rem;
    }
    .gp-speed-dial-direction-down .gp-speed-dial-list {
      flex-direction: column;
      top: 100%;
      margin-top: 0.5rem;
    }
    .gp-speed-dial-direction-left .gp-speed-dial-list {
      flex-direction: row-reverse;
      right: 100%;
      margin-right: 0.5rem;
    }
    .gp-speed-dial-direction-right .gp-speed-dial-list {
      flex-direction: row;
      left: 100%;
      margin-left: 0.5rem;
    }
  `]
})
export class GpSpeedDialComponent {
  @Input() model: GpMenuItem[] = [];
  @Input() direction: GpSpeedDialDirection = 'up';
  @Input() showIcon = 'plus';
  @Input() hideIcon = 'times';
  @Input() disabled = false;

  @Output() onVisibleChange = new EventEmitter<boolean>();

  protected visible = signal<boolean>(false);

  public toggle(): void {
    if (this.disabled) return;
    const next = !this.visible();
    this.visible.set(next);
    this.onVisibleChange.emit(next);
  }

  public onItemClick(item: GpMenuItem, event: MouseEvent): void {
    if (item.disabled) return;
    if (item.command) {
      item.command({ originalEvent: event, item });
    }
    this.visible.set(false);
  }
}
