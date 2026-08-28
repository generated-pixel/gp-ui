import { GpBaseComponent } from '../../../base/gp-base.component';
import {
  Component,
  input,
  contentChild,
  TemplateRef,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
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
export class GpOrgChartComponent extends GpBaseComponent {
  public value = input<GpTreeNode | null>(null);
  public selectionMode = input<string | undefined>(undefined);

  public nodeTemplateRef = contentChild<TemplateRef<any>>('node');

  public toggleNode(node: GpTreeNode, event: MouseEvent): void {
    event.stopPropagation();
    node.expanded = node.expanded === false ? true : false;
  }
}
