import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
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

  @Input() public sidebarTemplate?: TemplateRef<any>;
  @Input() public topActionsTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('sidebar') public contentSidebar?: TemplateRef<any>;
  @ContentChild('topActions') public contentTopActions?: TemplateRef<any>;
  @ContentChild('actions') public contentActions?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;
  @ContentChild('main') public contentMain?: TemplateRef<any>;

  public get effectiveSidebar(): TemplateRef<any> | undefined {
    return this.sidebarTemplate || this.contentSidebar;
  }

  public get effectiveTopActions(): TemplateRef<any> | undefined {
    return this.topActionsTemplate || this.contentTopActions || this.contentActions;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea || this.contentMain;
  }

  public toggleGroup(idx: number): void {
    const grp = this.groups()[idx];
    if (grp) {
      grp.open = !grp.open;
      this.groupToggle.emit(grp);
    }
  }
}
