import { GpBase } from '../../../base/gp-base';
import { Component, input, computed, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { GpIcon } from '../../../icons/icon';

export type GpAvatarSize = 'normal' | 'large' | 'xlarge';
export type GpAvatarShape = 'square' | 'circle';

@Component({
  selector: 'gp-avatar-group',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './avatar-group.html',
  styleUrl: './avatar-group.scss'
})
export class GpAvatarGroup extends GpBase {}

@Component({
  selector: 'gp-avatar',
  standalone: true,
  imports: [GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss'
})
export class GpAvatar extends GpBase {
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
