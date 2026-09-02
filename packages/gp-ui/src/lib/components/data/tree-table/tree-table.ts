import { GpBase } from '../../../base/gp-base';
import { Component, input, contentChildren, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIcon } from '../../../icons/icon';
import { GpColumn } from '../column/column';
import { GpTreeNode } from '../../tree/tree-node/tree-node.interface';

@Component({
  selector: 'gp-tree-table',
  standalone: true,
  imports: [CommonModule, GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './tree-table.html',
  styleUrl: './tree-table.scss'
})
export class GpTreeTable extends GpBase {
  public columns = contentChildren(GpColumn);
  public value = input<GpTreeNode[]>([]);

  public toggleNode(node: GpTreeNode, event: MouseEvent): void {
    event.stopPropagation();
    node.expanded = !node.expanded;
  }
}
