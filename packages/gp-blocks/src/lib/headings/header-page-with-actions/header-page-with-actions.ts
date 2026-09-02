import {
  Component,
  input,
  output,
  TemplateRef,
  contentChild,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GpButton,
  GpBadge,
  GpIcon,
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
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-header-page-with-actions',
  standalone: true,
  imports: [CommonModule, GpButton, GpBadge, GpIcon],
  templateUrl: './header-page-with-actions.html',
  styleUrl: './header-page-with-actions.scss'
})
export class GpHeaderPageWithActions {
  public title = input<string>('');
  public badgeText = input<string>('');
  public badgeSeverity = input<GpBadgeSeverity>('success');
  public subtitle = input<string>('');
  public breadcrumbs = input<GpHeaderBreadcrumb[]>([]);
  public actions = input<GpHeaderAction[]>([]);

  public actionClick = output<GpHeaderAction>();
  public breadcrumbClick = output<GpHeaderBreadcrumb>();

  public breadcrumbsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public titleTemplate = input<TemplateRef<any> | undefined>(undefined);
  public actionsTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentBreadcrumbs = contentChild<TemplateRef<any>>('breadcrumbs');
  public contentTitle = contentChild<TemplateRef<any>>('title');
  public contentActions = contentChild<TemplateRef<any>>('actions');

  public effectiveBreadcrumbs = computed(() => this.breadcrumbsTemplate() || this.contentBreadcrumbs());

  public effectiveTitle = computed(() => this.titleTemplate() || this.contentTitle());

  public effectiveActions = computed(() => this.actionsTemplate() || this.contentActions());
}
