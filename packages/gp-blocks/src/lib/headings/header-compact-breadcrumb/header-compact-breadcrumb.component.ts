import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-header-compact-breadcrumb',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './header-compact-breadcrumb.component.html',
  styleUrl: './header-compact-breadcrumb.component.scss'
})
export class GpHeaderCompactBreadcrumbComponent {
  public backLabel = input<string>('Back');
  public activeItem = input<string>('');
  public editBtnLabel = input<string>('Edit');
  public shareBtnLabel = input<string>('Share');

  public backClick = output<void>();
  public editClick = output<void>();
  public shareClick = output<void>();

  @Input() public breadcrumbsTemplate?: TemplateRef<any>;
  @Input() public actionsTemplate?: TemplateRef<any>;

  @ContentChild('breadcrumbs') public contentBreadcrumbs?: TemplateRef<any>;
  @ContentChild('actions') public contentActions?: TemplateRef<any>;

  public get effectiveBreadcrumbs(): TemplateRef<any> | undefined {
    return this.breadcrumbsTemplate || this.contentBreadcrumbs;
  }

  public get effectiveActions(): TemplateRef<any> | undefined {
    return this.actionsTemplate || this.contentActions;
  }
}
