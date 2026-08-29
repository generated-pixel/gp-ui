import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  templateUrl: './dynamic-header.component.html',
  styleUrl: './dynamic-header.component.scss'
})
export class GpDynamicHeaderComponent {
  @Input() schema?: GpHeaderSchema;
  @Output() actionClick = new EventEmitter<GpFormAction>();
  @Output() backClick = new EventEmitter<void>();
}
