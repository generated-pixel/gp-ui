import { Component, output, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import {
  GpButton,
  GpBadge,
  GpAvatar,
  GpBreadcrumb,
  GpIcon
} from '@generatedpixel/gp-ui';
import { GpBlockBase } from '../../base/gp-block-base';
import { GpHeaderSchema } from '../schema.types';

@Component({
  selector: 'gp-dynamic-header',
  standalone: true,
  imports: [GpButton, GpBadge, GpAvatar, GpBreadcrumb, GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dynamic-header.html',
  styleUrl: './dynamic-header.scss'
})
export class GpDynamicHeader extends GpBlockBase<GpHeaderSchema> {
  public backClick = output<void>();
}
