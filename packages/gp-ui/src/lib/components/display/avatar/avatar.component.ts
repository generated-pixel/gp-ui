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
  templateUrl: './avatar-group.component.html',
  styleUrl: './avatar-group.component.scss'
})
export class GpAvatarGroupComponent extends GpBaseComponent {}

@Component({
  selector: 'gp-avatar',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
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
