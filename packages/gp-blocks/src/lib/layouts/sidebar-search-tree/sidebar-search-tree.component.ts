import { Component, input, output, signal, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpTreeLeaf {
  id: string;
  label: string;
  active?: boolean;
}

export interface GpTreeNode {
  id: string;
  label: string;
  icon?: string;
  expanded?: boolean;
  children?: GpTreeLeaf[];
}

@Component({
  selector: 'gp-layout-sidebar-search-tree',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './sidebar-search-tree.component.html',
  styleUrl: './sidebar-search-tree.component.scss'
})
export class GpLayoutSidebarSearchTreeComponent {
  public searchPlaceholder = input<string>('Filter tree...');
  public title = input<string>('');
  public catalogLabel = input<string>('');
  public activeLeafId = input<string>('');

  public treeData = input<GpTreeNode[]>([]);

  public searchQuery = signal<string>('');
  public searchChange = output<string>();
  public leafClick = output<GpTreeLeaf>();
  public nodeToggle = output<GpTreeNode>();

  @Input() public sidebarTemplate?: TemplateRef<any>;
  @Input() public treeTemplate?: TemplateRef<any>;
  @Input() public topActionsTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('sidebar') public contentSidebar?: TemplateRef<any>;
  @ContentChild('tree') public contentTree?: TemplateRef<any>;
  @ContentChild('topActions') public contentTopActions?: TemplateRef<any>;
  @ContentChild('actions') public contentActions?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;
  @ContentChild('main') public contentMain?: TemplateRef<any>;

  public get effectiveSidebar(): TemplateRef<any> | undefined {
    return this.sidebarTemplate || this.contentSidebar;
  }

  public get effectiveTree(): TemplateRef<any> | undefined {
    return this.treeTemplate || this.contentTree;
  }

  public get effectiveTopActions(): TemplateRef<any> | undefined {
    return this.topActionsTemplate || this.contentTopActions || this.contentActions;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea || this.contentMain;
  }

  public toggleNode(node: GpTreeNode): void {
    node.expanded = !node.expanded;
    this.nodeToggle.emit(node);
  }

  public onSearch(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.searchQuery.set(val);
    this.searchChange.emit(val);
  }
}
