import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpBadgeComponent, GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

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
  imports: [CommonModule, GpBadgeComponent, GpButtonComponent, GpIconComponent],
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

  public kpiClick = output<GpEcomKpi>();
  public productClick = output<GpEcomProduct>();
  public orderClick = output<GpEcomOrder>();
  public viewAllProductsClick = output<void>();
}
