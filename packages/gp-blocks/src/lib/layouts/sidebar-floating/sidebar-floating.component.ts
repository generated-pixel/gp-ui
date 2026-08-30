import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpFloatingSidebarNavEntry {
  id: string;
  icon: string;
  label: string;
  active?: boolean;
}

@Component({
  selector: 'gp-layout-sidebar-floating',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './sidebar-floating.component.html',
  styleUrl: './sidebar-floating.component.scss'
})
export class GpLayoutSidebarFloatingComponent {
  public brandName = input<string>('');
  public title = input<string>('');
  public activeNavId = input<string>('');

  public navItems = input<GpFloatingSidebarNavEntry[]>([]);

  public navItemClick = output<GpFloatingSidebarNavEntry>();

  @Input() public sidebarTemplate?: TemplateRef<any>;
  @Input() public brandTemplate?: TemplateRef<any>;
  @Input() public topActionsTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('sidebar') public contentSidebar?: TemplateRef<any>;
  @ContentChild('brand') public contentBrand?: TemplateRef<any>;
  @ContentChild('topActions') public contentTopActions?: TemplateRef<any>;
  @ContentChild('actions') public contentActions?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;
  @ContentChild('main') public contentMain?: TemplateRef<any>;

  public get effectiveSidebar(): TemplateRef<any> | undefined {
    return this.sidebarTemplate || this.contentSidebar;
  }

  public get effectiveBrand(): TemplateRef<any> | undefined {
    return this.brandTemplate || this.contentBrand;
  }

  public get effectiveTopActions(): TemplateRef<any> | undefined {
    return this.topActionsTemplate || this.contentTopActions || this.contentActions;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea || this.contentMain;
  }
}
