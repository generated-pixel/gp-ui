import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { CdkDrag, CdkDragPlaceholder, CdkDropList } from '@angular/cdk/drag-drop';

import { GpIconName } from '../../../icons/gp-icon-names';
import { Folder } from '../../../interfaces/folder';
import { GP_ANALYTICS_TRANSLATIONS } from '../../../tokens/gp-analytics.token';
import { FieldItem } from '../field-item/field-item';
import { GpIcon } from '../../icon/icon';

@Component({
  selector: 'gp-field-picker',
  imports: [CdkDrag, CdkDragPlaceholder, CdkDropList, FieldItem, GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './field-picker.html',
  styleUrls: ['./field-picker.css'],
})
export class FieldPicker {
  readonly folders = input<Folder[]>([]);

  protected readonly t = inject(GP_ANALYTICS_TRANSLATIONS);
  protected readonly expandedFolders = signal<Set<string>>(new Set());
  protected readonly expandedDatasets = signal<Set<string>>(new Set());

  protected readonly noDrop = () => false;

  protected toggleFolder(id: string): void {
    this.expandedFolders.update((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  protected toggleDataset(id: string): void {
    this.expandedDatasets.update((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  protected isFolderExpanded(id: string): boolean {
    return this.expandedFolders().has(id);
  }

  protected isDatasetExpanded(id: string): boolean {
    return this.expandedDatasets().has(id);
  }

  protected chevronIcon(expanded: boolean): GpIconName {
    return expanded ? 'chevron-down' : 'chevron-right';
  }

  protected folderContentId(id: string): string {
    return `gp-field-picker-folder-content-${id}`;
  }

  protected datasetContentId(id: string): string {
    return `gp-field-picker-dataset-content-${id}`;
  }
}
