import { GpEditableBaseComponent } from '../../../base/gp-editable-base.component';
import { Component, Input, ContentChild, TemplateRef, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpTreeNode } from '../tree-node/tree-node.interface';

@Component({
  selector: 'gp-org-chart',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './org-chart.component.html',
  styleUrl: './org-chart.component.scss'
})
export class GpOrgChartComponent extends GpEditableBaseComponent {
  @Input() override value: GpTreeNode | null = null;
  @Input() selectionMode?: string;

  @ContentChild('node') nodeTemplateRef?: TemplateRef<any>;

  public toggleNode(node: GpTreeNode, event: MouseEvent): void {
    event.stopPropagation();
    node.expanded = node.expanded === false ? true : false;
  }
}
