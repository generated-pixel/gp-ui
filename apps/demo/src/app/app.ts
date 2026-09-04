import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GpSelect } from '@generatedpixel/gp-ui';
import { GpMetadataTree, GpTranslationService, Grouping, SupportedLocale } from 'gp-analytics';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [FormsModule, GpMetadataTree, GpSelect],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly i18n = inject(GpTranslationService);
  protected readonly localeOptions = computed(() => [
    { value: 'en', label: this.i18n.translate('english') },
    { value: 'fr', label: this.i18n.translate('french') },
  ]);

  protected setLocale(locale: string): void {
    if (locale === 'en' || locale === 'fr') {
      this.i18n.setLocale(locale as SupportedLocale);
    }
  }
  protected readonly grouping: Grouping = {
    groupingId: 'group-a',
    groupingName: 'Commerce',
    relationships: [],
    tables: [
      {
        tableId: 'table-customers',
        tableName: 'Customers',
        groupingId: 'group-a',
        fields: [
          {
            fieldGroupingId: 'customer-identity',
            fieldGroupingName: 'Identity',
            tableId: 'table-customers',
            fields: [
              {
                fieldId: 'customer-id',
                tableId: 'table-customers',
                fieldGroupingId: 'customer-identity',
                fieldName: 'customer_id',
                fieldDisplayName: { value: 'Customer', displayValue: { en: 'Customer', fr: 'Client' } },
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
                fieldId: 'customer-name',
                tableId: 'table-customers',
                fieldGroupingId: 'customer-identity',
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
            ],
          },
        ],
      },
      {
        tableId: 'table-orders',
        tableName: 'Orders',
        groupingId: 'group-a',
        fields: [
          {
            fieldGroupingId: 'order-details',
            fieldGroupingName: 'Order details',
            tableId: 'table-orders',
            fields: [
              {
                fieldId: 'order-customer-id',
                tableId: 'table-orders',
                fieldGroupingId: 'order-details',
                fieldName: 'customer_id',
                fieldDisplayName: { value: 'Customer', displayValue: { en: 'Customer', fr: 'Client' } },
                dataType: 'guid',
                visible: false,
                isPrimaryKey: false,
                isIndex: true,
                isJoinField: true,
                usableInReports: false,
                filterable: false,
                sortable: false,
                groupable: false,
              },
              {
                fieldId: 'order-total',
                tableId: 'table-orders',
                fieldGroupingId: 'order-details',
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
    ],
  };

  protected readonly sampleValue = {
    value: 'customer-001',
    displayValue: { en: 'Northwind Trading', fr: 'Northwind Commerce' },
  };
}
