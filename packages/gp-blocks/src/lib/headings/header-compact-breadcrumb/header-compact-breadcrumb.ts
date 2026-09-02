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
import { GpButton, GpIcon } from '@generatedpixel/gp-ui';

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-header-compact-breadcrumb',
  standalone: true,
  imports: [CommonModule, GpButton, GpIcon],
  templateUrl: './header-compact-breadcrumb.html',
  styleUrl: './header-compact-breadcrumb.scss'
})
export class GpHeaderCompactBreadcrumb {
  public backLabel = input<string>('Back');
  public activeItem = input<string>('');
  public editBtnLabel = input<string>('Edit');
  public shareBtnLabel = input<string>('Share');

  public backClick = output<void>();
  public editClick = output<void>();
  public shareClick = output<void>();

  public breadcrumbsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public actionsTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentBreadcrumbs = contentChild<TemplateRef<any>>('breadcrumbs');
  public contentActions = contentChild<TemplateRef<any>>('actions');

  public effectiveBreadcrumbs = computed(() => this.breadcrumbsTemplate() || this.contentBreadcrumbs());

  public effectiveActions = computed(() => this.actionsTemplate() || this.contentActions());
}
