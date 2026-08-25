import { Component, Input, ContentChild, TemplateRef, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';
import { GpTreeNode } from './tree-node.interface';

@Component({
  selector: 'gp-org-chart',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="gp-orgchart">
      @if (value) {
        <table class="gp-orgchart-table">
          <tbody>
            <ng-container *ngTemplateOutlet="nodeTemplate; context: { $implicit: value, isRoot: true }" />
          </tbody>
        </table>
      }
    </div>

    <ng-template #nodeTemplate let-node let-isRoot="isRoot">
      <tr>
        <td [attr.colspan]="node.children && node.children.length ? node.children.length * 2 : 1">
          <div class="gp-orgchart-node" [class.gp-orgchart-node-selectable]="selectionMode">
            @if (nodeTemplateRef) {
              <ng-container *ngTemplateOutlet="nodeTemplateRef; context: { $implicit: node }" />
            } @else {
              <div class="gp-orgchart-node-content">
                @if (node.icon) {
                  <gp-icon [name]="node.icon" size="1.25em" class="gp-orgchart-icon" />
                }
                <div class="gp-orgchart-node-label">{{ node.label }}</div>
              </div>
            }

            @if (node.children && node.children.length > 0) {
              <button
                type="button"
                class="gp-orgchart-toggler"
                (click)="toggleNode(node, $event)"
                aria-label="Toggle children"
              >
                <gp-icon [name]="node.expanded !== false ? 'chevron-down' : 'chevron-up'" size="0.65em" />
              </button>
            }
          </div>
        </td>
      </tr>

      @if (node.expanded !== false && node.children && node.children.length > 0) {
        <tr class="gp-orgchart-lines">
          <td [attr.colspan]="node.children.length * 2">
            <div class="gp-orgchart-line-down"></div>
          </td>
        </tr>

        <tr class="gp-orgchart-lines">
          @for (child of node.children; track child.key || $index; let idx = $index) {
            <td [class.gp-orgchart-line-left]="idx > 0" [class.gp-orgchart-line-top]="idx > 0 && idx < node.children.length - 1">&nbsp;</td>
            <td [class.gp-orgchart-line-right]="idx < node.children.length - 1">&nbsp;</td>
          }
        </tr>

        <tr class="gp-orgchart-nodes">
          @for (child of node.children; track child.key || $index) {
            <td colspan="2">
              <table class="gp-orgchart-table">
                <tbody>
                  <ng-container *ngTemplateOutlet="nodeTemplate; context: { $implicit: child, isRoot: false }" />
                </tbody>
              </table>
            </td>
          }
        </tr>
      }
    </ng-template>
  `,
  styles: [`
    .gp-orgchart {
      display: flex;
      justify-content: center;
      padding: 1.5rem;
      overflow-x: auto;
    }
    .gp-orgchart-table {
      border-spacing: 0;
      border-collapse: separate;
      margin: 0 auto;
      text-align: center;
    }
    .gp-orgchart-node {
      display: inline-block;
      position: relative;
      padding: 0.75rem 1.25rem;
      border: 1px solid var(--gp-surface-border);
      background: var(--gp-surface-card);
      border-radius: var(--gp-border-radius);
      box-shadow: var(--gp-shadow-sm);
      min-width: 8rem;
    }
    .gp-orgchart-node-label {
      font-weight: 600;
      font-size: var(--gp-font-size-sm);
      color: var(--gp-text-color);
    }
    .gp-orgchart-icon {
      color: var(--gp-primary);
      margin-bottom: 0.25rem;
    }
    .gp-orgchart-toggler {
      position: absolute;
      bottom: -0.65rem;
      left: 50%;
      transform: translateX(-50%);
      background: var(--gp-surface-card);
      border: 1px solid var(--gp-surface-border);
      border-radius: 50%;
      width: 1.25rem;
      height: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--gp-text-color-muted);
    }
    .gp-orgchart-line-down {
      height: 1.25rem;
      width: 1px;
      background: var(--gp-surface-border);
      margin: 0 auto;
    }
    .gp-orgchart-line-top {
      border-top: 1px solid var(--gp-surface-border);
    }
    .gp-orgchart-line-left {
      border-right: 1px solid var(--gp-surface-border);
    }
    .gp-orgchart-line-right {
      border-left: 1px solid var(--gp-surface-border);
    }
  `]
})
export class GpOrgChartComponent {
  @Input() value?: GpTreeNode;
  @Input() selectionMode?: string;

  @ContentChild('node') nodeTemplateRef?: TemplateRef<any>;

  public toggleNode(node: GpTreeNode, event: MouseEvent): void {
    event.stopPropagation();
    node.expanded = node.expanded === false ? true : false;
  }
}
