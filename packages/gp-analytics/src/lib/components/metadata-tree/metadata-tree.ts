import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { GpAccordion, GpAccordionTab, GpButton } from '@generatedpixel/gp-ui';
import { Field, Grouping, Table } from '../../models';
import { GpTranslationService } from '../../services/translation.service';

@Component({
  selector: 'gp-metadata-tree',
  standalone: true,
  imports: [GpAccordion, GpAccordionTab, GpButton],
  templateUrl: './metadata-tree.html',
  styleUrl: './metadata-tree.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GpMetadataTree {
  protected readonly i18n = inject(GpTranslationService);
  readonly groupings = input.required<Grouping[]>();

  protected readonly expandedGroupingIds = signal<Set<string>>(new Set());
  protected readonly expandedTableIds = signal<Set<string>>(new Set());

  protected toggleGrouping(groupingId: string): void {
    this.toggle(this.expandedGroupingIds, groupingId);
  }

  protected setGroupingExpanded(groupingId: string, expanded: boolean): void {
    this.expandedGroupingIds.update((current) => {
      const next = new Set(current);
      expanded ? next.add(groupingId) : next.delete(groupingId);
      return next;
    });
  }

  protected toggleTable(tableId: string): void {
    this.toggle(this.expandedTableIds, tableId);
  }

  protected isGroupingExpanded(groupingId: string): boolean {
    return this.expandedGroupingIds().has(groupingId);
  }

  protected isTableExpanded(tableId: string): boolean {
    return this.expandedTableIds().has(tableId);
  }

  protected visibleFields(table: Table): Field[] {
    return table.fields.flatMap((fieldGrouping) => fieldGrouping.fields).filter((field) => field.visible);
  }

  protected displayName(field: Field): string {
    return field.fieldDisplayName.displayValue[this.i18n.locale()] ?? String(field.fieldDisplayName.value);
  }

  private toggle(target: typeof this.expandedGroupingIds, id: string): void;
  private toggle(target: typeof this.expandedTableIds, id: string): void;
  private toggle(target: typeof this.expandedGroupingIds | typeof this.expandedTableIds, id: string): void {
    target.update((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }
}
