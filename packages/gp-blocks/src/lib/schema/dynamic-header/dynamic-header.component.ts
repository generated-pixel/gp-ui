import { Component, input, output, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GpButtonComponent,
  GpBadgeComponent,
  GpAvatarComponent,
  GpBreadcrumbComponent,
  GpIconComponent
} from '@generatedpixel/gp-ui';
import { GpHeaderSchema, GpFormAction } from '../schema.types';

@Component({
  selector: 'gp-dynamic-header',
  standalone: true,
  imports: [
    CommonModule,
    GpButtonComponent,
    GpBadgeComponent,
    GpAvatarComponent,
    GpBreadcrumbComponent,
    GpIconComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './dynamic-header.component.html',
  styleUrl: './dynamic-header.component.scss'
})
export class GpDynamicHeaderComponent {
  public schema = input<GpHeaderSchema | undefined>(undefined);
  public actionClick = output<GpFormAction>();
  public backClick = output<void>();
}
