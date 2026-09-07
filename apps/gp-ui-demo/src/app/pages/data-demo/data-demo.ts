import { Component, inject } from '@angular/core';

import { GpTable, GpColumn, GpButton, GpTag, GpDataView, GpExportService } from 'gp-ui';
import { DocCode } from '../../shared/doc-code';
import { DocApiTable, DocApiProperty } from '../../shared/doc-api-table';
import { getComponentDoc } from '../component-docs/component-docs.data';

@Component({
  selector: 'app-data-demo',
  standalone: true,
  imports: [GpTable, GpColumn, GpButton, GpTag, GpDataView, DocCode, DocApiTable],
  templateUrl: './data-demo.html',
  styleUrl: './data-demo.scss'
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

  tableProperties: DocApiProperty[] = getComponentDoc('table')?.properties ?? [];
  columnProperties: DocApiProperty[] = getComponentDoc('column')?.properties ?? [];
  dataViewProperties: DocApiProperty[] = getComponentDoc('data-view')?.properties ?? [];
  paginatorProperties: DocApiProperty[] = getComponentDoc('paginator')?.properties ?? [];
  treeTableProperties: DocApiProperty[] = getComponentDoc('tree-table')?.properties ?? [];
  virtualScrollerProperties: DocApiProperty[] = getComponentDoc('virtual-scroller')?.properties ?? [];
}
