import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';
import { GpCheckboxComponent } from '../form/checkbox.component';
import { GpTreeNode } from './tree-node.interface';

export type GpTreeSelectionMode = 'single' | 'multiple' | 'checkbox' | null;

@Component({
  selector: 'gp-tree',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpCheckboxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="gp-tree" role="tree" [attr.aria-multiselectable]="selectionMode === 'multiple' || selectionMode === 'checkbox'">
      @if (filter) {
        <div class="gp-tree-filter-container">
          <input
            type="text"
            class="gp-inputtext gp-tree-filter-input"
            [placeholder]="filterPlaceholder"
            [value]="filterText()"
            (input)="onFilterInput($event)"
            aria-label="Filter tree"
          />
          <gp-icon name="search" size="0.85em" class="gp-tree-filter-icon" />
        </div>
      }

      <ul class="gp-tree-container">
        @for (node of filteredNodes(); track node.key || $index) {
          <ng-container *ngTemplateOutlet="nodeTemplate; context: { $implicit: node, level: 0 }" />
        } @empty {
          <li class="gp-tree-empty-message">{{ emptyMessage }}</li>
        }
      </ul>
    </div>

    <ng-template #nodeTemplate let-node let-level="level">
      <li class="gp-tree-node" role="treeitem" [attr.aria-expanded]="node.expanded" [style.padding-left.rem]="level * 1.25">
        <div
          class="gp-tree-node-content"
          [class.gp-tree-node-selected]="isNodeSelected(node)"
          (click)="onNodeClick(node, $event)"
        >
          @if (node.children && node.children.length > 0) {
            <button
              type="button"
              class="gp-treeselect-toggler"
              (click)="toggleNode(node, $event)"
              aria-label="Toggle node"
            >
              <gp-icon [name]="node.expanded ? 'chevron-down' : 'chevron-right'" size="0.75em" />
            </button>
          } @else {
            <span class="gp-treeselect-toggler-spacer"></span>
          }

          @if (selectionMode === 'checkbox') {
            <gp-checkbox
              [binary]="true"
              [value]="isNodeSelected(node)"
              (onChange)="toggleCheckboxSelection(node)"
            />
          }

          @if (node.icon) {
            <gp-icon [name]="node.icon" class="gp-tree-node-icon" />
          }

          <span class="gp-tree-node-label">{{ node.label }}</span>
        </div>

        @if (node.expanded && node.children && node.children.length > 0) {
          <ul class="gp-tree-sub-tree" role="group">
            @for (child of node.children; track child.key || $index) {
              <ng-container *ngTemplateOutlet="nodeTemplate; context: { $implicit: child, level: level + 1 }" />
            }
          </ul>
        }
      </li>
    </ng-template>
  `,
  styles: [`
    .gp-tree {
      background: var(--gp-surface-card);
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius);
      padding: 0.5rem;
      width: 100%;
    }
    .gp-tree-filter-container {
      position: relative;
      margin-bottom: 0.5rem;
    }
    .gp-tree-filter-input {
      padding-right: 2rem;
      height: 2.25rem;
    }
    .gp-tree-filter-icon {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--gp-text-color-muted);
    }
    .gp-tree-container, .gp-tree-sub-tree {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .gp-tree-node-content {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.5rem;
      border-radius: var(--gp-border-radius);
      cursor: pointer;
      font-size: var(--gp-font-size-sm);
      color: var(--gp-text-color);
      transition: background var(--gp-transition-duration);
    }
    .gp-tree-node-content:hover {
      background: var(--gp-surface-hover);
    }
    .gp-tree-node-selected {
      background: var(--gp-primary-light) !important;
      color: var(--gp-primary) !important;
      font-weight: 600;
    }
    .gp-tree-node-icon {
      color: var(--gp-primary);
    }
    .gp-tree-empty-message {
      padding: 1rem;
      text-align: center;
      color: var(--gp-text-color-muted);
      font-size: var(--gp-font-size-sm);
    }
  `]
})
export class GpTreeComponent {
  @Input() value: GpTreeNode[] = [];
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
}
