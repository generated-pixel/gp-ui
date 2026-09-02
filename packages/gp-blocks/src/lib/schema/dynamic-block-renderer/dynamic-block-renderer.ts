import { Component, input, output, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { GpDynamicForm } from '../dynamic-form/dynamic-form';
import { GpDynamicHeader } from '../dynamic-header/dynamic-header';
import { GpDynamicStats } from '../dynamic-stats/dynamic-stats';
import { GpBadge, GpTag, GpAvatar, GpIcon } from '@generatedpixel/gp-ui';
import { GpBlockMetadata, GpFormAction } from '../schema.types';

@Component({
  selector: 'gp-dynamic-block-renderer',
  standalone: true,
  imports: [
    GpDynamicForm,
    GpDynamicHeader,
    GpDynamicStats,
    GpBadge,
    GpTag,
    GpAvatar,
    GpIcon
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dynamic-block-renderer.html',
  styleUrl: './dynamic-block-renderer.scss'
})
export class GpDynamicBlockRenderer {
  public metadata = input<GpBlockMetadata | undefined>(undefined);

  public formSubmit = output<Record<string, any>>();
  public formChange = output<Record<string, any>>();
  public actionClick = output<GpFormAction>();
  public backClick = output<void>();

  public onActionClick(action: GpFormAction): void {
    this.actionClick.emit(action);
  }
}
