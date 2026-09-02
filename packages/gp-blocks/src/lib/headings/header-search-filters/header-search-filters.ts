import {
  Component,
  input,
  output,
  signal,
  TemplateRef,
  contentChild,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButton, GpIcon, GpInputText, GpSelect } from '@generatedpixel/gp-ui';

export interface GpFilterSelectOption {
  label: string;
  value: string;
}

export interface GpFilterGroupItem {
  id: string;
  selectedValue?: string;
  options: GpFilterSelectOption[];
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-header-search-filters',
  standalone: true,
  imports: [CommonModule, GpButton, GpIcon, GpInputText, GpSelect],
  templateUrl: './header-search-filters.html',
  styleUrl: './header-search-filters.scss'
})
export class GpHeaderSearchFilters {
  public title = input<string>('');
  public subtitle = input<string>('');
  public createBtnLabel = input<string>('Create Resource');
  public searchPlaceholder = input<string>('Search records...');
  public filterGroups = input<GpFilterGroupItem[]>([]);

  public searchQuery = signal<string>('');

  public searchChange = output<string>();
  public createClick = output<void>();
  public moreFiltersClick = output<void>();
  public filterChange = output<{ groupId: string; value: string }>();

  public titleTemplate = input<TemplateRef<any> | undefined>(undefined);
  public searchTemplate = input<TemplateRef<any> | undefined>(undefined);
  public filtersTemplate = input<TemplateRef<any> | undefined>(undefined);
  public actionsTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentTitle = contentChild<TemplateRef<any>>('title');
  public contentSearch = contentChild<TemplateRef<any>>('search');
  public contentFilters = contentChild<TemplateRef<any>>('filters');
  public contentActions = contentChild<TemplateRef<any>>('actions');

  public effectiveTitle = computed(() => this.titleTemplate() || this.contentTitle());

  public effectiveSearch = computed(() => this.searchTemplate() || this.contentSearch());

  public effectiveFilters = computed(() => this.filtersTemplate() || this.contentFilters());

  public effectiveActions = computed(() => this.actionsTemplate() || this.contentActions());

  public onSearchInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.searchQuery.set(val);
    this.searchChange.emit(val);
  }

  public onSelectChange(groupId: string, e: Event): void {
    const val = (e.target as HTMLSelectElement).value;
    this.filterChange.emit({ groupId, value: val });
  }
}
