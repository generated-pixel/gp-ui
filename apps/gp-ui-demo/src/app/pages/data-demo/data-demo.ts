import { Component, inject } from '@angular/core';

import {
  GpTable,
  GpColumn,
  GpButton,
  GpTag,
  GpDataView,
  GpExportService
} from 'gp-ui';
import { DocCode } from '../../shared/doc-code';
import { DocApiTable, DocApiProperty } from '../../shared/doc-api-table';

@Component({
  selector: 'app-data-demo',
  standalone: true,
  imports: [
    GpTable,
    GpColumn,
    GpButton,
    GpTag,
    GpDataView,
    DocCode,
    DocApiTable
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Data Table & Collection Components</h1>
        <p class="page-desc">
          High-performance data management components featuring column sorting, paginated browsing, multi-row selection,
          CSV/Excel/JSON export pipelines, and list/grid layout viewports.
        </p>
      </div>

      <!-- Import Section -->
      <div class="doc-section">
        <h2 class="doc-section-title">Import</h2>
        <p class="doc-section-desc">Import data components into your standalone component:</p>
        <doc-code [code]="importCode" language="typescript" />
      </div>

      <!-- Feature-packed Data Table -->
      <div class="doc-section">
        <h2 class="doc-section-title">DataTable with Filtering, Selection, Pagination & Export</h2>
        <p class="doc-section-desc">
          Enterprise table with multi-column sorting, custom cell templating, row selection, and native multi-format
          data export.
        </p>
        <div
          class="table-actions"
          style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-bottom: 0.75rem;"
        >
          <gp-button label="Export CSV" icon="download" severity="secondary" (onClickEvent)="exportCsv()" />
          <gp-button label="Export Excel" icon="file" severity="secondary" (onClickEvent)="exportExcel()" />
          <gp-button label="Export JSON" icon="sparkles" severity="secondary" (onClickEvent)="exportJson()" />
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
                [severity]="row.status === 'Active' ? 'success' : row.status === 'Pending' ? 'warning' : 'danger'"
                [rounded]="true"
              />
            </ng-template>
          </gp-column>
        </gp-table>

        <p class="selection-status">
          Selected <strong>{{ selectedCustomers.length }}</strong> records.
        </p>

        <doc-code [code]="tableCode" language="html" />
      </div>

      <!-- Data View -->
      <div class="doc-section">
        <h2 class="doc-section-title">DataView (Grid & List Switcher)</h2>
        <p class="doc-section-desc">
          Responsive collection display supporting custom templates for list and card grid views.
        </p>
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

        <doc-code [code]="dataViewCode" language="html" />
      </div>

      <!-- API Reference -->
      <div class="doc-section">
        <h2 class="doc-section-title">API Reference</h2>
        <doc-api-table title="GpTable Properties (Inputs)" [properties]="tableProperties" />
        <doc-api-table title="GpColumn Properties (Inputs)" [properties]="columnProperties" />
      </div>
    </div>
  `,
  styles: [
    `
      .table-actions {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 0.75rem;
      }
      .selection-status {
        font-size: var(--gp-font-size-sm);
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
    `
  ]
})
export class DataDemo {
  importCode = "import { GpTable, GpColumn, GpDataView } from '@generatedpixel/gp-ui';";

  tableCode = `<gp-table
  [value]="customers"
  [paginator]="true"
  [rows]="5"
  selectionMode="multiple"
  [(selection)]="selectedCustomers"
>
  <gp-column field="id" header="ID" width="5rem" [sortable]="true" />
  <gp-column field="name" header="Customer Name" [sortable]="true" />
  <gp-column field="country" header="Country" [sortable]="true" />
  <gp-column field="status" header="Status" [sortable]="true">
    <ng-template #body let-row>
      <gp-tag [value]="row.status" severity="success" />
    </ng-template>
  </gp-column>
</gp-table>`;

  dataViewCode = `<gp-data-view [value]="products" layout="grid" [paginator]="true" [rows]="6">
  <ng-template #griditem let-item>
    <div class="card">{{ item.name }} - \${{ item.price }}</div>
  </ng-template>
</gp-data-view>`;

  private exportService = inject(GpExportService);
  selectedCustomers: any[] = [];

  public exportCsv(): void {
    const dataToExport = this.selectedCustomers.length > 0 ? this.selectedCustomers : this.customers;
    this.exportService.exportToCsv(dataToExport, { filename: 'customers-export' });
  }

  public exportExcel(): void {
    const dataToExport = this.selectedCustomers.length > 0 ? this.selectedCustomers : this.customers;
    this.exportService.exportToExcel(dataToExport, { filename: 'customers-report', sheetName: 'Customers' });
  }

  public exportJson(): void {
    const dataToExport = this.selectedCustomers.length > 0 ? this.selectedCustomers : this.customers;
    this.exportService.exportToJson(dataToExport, 'customers-data.json');
  }

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

  tableProperties: DocApiProperty[] = [
    { name: 'value', type: 'any[]', default: '[]', description: 'Array of data records to display.' },
    {
      name: 'paginator',
      type: 'boolean',
      default: 'false',
      description: 'Enables built-in paginator at the bottom of the table.'
    },
    { name: 'rows', type: 'number', default: '10', description: 'Number of rows shown per page.' },
    {
      name: 'rowsPerPageOptions',
      type: 'number[]',
      default: '[5, 10, 20]',
      description: 'Options for rows-per-page dropdown selector.'
    },
    {
      name: 'stripedRows',
      type: 'boolean',
      default: 'false',
      description: 'Applies alternating zebra-stripe background colors to rows.'
    },
    {
      name: 'selectionMode',
      type: "'single' | 'multiple' | null",
      default: 'null',
      description: 'Specifies row selection mode.'
    },
    {
      name: 'selection',
      type: 'any | any[]',
      default: 'null',
      description: 'Currently selected item or array of selected items.'
    }
  ];

  columnProperties: DocApiProperty[] = [
    { name: 'field', type: 'string', default: "''", description: 'Property key name from each data object.' },
    { name: 'header', type: 'string', default: "''", description: 'Header column title.' },
    {
      name: 'sortable',
      type: 'boolean',
      default: 'false',
      description: 'Enables interactive header sort click sorting.'
    },
    { name: 'width', type: 'string', default: "''", description: 'Custom CSS width for the column (e.g. "8rem").' }
  ];
}
