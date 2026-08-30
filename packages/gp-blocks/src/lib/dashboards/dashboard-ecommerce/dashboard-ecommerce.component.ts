import { Component, input, output, model, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';
import { GpGridComponent, GpGridItem } from '@generatedpixel/gp-grid';

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
  selector: 'gp-dashboard-ecommerce',
  standalone: true,
  imports: [CommonModule, GpBadgeComponent, GpButtonComponent, GpGridComponent],
  templateUrl: './dashboard-ecommerce.component.html',
  styleUrl: './dashboard-ecommerce.component.scss'
})
export class GpDashboardEcommerceComponent {
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

  @Input() public widgetTemplate?: TemplateRef<{ $implicit: GpGridItem }>;
  @Input() public headerActionsTemplate?: TemplateRef<any>;

  @ContentChild('widgetTemplate') public contentWidgetTemplate?: TemplateRef<{ $implicit: GpGridItem }>;
  @ContentChild('kpis') public contentKpis?: TemplateRef<any>;
  @ContentChild('products') public contentProducts?: TemplateRef<any>;
  @ContentChild('orders') public contentOrders?: TemplateRef<any>;
  @ContentChild('headerActions') public contentHeaderActions?: TemplateRef<any>;

  public get effectiveWidgetTemplate(): TemplateRef<{ $implicit: GpGridItem }> | undefined {
    return this.widgetTemplate || this.contentWidgetTemplate;
  }

  public onLayoutChanged(newLayout: GpGridItem[]): void {
    this.widgets.set(newLayout);
    this.layoutChange.emit(newLayout);
  }
}
