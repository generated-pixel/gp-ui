import { GpBase } from '../../../base/gp-base';
import {
  Component,
  input,
  model,
  output,
  contentChild,
  TemplateRef,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIcon } from '../../../icons/icon';
import { GpTreeNode } from '../tree-node/tree-node.interface';

@Component({
  selector: 'gp-org-chart',
  standalone: true,
  imports: [CommonModule, GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './org-chart.html',
  styleUrl: './org-chart.scss'
})
export class GpOrgChart extends GpBase {
  public value = input<GpTreeNode | null>(null);
  public selection = model<any>(null);
  public selectionMode = input<'single' | 'multiple' | undefined>(undefined);
  public collapsible = input<boolean>(true);

  public onNodeSelect = output<{ originalEvent: Event; node: GpTreeNode }>();
  public onNodeUnselect = output<{ originalEvent: Event; node: GpTreeNode }>();
  public onNodeCollapse = output<{ originalEvent: Event; node: GpTreeNode }>();
  public onNodeExpand = output<{ originalEvent: Event; node: GpTreeNode }>();

  public nodeTemplateRef = contentChild<TemplateRef<any>>('node');

  protected collapsedNodes = signal<Set<GpTreeNode>>(new Set());

  public isExpanded(node: GpTreeNode): boolean {
    if (this.collapsedNodes().has(node)) {
      return false;
    }
    return node.expanded !== false;
  }

  public isSelected(node: GpTreeNode): boolean {
    const sel = this.selection();
    if (!sel) {
      return false;
    }
    if (Array.isArray(sel)) {
      return sel.includes(node);
    }
    return sel === node;
  }

  public onNodeClick(node: GpTreeNode, event: MouseEvent): void {
    if (node.selectable === false || !this.selectionMode()) {
      return;
    }

    const currentSel = this.selection();
    const mode = this.selectionMode();

    if (mode === 'single') {
      if (currentSel === node) {
        this.selection.set(null);
        this.onNodeUnselect.emit({ originalEvent: event, node });
      } else {
        this.selection.set(node);
        this.onNodeSelect.emit({ originalEvent: event, node });
      }
    } else if (mode === 'multiple') {
      const arr = Array.isArray(currentSel) ? [...currentSel] : currentSel ? [currentSel] : [];
      const idx = arr.indexOf(node);
      if (idx !== -1) {
        arr.splice(idx, 1);
        this.selection.set(arr);
        this.onNodeUnselect.emit({ originalEvent: event, node });
      } else {
        arr.push(node);
        this.selection.set(arr);
        this.onNodeSelect.emit({ originalEvent: event, node });
      }
    }
  }

  public toggleNode(node: GpTreeNode, event: MouseEvent): void {
    event.stopPropagation();
    if (!this.collapsible()) {
      return;
    }

    const currentlyExpanded = this.isExpanded(node);
    this.collapsedNodes.update((set) => {
      const next = new Set(set);
      if (currentlyExpanded) {
        next.add(node);
      } else {
        next.delete(node);
      }
      return next;
    });

    node.expanded = !currentlyExpanded;

    if (currentlyExpanded) {
      this.onNodeCollapse.emit({ originalEvent: event, node });
    } else {
      this.onNodeExpand.emit({ originalEvent: event, node });
    }
  }
}
