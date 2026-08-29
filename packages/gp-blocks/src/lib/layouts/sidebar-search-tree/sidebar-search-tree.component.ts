import { Component, input, output, signal } from '@angular/core';
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
