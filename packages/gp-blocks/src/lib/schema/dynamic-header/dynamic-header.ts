import { Component, input, output, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import {
  GpButton,
  GpBadge,
  GpAvatar,
  GpBreadcrumb,
  GpIcon
} from '@generatedpixel/gp-ui';
import { GpHeaderSchema, GpFormAction } from '../schema.types';

@Component({
  selector: 'gp-dynamic-header',
  standalone: true,
  imports: [GpButton, GpBadge, GpAvatar, GpBreadcrumb, GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dynamic-header.html',
  styleUrl: './dynamic-header.scss'
})
export class GpDynamicHeader {
  public schema = input<GpHeaderSchema | undefined>(undefined);
  public actionClick = output<GpFormAction>();
  public backClick = output<void>();
}
