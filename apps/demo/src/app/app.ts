import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GpCard, GpDivider, GpSelect, GpTag, GpToolbar } from '@generatedpixel/gp-ui';
import {
  createDatasetField,
  Dataset,
  DatasetField,
  FieldType,
  GpDatasetBuilder,
  GpDatasetFieldSelector,
  GpDatasetPreview,
  GpMetadataTree,
  GpSchemaCatalogue,
  GpTranslationService,
  Grouping,
  JoinType,
  Relationship,
  RelationshipCardinality,
  SupportedLocale,
} from 'gp-analytics';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [
    FormsModule,
    GpCard,
    GpDivider,
    GpMetadataTree,
    GpSchemaCatalogue,
    GpDatasetFieldSelector,
    GpDatasetPreview,
    GpDatasetBuilder,
    GpSelect,
    GpTag,
    GpToolbar,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly i18n = inject(GpTranslationService);

  protected readonly activeTab = signal<'workbench' | 'standalone' | 'legacy'>('workbench');

  protected readonly localeOptions = computed(() => [
    { value: 'en', label: this.i18n.translate('english') },
    { value: 'fr', label: this.i18n.translate('french') },
  ]);

  protected setLocale(locale: string): void {
    if (locale === 'en' || locale === 'fr') {
      this.i18n.setLocale(locale as SupportedLocale);
    }
  }

  // Multi-table, multi-group enterprise schema with relationships
  protected readonly groupings: Grouping[] = [
    {
      groupingId: 'group-commerce',
      groupingName: 'Commerce & Sales',
      relationships: [
        {
          relationshipId: 'rel-customers-orders',
          name: 'Customer Orders',
          sourceTableId: 'table-customers',
          sourceFieldId: 'customer-id',
          targetTableId: 'table-orders',
          targetFieldId: 'order-customer-id',
          cardinality: RelationshipCardinality.OneToMany,
          joinType: JoinType.Inner,
        },
        {
          relationshipId: 'rel-orders-items',
          name: 'Order Line Items',
          sourceTableId: 'table-orders',
          sourceFieldId: 'order-id',
          targetTableId: 'table-order-items',
          targetFieldId: 'item-order-id',
          cardinality: RelationshipCardinality.OneToMany,
          joinType: JoinType.Left,
        },
      ],
      tables: [
        {
          tableId: 'table-customers',
          tableName: 'Customers',
          groupingId: 'group-commerce',
          fields: [
            {
              fieldGroupingId: 'cust-id-group',
              fieldGroupingName: 'Identity',
              tableId: 'table-customers',
              fields: [
                {
                  fieldId: 'customer-id',
                  tableId: 'table-customers',
                  fieldGroupingId: 'cust-id-group',
                  fieldName: 'customer_id',
                  fieldDisplayName: { value: 'Customer ID', displayValue: { en: 'Customer ID', fr: 'Identifiant client' } },
                  dataType: 'guid',
                  visible: false,
                  isPrimaryKey: true,
                  isIndex: true,
                  isJoinField: true,
                  usableInReports: false,
                  filterable: false,
                  sortable: false,
                  groupable: false,
                },
                {
                  fieldId: 'customer-code',
                  tableId: 'table-customers',
                  fieldGroupingId: 'cust-id-group',
                  fieldName: 'customer_code',
                  fieldDisplayName: { value: 'Customer code', displayValue: { en: 'Customer code', fr: 'Code client' } },
                  dataType: 'string',
                  visible: true,
                  isPrimaryKey: false,
                  isIndex: true,
                  isJoinField: false,
                  usableInReports: true,
                  filterable: true,
                  sortable: true,
                  groupable: true,
                },
                {
                  fieldId: 'customer-name',
                  tableId: 'table-customers',
                  fieldGroupingId: 'cust-id-group',
                  fieldName: 'name',
                  fieldDisplayName: { value: 'Customer name', displayValue: { en: 'Customer name', fr: 'Nom du client' } },
                  dataType: 'string',
                  visible: true,
                  isPrimaryKey: false,
                  isIndex: false,
                  isJoinField: false,
                  usableInReports: true,
                  filterable: true,
                  sortable: true,
                  groupable: true,
                },
                {
                  fieldId: 'customer-city',
                  tableId: 'table-customers',
                  fieldGroupingId: 'cust-id-group',
                  fieldName: 'city',
                  fieldDisplayName: { value: 'City', displayValue: { en: 'City', fr: 'Ville' } },
                  dataType: 'string',
                  visible: true,
                  isPrimaryKey: false,
                  isIndex: false,
                  isJoinField: false,
                  usableInReports: true,
                  filterable: true,
                  sortable: true,
                  groupable: true,
                },
              ],
            },
          ],
        },
        {
          tableId: 'table-orders',
          tableName: 'Orders',
          groupingId: 'group-commerce',
          fields: [
            {
              fieldGroupingId: 'order-main-group',
              fieldGroupingName: 'Order Details',
              tableId: 'table-orders',
              fields: [
                {
                  fieldId: 'order-id',
                  tableId: 'table-orders',
                  fieldGroupingId: 'order-main-group',
                  fieldName: 'order_id',
                  fieldDisplayName: { value: 'Order ID', displayValue: { en: 'Order ID', fr: 'N° commande' } },
                  dataType: 'guid',
                  visible: true,
                  isPrimaryKey: true,
                  isIndex: true,
                  isJoinField: true,
                  usableInReports: true,
                  filterable: true,
                  sortable: true,
                  groupable: false,
                },
                {
                  fieldId: 'order-customer-id',
                  tableId: 'table-orders',
                  fieldGroupingId: 'order-main-group',
                  fieldName: 'customer_id',
                  fieldDisplayName: { value: 'Customer FK', displayValue: { en: 'Customer FK', fr: 'FK Client' } },
                  dataType: 'guid',
                  visible: true,
                  isPrimaryKey: false,
                  isIndex: true,
                  isJoinField: true,
                  usableInReports: false,
                  filterable: true,
                  sortable: false,
                  groupable: false,
                },
                {
                  fieldId: 'order-date',
                  tableId: 'table-orders',
                  fieldGroupingId: 'order-main-group',
                  fieldName: 'order_date',
                  fieldDisplayName: { value: 'Order date', displayValue: { en: 'Order date', fr: 'Date de commande' } },
                  dataType: 'date',
                  visible: true,
                  isPrimaryKey: false,
                  isIndex: true,
                  isJoinField: false,
                  usableInReports: true,
                  filterable: true,
                  sortable: true,
                  groupable: true,
                },
                {
                  fieldId: 'order-status',
                  tableId: 'table-orders',
                  fieldGroupingId: 'order-main-group',
                  fieldName: 'status',
                  fieldDisplayName: { value: 'Status', displayValue: { en: 'Status', fr: 'Statut' } },
                  dataType: 'string',
                  visible: true,
                  isPrimaryKey: false,
                  isIndex: false,
                  isJoinField: false,
                  usableInReports: true,
                  filterable: true,
                  sortable: true,
                  groupable: true,
                },
                {
                  fieldId: 'order-total',
                  tableId: 'table-orders',
                  fieldGroupingId: 'order-main-group',
                  fieldName: 'total',
                  fieldDisplayName: { value: 'Order total', displayValue: { en: 'Order total', fr: 'Total de la commande' } },
                  dataType: 'currency',
                  visible: true,
                  isPrimaryKey: false,
                  isIndex: false,
                  isJoinField: false,
                  usableInReports: true,
                  filterable: true,
                  sortable: true,
                  groupable: false,
                  aggregationType: 'sum',
                },
              ],
            },
          ],
        },
        {
          tableId: 'table-order-items',
          tableName: 'Order Items',
          groupingId: 'group-commerce',
          fields: [
            {
              fieldGroupingId: 'item-details-group',
              fieldGroupingName: 'Item Lines',
              tableId: 'table-order-items',
              fields: [
                {
                  fieldId: 'item-id',
                  tableId: 'table-order-items',
                  fieldGroupingId: 'item-details-group',
                  fieldName: 'item_id',
                  fieldDisplayName: { value: 'Item ID', displayValue: { en: 'Item ID', fr: 'ID Article' } },
                  dataType: 'guid',
                  visible: true,
                  isPrimaryKey: true,
                  isIndex: true,
                  isJoinField: false,
                  usableInReports: true,
                  filterable: true,
                  sortable: true,
                  groupable: false,
                },
                {
                  fieldId: 'item-order-id',
                  tableId: 'table-order-items',
                  fieldGroupingId: 'item-details-group',
                  fieldName: 'order_id',
                  fieldDisplayName: { value: 'Order FK', displayValue: { en: 'Order FK', fr: 'FK Commande' } },
                  dataType: 'guid',
                  visible: true,
                  isPrimaryKey: false,
                  isIndex: true,
                  isJoinField: true,
                  usableInReports: false,
                  filterable: true,
                  sortable: false,
                  groupable: false,
                },
                {
                  fieldId: 'item-product-name',
                  tableId: 'table-order-items',
                  fieldGroupingId: 'item-details-group',
                  fieldName: 'product_name',
                  fieldDisplayName: { value: 'Product name', displayValue: { en: 'Product name', fr: 'Nom du produit' } },
                  dataType: 'string',
                  visible: true,
                  isPrimaryKey: false,
                  isIndex: false,
                  isJoinField: false,
                  usableInReports: true,
                  filterable: true,
                  sortable: true,
                  groupable: true,
                },
                {
                  fieldId: 'item-quantity',
                  tableId: 'table-order-items',
                  fieldGroupingId: 'item-details-group',
                  fieldName: 'quantity',
                  fieldDisplayName: { value: 'Quantity', displayValue: { en: 'Quantity', fr: 'Quantité' } },
                  dataType: 'number',
                  visible: true,
                  isPrimaryKey: false,
                  isIndex: false,
                  isJoinField: false,
                  usableInReports: true,
                  filterable: true,
                  sortable: true,
                  groupable: false,
                  aggregationType: 'sum',
                },
                {
                  fieldId: 'item-unit-price',
                  tableId: 'table-order-items',
                  fieldGroupingId: 'item-details-group',
                  fieldName: 'unit_price',
                  fieldDisplayName: { value: 'Unit price', displayValue: { en: 'Unit price', fr: 'Prix unitaire' } },
                  dataType: 'currency',
                  visible: true,
                  isPrimaryKey: false,
                  isIndex: false,
                  isJoinField: false,
                  usableInReports: true,
                  filterable: true,
                  sortable: true,
                  groupable: false,
                  aggregationType: 'average',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      groupingId: 'group-hr',
      groupingName: 'Human Resources',
      relationships: [],
      tables: [
        {
          tableId: 'table-employees',
          tableName: 'Employees',
          groupingId: 'group-hr',
          fields: [
            {
              fieldGroupingId: 'emp-profile',
              fieldGroupingName: 'Staff Profiles',
              tableId: 'table-employees',
              fields: [
                {
                  fieldId: 'emp-id',
                  tableId: 'table-employees',
                  fieldGroupingId: 'emp-profile',
                  fieldName: 'employee_id',
                  fieldDisplayName: { value: 'Employee ID', displayValue: { en: 'Employee ID', fr: 'ID Employé' } },
                  dataType: 'guid',
                  visible: true,
                  isPrimaryKey: true,
                  isIndex: true,
                  isJoinField: false,
                  usableInReports: true,
                  filterable: true,
                  sortable: true,
                  groupable: false,
                },
                {
                  fieldId: 'emp-name',
                  tableId: 'table-employees',
                  fieldGroupingId: 'emp-profile',
                  fieldName: 'employee_name',
                  fieldDisplayName: { value: 'Employee name', displayValue: { en: 'Employee name', fr: 'Nom employé' } },
                  dataType: 'string',
                  visible: true,
                  isPrimaryKey: false,
                  isIndex: false,
                  isJoinField: false,
                  usableInReports: true,
                  filterable: true,
                  sortable: true,
                  groupable: true,
                },
                {
                  fieldId: 'emp-department',
                  tableId: 'table-employees',
                  fieldGroupingId: 'emp-profile',
                  fieldName: 'department',
                  fieldDisplayName: { value: 'Department', displayValue: { en: 'Department', fr: 'Département' } },
                  dataType: 'string',
                  visible: true,
                  isPrimaryKey: false,
                  isIndex: false,
                  isJoinField: false,
                  usableInReports: true,
                  filterable: true,
                  sortable: true,
                  groupable: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  // Additional cross-group relationship (demonstrates modularity)
  protected readonly additionalRelationships: Relationship[] = [];

  // Active dataset state
  protected readonly activeDataset = signal<Dataset>({
    datasetId: 'dataset-sales-overview',
    name: 'Sales & Revenue Overview',
    description: 'Executive quarterly sales dataset across customer segments and order totals.',
    fields: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  protected readonly sampleValue = {
    value: 'customer-001',
    displayValue: { en: 'Northwind Trading', fr: 'Northwind Commerce' },
  };

  /**
   * Loads a rich pre-configured sample dataset.
   */
  protected loadSampleDataset(): void {
    const custTable = this.groupings[0].tables[0];
    const ordersTable = this.groupings[0].tables[1];
    const itemsTable = this.groupings[0].tables[2];

    const custName = custTable.fields[0].fields[2]; // Customer name
    const orderDate = ordersTable.fields[0].fields[2]; // Order date
    const orderTotal = ordersTable.fields[0].fields[4]; // Order total
    const itemProduct = itemsTable.fields[0].fields[2]; // Product name
    const itemQuantity = itemsTable.fields[0].fields[3]; // Quantity

    const dfCust = createDatasetField(custName);
    dfCust.isGrouped = true;
    const dfDate = createDatasetField(orderDate);
    dfDate.isGrouped = true;
    const dfTotal = createDatasetField(orderTotal);
    dfTotal.aggregationType = 'sum';

    const dfProduct = createDatasetField(itemProduct);
    const dfQty = createDatasetField(itemQuantity);
    dfQty.aggregationType = 'sum';

    this.activeDataset.set({
      ...this.activeDataset(),
      fields: [dfCust, dfDate, dfTotal, dfProduct, dfQty],
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Resets the dataset to empty.
   */
  protected resetDataset(): void {
    this.activeDataset.set({
      ...this.activeDataset(),
      fields: [],
      updatedAt: new Date().toISOString(),
    });
  }

  protected addStandaloneField(field: any): void {
    if (!field?.visible) {
      return;
    }
    const df = createDatasetField(field);
    this.activeDataset.set({
      ...this.activeDataset(),
      fields: [...this.activeDataset().fields, df],
      updatedAt: new Date().toISOString(),
    });
  }

  protected updateStandaloneFields(fields: DatasetField[]): void {
    this.activeDataset.set({
      ...this.activeDataset(),
      fields,
      updatedAt: new Date().toISOString(),
    });
  }
}
