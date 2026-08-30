import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpDockItem {
  id: string;
  icon: string;
  title: string;
  active?: boolean;
}

@Component({
  selector: 'gp-layout-stacked-bottom-dock',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './stacked-bottom-dock.component.html',
  styleUrl: './stacked-bottom-dock.component.scss'
})
export class GpLayoutStackedBottomDockComponent {
  public brandName = input<string>('');
  public activeTab = input<string>('');
  public activeDockId = input<string>('');

  public dockItems = input<GpDockItem[]>([]);

  public dockItemClick = output<GpDockItem>();

  @Input() public headerTemplate?: TemplateRef<any>;
  @Input() public dockTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('header') public contentHeader?: TemplateRef<any>;
  @ContentChild('dock') public contentDock?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;
  @ContentChild('main') public contentMain?: TemplateRef<any>;

  public get effectiveHeader(): TemplateRef<any> | undefined {
    return this.headerTemplate || this.contentHeader;
  }

  public get effectiveDock(): TemplateRef<any> | undefined {
    return this.dockTemplate || this.contentDock;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea || this.contentMain;
  }
}
