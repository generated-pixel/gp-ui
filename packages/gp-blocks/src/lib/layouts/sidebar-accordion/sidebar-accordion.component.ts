import { Component, input, output, TemplateRef, contentChild, computed, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpAccordionSubLink {
  id: string;
  label: string;
  active?: boolean;
}

export interface GpAccordionNavGroup {
  id: string;
  title: string;
  icon: string;
  open?: boolean;
  links: GpAccordionSubLink[];
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-layout-sidebar-accordion',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './sidebar-accordion.component.html',
  styleUrl: './sidebar-accordion.component.scss'
})
export class GpLayoutSidebarAccordionComponent {
  public brandName = input<string>('');
  public title = input<string>('');
  public activeSubLinkId = input<string>('');

  public groups = input<GpAccordionNavGroup[]>([]);

  public linkClick = output<GpAccordionSubLink>();
  public groupToggle = output<GpAccordionNavGroup>();

  public sidebarTemplate = input<TemplateRef<any> | undefined>(undefined);
  public topActionsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentSidebar = contentChild<TemplateRef<any>>('sidebar');
  public contentTopActions = contentChild<TemplateRef<any>>('topActions');
  public contentActions = contentChild<TemplateRef<any>>('actions');
  public contentArea = contentChild<TemplateRef<any>>('content');
  public contentMain = contentChild<TemplateRef<any>>('main');

  public effectiveSidebar = computed(() => this.sidebarTemplate() || this.contentSidebar());

  public effectiveTopActions = computed<TemplateRef<any> | undefined>(() => this.topActionsTemplate() || this.contentTopActions() || this.contentActions());

  public effectiveContent = computed<TemplateRef<any> | undefined>(() => this.contentTemplate() || this.contentArea() || this.contentMain());

  public toggleGroup(idx: number): void {
    const grp = this.groups()[idx];
    if (grp) {
      grp.open = !grp.open;
      this.groupToggle.emit(grp);
    }
  }
}
