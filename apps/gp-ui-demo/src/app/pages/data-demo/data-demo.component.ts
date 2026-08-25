import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GpTableComponent,
  GpColumnComponent,
  GpButtonComponent,
  GpTagComponent,
  GpDataViewComponent,
  GpVirtualScrollerComponent
} from 'gp-ui';

@Component({
  selector: 'app-data-demo',
  standalone: true,
  imports: [
    CommonModule,
    GpTableComponent,
    GpColumnComponent,
    GpButtonComponent,
    GpTagComponent,
    GpDataViewComponent
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Enterprise Data Components</h1>
        <p class="page-desc">High-performance data tables with sorting, filtering, selection, pagination, and export hooks.</p>
      </div>

      <!-- Feature-packed Data Table -->
      <div class="doc-section">
        <h2 class="doc-section-title">DataTable with Filtering, Selection, Pagination & Export</h2>
        <div class="table-actions">
          <gp-button label="Export to CSV" icon="download" severity="secondary" (onClickEvent)="dt.exportCSV('customers.csv')" />
        </div>

        <gp-table
          #dt
          [value]="customers"
          [paginator]="true"
          [rows]="5"
          [rowsPerPageOptions]="[5, 10, 20]"
          [stripedRows]="true"
          [globalFilterFields]="['name', 'country', 'company', 'status']"
          selectionMode="multiple"
          [(selection)]="selectedCustomers"
        >
          <gp-column field="id" header="ID" width="5rem" [sortable]="true" />
          <gp-column field="name" header="Customer Name" [sortable]="true" />
          <gp-column field="country" header="Country" [sortable]="true" />
          <gp-column field="company" header="Company" />
          <gp-column field="status" header="Status" [sortable]="true">
            <ng-template #body let-row>
              <gp-tag
                [value]="row.status"
                [severity]="row.status === 'Active' ? 'success' : (row.status === 'Pending' ? 'warning' : 'danger')"
                [rounded]="true"
              />
            </ng-template>
          </gp-column>
        </gp-table>

        <p class="selection-status">
          Selected {{ selectedCustomers.length }} records.
        </p>
      </div>

      <!-- Data View -->
      <div class="doc-section">
        <h2 class="doc-section-title">DataView (Grid & List Switcher)</h2>
        <gp-data-view [value]="products" layout="grid" [paginator]="true" [rows]="4">
          <ng-template #griditem let-item>
            <div class="product-grid-card">
              <div class="product-header">
                <span class="product-category">{{ item.category }}</span>
                <gp-tag [value]="item.inventoryStatus" severity="success" [rounded]="true" />
              </div>
              <div class="product-name">{{ item.name }}</div>
              <div class="product-footer">
                <span class="product-price">\${{ item.price }}</span>
                <gp-button icon="plus" [iconOnly]="true" severity="primary" size="sm" />
              </div>
            </div>
          </ng-template>

          <ng-template #listitem let-item>
            <div class="product-list-card">
              <div class="product-details">
                <div class="product-name">{{ item.name }}</div>
                <span class="product-category">{{ item.category }}</span>
              </div>
              <div class="product-price">\${{ item.price }}</div>
            </div>
          </ng-template>
        </gp-data-view>
      </div>
    </div>
  `,
  styles: [`
    .table-actions {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 0.75rem;
    }
    .selection-status {
      font-size: var(--gp-font-size-xs);
      color: var(--gp-text-color-secondary);
      margin-top: 0.5rem;
    }
    .product-grid-card {
      background: var(--gp-surface-card);
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius);
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .product-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .product-category {
      font-size: var(--gp-font-size-xs);
      color: var(--gp-text-color-muted);
      text-transform: uppercase;
      font-weight: 600;
    }
    .product-name {
      font-weight: 700;
      font-size: var(--gp-font-size-base);
    }
    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.5rem;
    }
    .product-price {
      font-weight: 800;
      font-size: 1.15rem;
      color: var(--gp-primary);
    }
    .product-list-card {
      background: var(--gp-surface-card);
      border: 1px solid var(--gp-surface-border);
      border-radius: var(--gp-border-radius);
      padding: 0.75rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `]
})
export class DataDemoComponent {
  selectedCustomers: any[] = [];

  customers = [
    { id: 101, name: 'Eleanor Vance', country: 'United States', company: 'Acme Corp', status: 'Active' },
    { id: 102, name: 'Oliver Twist', country: 'United Kingdom', company: 'Stark Industries', status: 'Active' },
    { id: 103, name: 'Lucas Scott', country: 'Germany', company: 'Wayne Enterprises', status: 'Pending' },
    { id: 104, name: 'Sophie Bernard', country: 'France', company: 'Cyberdyne', status: 'Inactive' },
    { id: 105, name: 'Kenji Sato', country: 'Japan', company: 'Initech', status: 'Active' },
    { id: 106, name: 'Mateo Silva', country: 'Brazil', company: 'Umbrella Corp', status: 'Pending' },
    { id: 107, name: 'Astrid Lindgren', country: 'Sweden', company: 'Hooli', status: 'Active' },
    { id: 108, name: 'Liam Neeson', country: 'Ireland', company: 'Pied Piper', status: 'Active' }
  ];

  products = [
    { name: 'Bamboo Watch', category: 'Accessories', price: 65, inventoryStatus: 'INSTOCK' },
    { name: 'Black Watch', category: 'Accessories', price: 72, inventoryStatus: 'INSTOCK' },
    { name: 'Blue Band', category: 'Fitness', price: 79, inventoryStatus: 'LOWSTOCK' },
    { name: 'Game Controller', category: 'Electronics', price: 99, inventoryStatus: 'INSTOCK' },
    { name: 'Gaming Set', category: 'Electronics', price: 299, inventoryStatus: 'INSTOCK' },
    { name: 'Gold Phone Case', category: 'Accessories', price: 24, inventoryStatus: 'INSTOCK' }
  ];
}
