import { Component, input, output, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

import { GpDynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { GpDynamicHeaderComponent } from '../dynamic-header/dynamic-header.component';
import { GpDynamicStatsComponent } from '../dynamic-stats/dynamic-stats.component';
import { GpBadgeComponent, GpTagComponent, GpAvatarComponent, GpIconComponent } from '@generatedpixel/gp-ui';
import { GpBlockMetadata, GpFormAction } from '../schema.types';

@Component({
  selector: 'gp-dynamic-block-renderer',
  standalone: true,
  imports: [
    GpDynamicFormComponent,
    GpDynamicHeaderComponent,
    GpDynamicStatsComponent,
    GpBadgeComponent,
    GpTagComponent,
    GpAvatarComponent,
    GpIconComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dynamic-block-renderer.component.html',
  styleUrl: './dynamic-block-renderer.component.scss'
})
export class GpDynamicBlockRendererComponent {
  public metadata = input<GpBlockMetadata | undefined>(undefined);

  public formSubmit = output<Record<string, any>>();
  public formChange = output<Record<string, any>>();
  public actionClick = output<GpFormAction>();
  public backClick = output<void>();

  public onActionClick(action: GpFormAction): void {
    this.actionClick.emit(action);
  }
}
