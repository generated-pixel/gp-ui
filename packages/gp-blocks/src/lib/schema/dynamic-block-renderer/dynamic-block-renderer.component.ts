import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpDynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { GpDynamicHeaderComponent } from '../dynamic-header/dynamic-header.component';
import { GpDynamicStatsComponent } from '../dynamic-stats/dynamic-stats.component';
import { GpBadgeComponent, GpTagComponent, GpAvatarComponent, GpIconComponent } from '@generatedpixel/gp-ui';
import { GpBlockMetadata, GpFormAction } from '../schema.types';

@Component({
  selector: 'gp-dynamic-block-renderer',
  standalone: true,
  imports: [
    CommonModule,
    GpDynamicFormComponent,
    GpDynamicHeaderComponent,
    GpDynamicStatsComponent,
    GpBadgeComponent,
    GpTagComponent,
    GpAvatarComponent,
    GpIconComponent
  ],
  templateUrl: './dynamic-block-renderer.component.html',
  styleUrl: './dynamic-block-renderer.component.scss'
})
export class GpDynamicBlockRendererComponent {
  @Input() metadata?: GpBlockMetadata;

  @Output() formSubmit = new EventEmitter<Record<string, any>>();
  @Output() formChange = new EventEmitter<Record<string, any>>();
  @Output() actionClick = new EventEmitter<GpFormAction>();
  @Output() backClick = new EventEmitter<void>();

  onActionClick(action: GpFormAction) {
    this.actionClick.emit(action);
  }
}
