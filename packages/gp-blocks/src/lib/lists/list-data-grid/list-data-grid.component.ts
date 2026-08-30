import { Component, input, output, signal, Input, TemplateRef, ContentChild } from '@angular/core';
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

  @Input() public toolbarTemplate?: TemplateRef<any>;
  @Input() public rowTemplate?: TemplateRef<{ $implicit: GpDataGridRowItem }>;
  @Input() public footerTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('toolbar') public contentToolbar?: TemplateRef<any>;
  @ContentChild('rowTemplate') public contentRowTemplate?: TemplateRef<{ $implicit: GpDataGridRowItem }>;
  @ContentChild('footer') public contentFooter?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveToolbar(): TemplateRef<any> | undefined {
    return this.toolbarTemplate || this.contentToolbar;
  }

  public get effectiveRowTemplate(): TemplateRef<{ $implicit: GpDataGridRowItem }> | undefined {
    return this.rowTemplate || this.contentRowTemplate;
  }

  public get effectiveFooter(): TemplateRef<any> | undefined {
    return this.footerTemplate || this.contentFooter;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }

  public onSearchInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.searchQuery.set(val);
    this.searchChange.emit(val);
  }
}
