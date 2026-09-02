import { GpBase } from '../../../base/gp-base';
import {
  Component,
  input,
  model,
  output,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
  computed,
  ChangeDetectorRef,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIcon } from '../../../icons/icon';
import { GpCheckbox } from '../../form/checkbox/checkbox';
import { GpInputText } from '../../form/input-text/input-text';
import { GpTreeNode } from '../tree-node/tree-node.interface';

export type GpTreeSelectionMode = 'single' | 'multiple' | 'checkbox' | null;

@Component({
  selector: 'gp-tree',
  standalone: true,
  imports: [CommonModule, GpIcon, GpCheckbox, GpInputText],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './tree.html',
  styleUrl: './tree.scss'
})
export class GpTree extends GpBase {
  private cdr = inject(ChangeDetectorRef);

  public value = input<GpTreeNode[]>([]);
  public selectionMode = input<GpTreeSelectionMode>(null);
  public selection = model<any>(null);
  public filter = input<boolean>(false);
  public filterPlaceholder = input<string>('Search nodes...');
  public emptyMessage = input<string>('No nodes found');

  public onNodeSelect = output<{ node: GpTreeNode }>();
  public onNodeUnselect = output<{ node: GpTreeNode }>();
  public onNodeExpand = output<{ node: GpTreeNode }>();
  public onNodeCollapse = output<{ node: GpTreeNode }>();

  protected filterText = signal<string>('');

  protected filteredNodes = computed(() => {
    const q = this.filterText().toLowerCase().trim();
    const val = this.value();
    if (!q) {
      return val;
    }
    return this.filterTreeNodes(val, q);
  });

  private filterTreeNodes(nodes: GpTreeNode[], q: string): GpTreeNode[] {
    const result: GpTreeNode[] = [];
    nodes.forEach((node) => {
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
    const sel = this.selection();
    if (!sel) {
      return false;
    }
    const mode = this.selectionMode();
    if (mode === 'single') {
      return sel === node;
    }
    if ((mode === 'multiple' || mode === 'checkbox') && Array.isArray(sel)) {
      return sel.includes(node);
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
    this.cdr.markForCheck();
  }

  public onNodeClick(node: GpTreeNode, event: MouseEvent): void {
    const mode = this.selectionMode();
    if (mode === 'single') {
      this.selection.set(node);
      this.onNodeSelect.emit({ node });
      this.cdr.markForCheck();
    } else if (mode === 'multiple') {
      this.toggleMultipleSelection(node);
    }
  }

  public toggleCheckboxSelection(node: GpTreeNode): void {
    this.toggleMultipleSelection(node);
  }

  private toggleMultipleSelection(node: GpTreeNode): void {
    const sel = this.selection();
    const current = Array.isArray(sel) ? [...sel] : [];
    if (current.includes(node)) {
      const next = current.filter((n) => n !== node);
      this.selection.set(next);
      this.onNodeUnselect.emit({ node });
    } else {
      current.push(node);
      this.selection.set(current);
      this.onNodeSelect.emit({ node });
    }
    this.cdr.markForCheck();
  }

  protected onFilterInput(event: Event): void {
    this.filterText.set((event.target as HTMLInputElement).value);
  }

  public clearFilter(): void {
    this.filterText.set('');
  }
}
