import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { GpAccordion, GpAccordionTab, GpTree, GpTreeNode } from '@generatedpixel/gp-ui';
import { GpAnalyticsComponent } from '../base/gp-analytics-component';
import { Field, Grouping, Table } from '../../models';

@Component({
  selector: 'gp-metadata-tree',
  standalone: true,
  imports: [GpAccordion, GpAccordionTab, GpTree],
  templateUrl: './metadata-tree.html',
  styleUrl: './metadata-tree.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GpMetadataTree extends GpAnalyticsComponent {
  readonly groupings = input.required<Grouping[]>();

  protected readonly expandedGroupingIds = signal<Set<string>>(new Set());
  protected readonly expandedTreeNodeKeys = signal<Set<string>>(new Set());
  protected readonly treeNodesByGrouping = computed(() => {
    const locale = this.i18n.locale();
    const expandedKeys = this.expandedTreeNodeKeys();

    return new Map(
      this.groupings().map((grouping) => [
        grouping.groupingId,
        grouping.tables.map((table) => ({
          key: table.tableId,
          expanded: expandedKeys.has(table.tableId),
          label: table.tableName,
          icon: 'table',
          children: this.visibleFields(table).map((field) => ({
            key: field.fieldId,
            label: field.fieldDisplayName.displayValue[locale] ?? String(field.fieldDisplayName.value),
            data: field,
            icon: 'circle-small',
            leaf: true,
          })),
        })),
      ]),
    );
  });

  protected setGroupingExpanded(groupingId: string, expanded: boolean): void {
    this.expandedGroupingIds.update((current) => {
      const next = new Set(current);
      expanded ? next.add(groupingId) : next.delete(groupingId);
      return next;
    });
  }

  protected isGroupingExpanded(groupingId: string): boolean {
    return this.expandedGroupingIds().has(groupingId);
  }

  protected visibleFields(table: Table): Field[] {
    return table.fields.flatMap((fieldGrouping) => fieldGrouping.fields).filter((field) => field.visible);
  }

  protected treeNodes(groupingId: string): GpTreeNode[] {
    return this.treeNodesByGrouping().get(groupingId) ?? [];
  }

  protected onTreeNodeExpand(event: { node: GpTreeNode }): void {
    this.setTreeNodeExpanded(event.node, true);
  }

  protected onTreeNodeCollapse(event: { node: GpTreeNode }): void {
    this.setTreeNodeExpanded(event.node, false);
  }

  private setTreeNodeExpanded(node: GpTreeNode, expanded: boolean): void {
    if (!node.key) {
      return;
    }
    this.expandedTreeNodeKeys.update((current) => {
      const next = new Set(current);
      expanded ? next.add(node.key!) : next.delete(node.key!);
      return next;
    });
  }

  protected displayName(field: Field): string {
    return field.fieldDisplayName.displayValue[this.i18n.locale()] ?? String(field.fieldDisplayName.value);
  }

}
