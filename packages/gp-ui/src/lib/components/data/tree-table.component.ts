import { Component, Input, ContentChildren, QueryList, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';
import { GpColumnComponent } from './column.component';
import { GpTreeNode } from '../tree/tree-node.interface';

@Component({
  selector: 'gp-tree-table',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="gp-treetable gp-datatable">
      <div class="gp-datatable-wrapper">
        <table class="gp-datatable-table" role="table">
          <thead class="gp-datatable-thead">
            <tr role="row">
              @for (col of columns; track col.field || $index) {
                <th class="gp-datatable-th" [style.width]="col.width || null" scope="col">
                  {{ col.header }}
                </th>
              }
            </tr>
          </thead>
          <tbody class="gp-datatable-tbody">
            @for (node of value; track node.key || $index) {
              <ng-container *ngTemplateOutlet="treeRowTpl; context: { $implicit: node, level: 0 }" />
            }
          </tbody>
        </table>
      </div>
    </div>

    <ng-template #treeRowTpl let-node let-level="level">
      <tr class="gp-datatable-row">
        @for (col of columns; track col.field || $index; let colIndex = $index) {
          <td class="gp-datatable-td">
            @if (colIndex === 0) {
              <div class="gp-treetable-toggler-container" [style.padding-left.rem]="level * 1.5">
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
                @if (node.icon) {
                  <gp-icon [name]="node.icon" size="0.9em" class="gp-treetable-icon" />
                }
                <span>{{ node.data ? node.data[col.field] : node.label }}</span>
              </div>
            } @else {
              @if (col.bodyTemplate) {
                <ng-container *ngTemplateOutlet="col.bodyTemplate; context: { $implicit: node, column: col }" />
              } @else {
                {{ node.data ? node.data[col.field] : '' }}
              }
            }
          </td>
        }
      </tr>

      @if (node.expanded && node.children && node.children.length > 0) {
        @for (child of node.children; track child.key || $index) {
          <ng-container *ngTemplateOutlet="treeRowTpl; context: { $implicit: child, level: level + 1 }" />
        }
      }
    </ng-template>
  `,
  styles: [`
    .gp-treetable-toggler-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .gp-treetable-icon {
      color: var(--gp-primary);
    }
  `]
})
export class GpTreeTableComponent {
  @ContentChildren(GpColumnComponent) columns!: QueryList<GpColumnComponent>;
  @Input() value: GpTreeNode[] = [];

  public toggleNode(node: GpTreeNode, event: MouseEvent): void {
    event.stopPropagation();
    node.expanded = !node.expanded;
  }
}
