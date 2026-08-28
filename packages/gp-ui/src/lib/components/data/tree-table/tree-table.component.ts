import { GpEditableBaseComponent } from '../../../base/gp-editable-base.component';
import { Component, Input, ContentChildren, QueryList, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpColumnComponent } from '../column/column.component';
import { GpTreeNode } from '../../tree/tree-node/tree-node.interface';

@Component({
  selector: 'gp-tree-table',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './tree-table.component.html',
  styleUrl: './tree-table.component.scss'
})
export class GpTreeTableComponent extends GpEditableBaseComponent {
  @ContentChildren(GpColumnComponent) columns!: QueryList<GpColumnComponent>;
  @Input() override value: GpTreeNode[] = [];

  public toggleNode(node: GpTreeNode, event: MouseEvent): void {
    event.stopPropagation();
    node.expanded = !node.expanded;
  }
}
