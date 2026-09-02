import {
  Component,
  input,
  output,
  model,
  TemplateRef,
  contentChild,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadge, GpButton, GpIcon } from '@generatedpixel/gp-ui';
import { GpGrid, GpGridItem } from '@generatedpixel/gp-grid';

export interface GpEcomKpi {
  id?: string;
  label: string;
  value: string;
  meta: string;
  trend?: 'pos' | 'neg' | 'neu';
}

export interface GpEcomProduct {
  id?: string;
  name: string;
  category: string;
  revenue: string;
  sales: number;
}

export interface GpEcomOrder {
  id: string;
  customer: string;
  amount: string;
  status: string;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-dashboard-ecommerce',
  standalone: true,
  imports: [CommonModule, GpBadge, GpButton, GpGrid],
  templateUrl: './dashboard-ecommerce.html',
  styleUrl: './dashboard-ecommerce.scss'
})
export class GpDashboardEcommerce {
  public kpis = input<GpEcomKpi[]>([]);
  public topProducts = input<GpEcomProduct[]>([]);
  public recentOrders = input<GpEcomOrder[]>([]);
  public productsTitle = input<string>('Top Selling Products');
  public ordersTitle = input<string>('Recent Store Orders');
  public ordersBadge = input<string>('');

  // Grid Integration
  public gridColumns = input<number>(12);
  public gridRowHeight = input<number>(85);
  public gridGap = input<number>(16);
  public gridCompactType = input<'vertical' | 'none'>('vertical');
  public gridReadonly = input<boolean>(false);

  public widgets = model<GpGridItem[]>([
    {
      id: 'kpis',
      x: 0,
      y: 0,
      w: 12,
      h: 2,
      minW: 4,
      minH: 2,
      title: 'Store Performance Metrics',
      icon: 'star'
    },
    {
      id: 'top-products',
      x: 0,
      y: 2,
      w: 6,
      h: 5,
      minW: 4,
      minH: 3,
      title: 'Top Selling Products',
      icon: 'box'
    },
    {
      id: 'recent-orders',
      x: 6,
      y: 2,
      w: 6,
      h: 5,
      minW: 4,
      minH: 3,
      title: 'Recent Store Orders',
      icon: 'tag'
    }
  ]);

  public kpiClick = output<GpEcomKpi>();
  public productClick = output<GpEcomProduct>();
  public orderClick = output<GpEcomOrder>();
  public viewAllProductsClick = output<void>();
  public layoutChange = output<GpGridItem[]>();

  public widgetTemplate = input<TemplateRef<{ $implicit: GpGridItem }> | undefined>(undefined);
  public headerActionsTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentWidgetTemplate = contentChild<TemplateRef<{ $implicit: GpGridItem }>>('widgetTemplate');
  public contentKpis = contentChild<TemplateRef<any>>('kpis');
  public contentProducts = contentChild<TemplateRef<any>>('products');
  public contentOrders = contentChild<TemplateRef<any>>('orders');
  public contentHeaderActions = contentChild<TemplateRef<any>>('headerActions');

  public effectiveWidgetTemplate = computed(() => this.widgetTemplate() || this.contentWidgetTemplate());

  public onLayoutChanged(newLayout: GpGridItem[]): void {
    this.widgets.set(newLayout);
    this.layoutChange.emit(newLayout);
  }
}
