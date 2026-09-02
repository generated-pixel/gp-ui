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
import { GpBadgeComponent, GpButtonComponent, GpIconComponent, GpInputTextComponent } from '@generatedpixel/gp-ui';

export interface GpDataGridRowItem {
  id: string | number;
  customer: string;
  date: string;
  amount: string;
  payment: string;
  fulfillment: string;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-list-data-grid',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent, GpButtonComponent, GpIconComponent, GpInputTextComponent],
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

  public toolbarTemplate = input<TemplateRef<any> | undefined>(undefined);
  public rowTemplate = input<TemplateRef<{ $implicit: GpDataGridRowItem }> | undefined>(undefined);
  public footerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentToolbar = contentChild<TemplateRef<any>>('toolbar');
  public contentRowTemplate = contentChild<TemplateRef<{ $implicit: GpDataGridRowItem }>>('rowTemplate');
  public contentFooter = contentChild<TemplateRef<any>>('footer');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveToolbar = computed(() => this.toolbarTemplate() || this.contentToolbar());

  public effectiveRowTemplate = computed(() => this.rowTemplate() || this.contentRowTemplate());

  public effectiveFooter = computed(() => this.footerTemplate() || this.contentFooter());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());

  public onSearchInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.searchQuery.set(val);
    this.searchChange.emit(val);
  }
}
