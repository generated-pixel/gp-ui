import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpDataGridRowItem {
  id: string | number;
  customer: string;
  date: string;
  amount: string;
  payment: string;
  fulfillment: string;
}

@Component({
  selector: 'gp-list-data-grid',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent, GpButtonComponent, GpIconComponent],
  templateUrl: './list-data-grid.component.html',
  styleUrl: './list-data-grid.component.scss'
})
export class GpListDataGridComponent {
  public searchPlaceholder = input<string>('Filter records...');
  public filterBtnLabel = input<string>('Filter');
  public newOrderBtnLabel = input<string>('New Order');
  public footerCountText = input<string>('Showing 1 to 5 of 48 records');
  public rows = input<GpDataGridRowItem[]>([]);

  public searchQuery = signal<string>('');

  public filterClick = output<void>();
  public newOrderClick = output<void>();
  public rowClick = output<GpDataGridRowItem>();
  public rowActionClick = output<GpDataGridRowItem>();
  public searchChange = output<string>();

  public onSearchInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.searchQuery.set(val);
    this.searchChange.emit(val);
  }
}
