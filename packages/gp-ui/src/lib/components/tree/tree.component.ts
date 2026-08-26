import { GpEditableBaseComponent } from '../../base/gp-editable-base.component';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';
import { GpCheckboxComponent } from '../form/checkbox.component';
import { GpInputTextComponent } from '../form/input-text.component';
import { GpTreeNode } from './tree-node.interface';

export type GpTreeSelectionMode = 'single' | 'multiple' | 'checkbox' | null;

@Component({
  selector: 'gp-tree',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpCheckboxComponent, GpInputTextComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.scss'
})
export class GpTreeComponent extends GpEditableBaseComponent {
  @Input() override value: GpTreeNode[] = [];
  @Input() selectionMode: GpTreeSelectionMode = null;
  @Input() selection: any = null;
  @Input() filter = false;
  @Input() filterPlaceholder = 'Search nodes...';
  @Input() emptyMessage = 'No nodes found';

  @Output() selectionChange = new EventEmitter<any>();
  @Output() onNodeSelect = new EventEmitter<{ node: GpTreeNode }>();
  @Output() onNodeUnselect = new EventEmitter<{ node: GpTreeNode }>();
  @Output() onNodeExpand = new EventEmitter<{ node: GpTreeNode }>();
  @Output() onNodeCollapse = new EventEmitter<{ node: GpTreeNode }>();

  protected filterText = signal<string>('');

  protected filteredNodes = computed(() => {
    const q = this.filterText().toLowerCase().trim();
    if (!q) return this.value;
    return this.filterTreeNodes(this.value, q);
  });

  private filterTreeNodes(nodes: GpTreeNode[], q: string): GpTreeNode[] {
    const result: GpTreeNode[] = [];
    nodes.forEach(node => {
      const match = (node.label || '').toLowerCase().includes(q);
      const filteredChildren = node.children ? this.filterTreeNodes(node.children, q) : [];
      if (match || filteredChildren.length > 0) {
        result.push({
          ...node,
          expanded: true,
          children: filteredChildren.length > 0 ? filteredChildren : node.children
        });
      }
    });
    return result;
  }

  public isNodeSelected(node: GpTreeNode): boolean {
    if (!this.selection) return false;
    if (this.selectionMode === 'single') {
      return this.selection === node;
    }
    if ((this.selectionMode === 'multiple' || this.selectionMode === 'checkbox') && Array.isArray(this.selection)) {
      return this.selection.includes(node);
    }
    return false;
  }

  public toggleNode(node: GpTreeNode, event: MouseEvent): void {
    event.stopPropagation();
    node.expanded = !node.expanded;
    if (node.expanded) {
      this.onNodeExpand.emit({ node });
    } else {
      this.onNodeCollapse.emit({ node });
    }
  }

  public onNodeClick(node: GpTreeNode, event: MouseEvent): void {
    if (this.selectionMode === 'single') {
      this.selection = node;
      this.selectionChange.emit(node);
      this.onNodeSelect.emit({ node });
    } else if (this.selectionMode === 'multiple') {
      this.toggleMultipleSelection(node);
    }
  }

  public toggleCheckboxSelection(node: GpTreeNode): void {
    this.toggleMultipleSelection(node);
  }

  private toggleMultipleSelection(node: GpTreeNode): void {
    const current = Array.isArray(this.selection) ? [...this.selection] : [];
    if (current.includes(node)) {
      const next = current.filter(n => n !== node);
      this.selection = next;
      this.selectionChange.emit(next);
      this.onNodeUnselect.emit({ node });
    } else {
      current.push(node);
      this.selection = current;
      this.selectionChange.emit(current);
      this.onNodeSelect.emit({ node });
    }
  }

  protected onFilterInput(event: Event): void {
    this.filterText.set((event.target as HTMLInputElement).value);
  }

  public clearFilter(): void {
    this.filterText.set('');
  }
}
