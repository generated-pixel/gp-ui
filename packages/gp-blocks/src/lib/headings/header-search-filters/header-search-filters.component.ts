import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

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
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
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
