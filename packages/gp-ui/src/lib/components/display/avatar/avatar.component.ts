import { GpBaseComponent } from '../../../base/gp-base.component';
import { Component, input, computed, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';

export type GpAvatarSize = 'normal' | 'large' | 'xlarge';
export type GpAvatarShape = 'square' | 'circle';

@Component({
  selector: 'gp-avatar-group',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class GpAvatarGroupComponent extends GpBaseComponent {}

@Component({
  selector: 'gp-avatar',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      class="gp-avatar"
      [class]="'gp-avatar-' + size() + ' gp-avatar-' + shape()"
      [style.background-color]="bgColor() || null"
      [style.color]="textColor() || null"
    >
      @if (image()) {
        <img [src]="image()" [alt]="label() || 'avatar'" class="gp-avatar-img" />
      } @else if (icon()) {
        <gp-icon [name]="icon()" [size]="iconSize()" class="gp-avatar-icon" />
      } @else if (label()) {
        <span class="gp-avatar-text">{{ label() }}</span>
      }
      <ng-content />
    </div>
  `,
  styles: [
    `
      .gp-avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2.25rem;
        height: 2.25rem;
        font-size: var(--gp-font-size-sm);
        font-weight: 700;
        background: var(--gp-primary-light);
        color: var(--gp-primary);
        overflow: hidden;
        user-select: none;
        flex-shrink: 0;
      }
      .gp-avatar-circle {
        border-radius: 50%;
      }
      .gp-avatar-square {
        border-radius: var(--gp-border-radius);
      }
      .gp-avatar-large {
        width: 3rem;
        height: 3rem;
        font-size: var(--gp-font-size-lg);
      }
      .gp-avatar-xlarge {
        width: 4rem;
        height: 4rem;
        font-size: var(--gp-font-size-2xl);
      }
      .gp-avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    `
  ]
})
export class GpAvatarComponent extends GpBaseComponent {
  public label = input<string>('');
  public icon = input<string>('');
  public image = input<string>('');
  public size = input<GpAvatarSize>('normal');
  public shape = input<GpAvatarShape>('square');
  public bgColor = input<string>('');
  public textColor = input<string>('');

  protected iconSize = computed(() => {
    switch (this.size()) {
      case 'large':
        return '1.5em';
      case 'xlarge':
        return '2em';
      default:
        return '1em';
    }
  });
}
