import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GpButtonComponent,
  GpBadgeComponent,
  GpIconComponent,
  GpBadgeSeverity,
  GpButtonVariant,
  GpButtonSeverity
} from '@generatedpixel/gp-ui';

export interface GpHeaderBreadcrumb {
  label: string;
  url?: string;
}

export interface GpHeaderAction {
  id: string;
  label: string;
  icon?: string;
  variant?: GpButtonVariant;
  severity?: GpButtonSeverity;
}

@Component({
  selector: 'gp-header-page-with-actions',
  standalone: true,
  imports: [
    CommonModule,
    GpButtonComponent,
    GpBadgeComponent,
    GpIconComponent
  ],
  templateUrl: './header-page-with-actions.component.html',
  styleUrl: './header-page-with-actions.component.scss'
})
export class GpHeaderPageWithActionsComponent {
  public title = input<string>('');
  public badgeText = input<string>('');
  public badgeSeverity = input<GpBadgeSeverity>('success');
  public subtitle = input<string>('');
  public breadcrumbs = input<GpHeaderBreadcrumb[]>([]);
  public actions = input<GpHeaderAction[]>([]);

  public actionClick = output<GpHeaderAction>();
  public breadcrumbClick = output<GpHeaderBreadcrumb>();
}
