import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpAvatarComponent } from '@generatedpixel/gp-ui';

export interface GpHeaderOverNavEntry {
  id: string;
  icon: string;
  label: string;
  active?: boolean;
}

@Component({
  selector: 'gp-layout-sidebar-header-over',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpAvatarComponent],
  templateUrl: './sidebar-header-over.component.html',
  styleUrl: './sidebar-header-over.component.scss'
})
export class GpLayoutSidebarHeaderOverComponent {
  public brandName = input<string>('');
  public brandIcon = input<string>('layer-group');
  public userName = input<string>('');
  public activeNavId = input<string>('');

  public navItems = input<GpHeaderOverNavEntry[]>([]);

  public navItemClick = output<GpHeaderOverNavEntry>();
  public userClick = output<void>();

  @Input() public headerTemplate?: TemplateRef<any>;
  @Input() public sidebarTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('header') public contentHeader?: TemplateRef<any>;
  @ContentChild('sidebar') public contentSidebar?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;
  @ContentChild('main') public contentMain?: TemplateRef<any>;

  public get effectiveHeader(): TemplateRef<any> | undefined {
    return this.headerTemplate || this.contentHeader;
  }

  public get effectiveSidebar(): TemplateRef<any> | undefined {
    return this.sidebarTemplate || this.contentSidebar;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea || this.contentMain;
  }
}
