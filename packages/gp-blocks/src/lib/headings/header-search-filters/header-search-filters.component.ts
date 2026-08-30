import { Component, input, output, signal, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent, GpInputTextComponent, GpSelectComponent } from '@generatedpixel/gp-ui';

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
  selector: 'gp-header-search-filters',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent, GpInputTextComponent, GpSelectComponent],
  templateUrl: './header-search-filters.component.html',
  styleUrl: './header-search-filters.component.scss'
})
export class GpHeaderSearchFiltersComponent {
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

  @Input() public titleTemplate?: TemplateRef<any>;
  @Input() public searchTemplate?: TemplateRef<any>;
  @Input() public filtersTemplate?: TemplateRef<any>;
  @Input() public actionsTemplate?: TemplateRef<any>;

  @ContentChild('title') public contentTitle?: TemplateRef<any>;
  @ContentChild('search') public contentSearch?: TemplateRef<any>;
  @ContentChild('filters') public contentFilters?: TemplateRef<any>;
  @ContentChild('actions') public contentActions?: TemplateRef<any>;

  public get effectiveTitle(): TemplateRef<any> | undefined {
    return this.titleTemplate || this.contentTitle;
  }

  public get effectiveSearch(): TemplateRef<any> | undefined {
    return this.searchTemplate || this.contentSearch;
  }

  public get effectiveFilters(): TemplateRef<any> | undefined {
    return this.filtersTemplate || this.contentFilters;
  }

  public get effectiveActions(): TemplateRef<any> | undefined {
    return this.actionsTemplate || this.contentActions;
  }

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
