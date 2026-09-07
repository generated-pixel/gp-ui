import { Injectable } from '@angular/core';
import { Grouping } from '../models/grouping.model';
import { Table } from '../models/table.model';
import { FieldGrouping } from '../models/field-grouping.model';
import { Field } from '../models/field.model';
import { FieldValue } from '../models/field-value.model';
import { LocalizedValue } from '../models/localized-value.model';
import { Relationship, RelationshipCardinality } from '../models/relationship.model';
import { LoadedSchemaResult, SchemaPreset, SchemaSourceConfig } from '../models/schema-data-source.model';

function locVal(val: string, en: string, fr?: string): FieldValue<string> {
  return {
    value: val,
    displayValue: {
      en,
      ...(fr ? { fr } : {})
    }
  };
}

function loc(en: string, fr?: string): LocalizedValue<string> {
  return {
    value: en,
    displayValue: {
      en,
      ...(fr ? { fr } : {})
    }
  };
}

const RAW_PRESETS: any[] = [
  {
    id: 'commerce',
    name: 'Commerce & Sales',
    description: 'Retail orders, customer accounts, and order items with revenue tracking',
    icon: '🛒',
    groupings: [
      {
        groupingId: 'group-commerce',
        groupingName: 'Commerce & Sales',
        relationships: [
          {
            relationshipId: 'rel-customers-orders',
            name: 'Customer Orders',
            sourceTableId: 'customers',
            sourceFieldId: 'customer_id',
            targetTableId: 'orders',
            targetFieldId: 'customer_id',
            cardinality: RelationshipCardinality.OneToMany
          },
          {
            relationshipId: 'rel-orders-items',
            name: 'Order Line Items',
            sourceTableId: 'orders',
            sourceFieldId: 'order_id',
            targetTableId: 'order_items',
            targetFieldId: 'order_id',
            cardinality: RelationshipCardinality.OneToMany
          }
        ],
        tables: [
          {
            tableId: 'customers',
            tableName: 'Customers',
            groupingId: 'group-commerce',
            fields: [
              {
                fieldGroupingId: 'fg-cust',
                fieldGroupingName: 'Customer Details',
                tableId: 'customers',
                fields: [
                  {
                    fieldId: 'customer_code',
                    fieldName: 'customer_code',
                    fieldDisplayName: loc('Customer code', 'Code client'),
                    dataType: 'string',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: true,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: true
                  },
                  {
                    fieldId: 'name',
                    fieldName: 'name',
                    fieldDisplayName: loc('Customer name', 'Nom du client'),
                    dataType: 'string',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: false,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: true
                  },
                  {
                    fieldId: 'city',
                    fieldName: 'city',
                    fieldDisplayName: loc('City', 'Ville'),
                    dataType: 'string',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: false,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: true
                  }
                ]
              }
            ]
          },
          {
            tableId: 'orders',
            tableName: 'Orders',
            groupingId: 'group-commerce',
            fields: [
              {
                fieldGroupingId: 'fg-orders',
                fieldGroupingName: 'Order Attributes',
                tableId: 'orders',
                fields: [
                  {
                    fieldId: 'order_id',
                    fieldName: 'order_id',
                    fieldDisplayName: loc('Order ID', 'Identifiant de commande'),
                    dataType: 'string',
                    visible: true,
                    isPrimaryKey: true,
                    isIndex: true,
                    isJoinField: true,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: true
                  },
                  {
                    fieldId: 'order_date',
                    fieldName: 'order_date',
                    fieldDisplayName: loc('Order date', 'Date de commande'),
                    dataType: 'date',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: true,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: true
                  },
                  {
                    fieldId: 'status',
                    fieldName: 'status',
                    fieldDisplayName: loc('Status', 'Statut'),
                    dataType: 'string',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: false,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: true,
                    lookupValues: [
                      locVal('completed', 'Completed', 'Terminé'),
                      locVal('processing', 'Processing', 'En traitement'),
                      locVal('delivered', 'Delivered', 'Livré'),
                      locVal('pending', 'Pending', 'En attente'),
                      locVal('cancelled', 'Cancelled', 'Annulé')
                    ]
                  },
                  {
                    fieldId: 'total',
                    fieldName: 'total',
                    fieldDisplayName: loc('Order total', 'Total commande'),
                    dataType: 'currency',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: false,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: false
                  }
                ]
              }
            ]
          },
          {
            tableId: 'order_items',
            tableName: 'Order Items',
            groupingId: 'group-commerce',
            fields: [
              {
                fieldGroupingId: 'fg-items',
                fieldGroupingName: 'Line Items',
                tableId: 'order_items',
                fields: [
                  {
                    fieldId: 'product_name',
                    fieldName: 'product_name',
                    fieldDisplayName: loc('Product name', 'Nom du produit'),
                    dataType: 'string',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: false,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: true
                  },
                  {
                    fieldId: 'quantity',
                    fieldName: 'quantity',
                    fieldDisplayName: loc('Quantity', 'Quantité'),
                    dataType: 'number',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: false,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: false
                  },
                  {
                    fieldId: 'unit_price',
                    fieldName: 'unit_price',
                    fieldDisplayName: loc('Unit price', 'Prix unitaire'),
                    dataType: 'currency',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: false,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: false
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Clinical',
    description: 'Patients, Clinical Encounters, Diagnoses, and Laboratory Results',
    icon: '🏥',
    groupings: [
      {
        groupingId: 'group-clinical',
        groupingName: 'Clinical Records',
        relationships: [
          {
            relationshipId: 'rel-patient-encounters',
            name: 'Patient Visits',
            sourceTableId: 'patients',
            sourceFieldId: 'patient_id',
            targetTableId: 'encounters',
            targetFieldId: 'patient_id',
            cardinality: RelationshipCardinality.OneToMany
          },
          {
            relationshipId: 'rel-encounters-diagnoses',
            name: 'Visit Diagnoses',
            sourceTableId: 'encounters',
            sourceFieldId: 'encounter_id',
            targetTableId: 'diagnoses',
            targetFieldId: 'encounter_id',
            cardinality: RelationshipCardinality.OneToMany
          }
        ],
        tables: [
          {
            tableId: 'patients',
            tableName: 'Patients',
            groupingId: 'group-clinical',
            fields: [
              {
                fieldGroupingId: 'fg-pat-demog',
                fieldGroupingName: 'Demographics',
                tableId: 'patients',
                fields: [
                  {
                    fieldId: 'mrn',
                    fieldName: 'mrn',
                    fieldDisplayName: loc('Medical Record Number (MRN)', 'Numéro de dossier'),
                    dataType: 'string',
                    visible: true,
                    isPrimaryKey: true,
                    isIndex: true,
                    isJoinField: true,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: true
                  },
                  {
                    fieldId: 'full_name',
                    fieldName: 'full_name',
                    fieldDisplayName: loc('Patient Name', 'Nom du patient'),
                    dataType: 'string',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: false,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: true
                  },
                  {
                    fieldId: 'gender',
                    fieldName: 'gender',
                    fieldDisplayName: loc('Gender', 'Genre'),
                    dataType: 'string',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: false,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: true,
                    lookupValues: [
                      locVal('M', 'Male', 'Homme'),
                      locVal('F', 'Female', 'Femme'),
                      locVal('Other', 'Other', 'Autre')
                    ]
                  },
                  {
                    fieldId: 'age',
                    fieldName: 'age',
                    fieldDisplayName: loc('Age', 'Âge'),
                    dataType: 'number',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: false,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: true
                  }
                ]
              }
            ]
          },
          {
            tableId: 'encounters',
            tableName: 'Clinical Encounters',
            groupingId: 'group-clinical',
            fields: [
              {
                fieldGroupingId: 'fg-enc-main',
                fieldGroupingName: 'Visit Information',
                tableId: 'encounters',
                fields: [
                  {
                    fieldId: 'encounter_id',
                    fieldName: 'encounter_id',
                    fieldDisplayName: loc('Encounter ID', 'ID Visite'),
                    dataType: 'string',
                    visible: true,
                    isPrimaryKey: true,
                    isIndex: true,
                    isJoinField: true,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: true
                  },
                  {
                    fieldId: 'encounter_type',
                    fieldName: 'encounter_type',
                    fieldDisplayName: loc('Department / Care Type', 'Type de soin'),
                    dataType: 'string',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: false,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: true,
                    lookupValues: [
                      locVal('cardiology', 'Cardiology', 'Cardiologie'),
                      locVal('neurology', 'Neurology', 'Neurologie'),
                      locVal('oncology', 'Oncology', 'Oncologie'),
                      locVal('pediatrics', 'Pediatrics', 'Pédiatrie'),
                      locVal('emergency', 'Emergency', 'Urgences')
                    ]
                  },
                  {
                    fieldId: 'encounter_date',
                    fieldName: 'encounter_date',
                    fieldDisplayName: { en: 'Admit Date', fr: "Date d'admission" },
                    dataType: 'date',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: true,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: true
                  },
                  {
                    fieldId: 'length_of_stay',
                    fieldName: 'length_of_stay',
                    fieldDisplayName: loc('Length of Stay (Days)', 'Durée de séjour (Jours)'),
                    dataType: 'number',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: false,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: false
                  }
                ]
              }
            ]
          },
          {
            tableId: 'diagnoses',
            tableName: 'Diagnoses & Conditions',
            groupingId: 'group-clinical',
            fields: [
              {
                fieldGroupingId: 'fg-diag-items',
                fieldGroupingName: 'ICD Codes & Conditions',
                tableId: 'diagnoses',
                fields: [
                  {
                    fieldId: 'icd10_code',
                    fieldName: 'icd10_code',
                    fieldDisplayName: loc('ICD-10 Code', 'Code CIM-10'),
                    dataType: 'string',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: true,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: true
                  },
                  {
                    fieldId: 'condition_name',
                    fieldName: 'condition_name',
                    fieldDisplayName: loc('Condition Description', 'Diagnostic'),
                    dataType: 'string',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: false,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: true
                  },
                  {
                    fieldId: 'treatment_cost',
                    fieldName: 'treatment_cost',
                    fieldDisplayName: loc('Treatment Cost', 'Coût du traitement'),
                    dataType: 'currency',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: false,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: false
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'logistics',
    name: 'Supply Chain & Logistics',
    description: 'Distribution warehouses, shipping consignments, fleet carriers, and inventory assets',
    icon: '🚚',
    groupings: [
      {
        groupingId: 'group-supply-chain',
        groupingName: 'Supply Chain Operations',
        relationships: [
          {
            relationshipId: 'rel-warehouse-inventory',
            name: 'Warehouse Inventory',
            sourceTableId: 'warehouses',
            sourceFieldId: 'warehouse_id',
            targetTableId: 'inventory',
            targetFieldId: 'warehouse_id',
            cardinality: RelationshipCardinality.OneToMany
          },
          {
            relationshipId: 'rel-inventory-shipments',
            name: 'Inventory Dispatches',
            sourceTableId: 'inventory',
            sourceFieldId: 'sku',
            targetTableId: 'shipments',
            targetFieldId: 'sku',
            cardinality: RelationshipCardinality.OneToMany
          }
        ],
        tables: [
          {
            tableId: 'warehouses',
            tableName: 'Fulfillment Centers',
            groupingId: 'group-supply-chain',
            fields: [
              {
                fieldGroupingId: 'fg-wh',
                fieldGroupingName: 'Facility Info',
                tableId: 'warehouses',
                fields: [
                  {
                    fieldId: 'facility_code',
                    fieldName: 'facility_code',
                    fieldDisplayName: loc('Facility Code', 'Code installation'),
                    dataType: 'string',
                    visible: true,
                    isPrimaryKey: true,
                    isIndex: true,
                    isJoinField: true,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: true
                  },
                  {
                    fieldId: 'location_city',
                    fieldName: 'location_city',
                    fieldDisplayName: loc('Hub City', 'Ville du hub'),
                    dataType: 'string',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: false,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: true
                  },
                  {
                    fieldId: 'capacity_sqft',
                    fieldName: 'capacity_sqft',
                    fieldDisplayName: loc('Storage Area (sq ft)', 'Superficie (pi²)'),
                    dataType: 'number',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: false,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: false
                  }
                ]
              }
            ]
          },
          {
            tableId: 'inventory',
            tableName: 'SKU Inventory',
            groupingId: 'group-supply-chain',
            fields: [
              {
                fieldGroupingId: 'fg-inv',
                fieldGroupingName: 'Stock Levels',
                tableId: 'inventory',
                fields: [
                  {
                    fieldId: 'sku',
                    fieldName: 'sku',
                    fieldDisplayName: loc('SKU Identifier', 'Code SKU'),
                    dataType: 'string',
                    visible: true,
                    isPrimaryKey: true,
                    isIndex: true,
                    isJoinField: true,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: true
                  },
                  {
                    fieldId: 'category',
                    fieldName: 'category',
                    fieldDisplayName: loc('Commodity Category', 'Catégorie de produit'),
                    dataType: 'string',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: true,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: true,
                    lookupValues: [
                      locVal('electronics', 'Electronics', 'Électronique'),
                      locVal('apparel', 'Apparel & Textiles', 'Vêtements et textiles'),
                      locVal('perishables', 'Perishables & Food', 'Denrées périssables'),
                      locVal('hardware', 'Hardware & Tools', 'Quincaillerie et outils')
                    ]
                  },
                  {
                    fieldId: 'units_on_hand',
                    fieldName: 'units_on_hand',
                    fieldDisplayName: loc('Units on Hand', 'Unités disponibles'),
                    dataType: 'number',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: false,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: false
                  },
                  {
                    fieldId: 'valuation',
                    fieldName: 'valuation',
                    fieldDisplayName: loc('Carrying Value', 'Valeur comptable'),
                    dataType: 'currency',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: false,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: false
                  }
                ]
              }
            ]
          },
          {
            tableId: 'shipments',
            tableName: 'Shipments & Logistics',
            groupingId: 'group-supply-chain',
            fields: [
              {
                fieldGroupingId: 'fg-ship',
                fieldGroupingName: 'Freight Carrier Details',
                tableId: 'shipments',
                fields: [
                  {
                    fieldId: 'tracking_num',
                    fieldName: 'tracking_num',
                    fieldDisplayName: loc('Tracking Number', 'Numéro de suivi'),
                    dataType: 'string',
                    visible: true,
                    isPrimaryKey: true,
                    isIndex: true,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: true
                  },
                  {
                    fieldId: 'carrier',
                    fieldName: 'carrier',
                    fieldDisplayName: loc('Logistics Carrier', 'Transporteur'),
                    dataType: 'string',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: false,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: true,
                    lookupValues: [
                      locVal('fedex', 'FedEx Express', 'FedEx Express'),
                      locVal('ups', 'UPS Freight', 'UPS Fret'),
                      locVal('dhl', 'DHL Global', 'DHL Mondial'),
                      locVal('freight_direct', 'Freight Direct', 'Fret Direct')
                    ]
                  },
                  {
                    fieldId: 'freight_charge',
                    fieldName: 'freight_charge',
                    fieldDisplayName: loc('Freight Fee', 'Frais de transport'),
                    dataType: 'currency',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: false,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: false
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'saas',
    name: 'SaaS Product Analytics',
    description: 'Tenants, active user subscriptions, usage telemetry, and billing invoices',
    icon: '📊',
    groupings: [
      {
        groupingId: 'group-saas',
        groupingName: 'Product & Subscription Metrics',
        relationships: [
          {
            relationshipId: 'rel-orgs-plans',
            name: 'Organization Subscriptions',
            sourceTableId: 'organizations',
            sourceFieldId: 'org_id',
            targetTableId: 'subscriptions',
            targetFieldId: 'org_id',
            cardinality: RelationshipCardinality.OneToMany
          },
          {
            relationshipId: 'rel-plans-invoices',
            name: 'Subscription Invoices',
            sourceTableId: 'subscriptions',
            sourceFieldId: 'subscription_id',
            targetTableId: 'invoices',
            targetFieldId: 'subscription_id',
            cardinality: RelationshipCardinality.OneToMany
          }
        ],
        tables: [
          {
            tableId: 'organizations',
            tableName: 'Enterprise Tenants',
            groupingId: 'group-saas',
            fields: [
              {
                fieldGroupingId: 'fg-org',
                fieldGroupingName: 'Account Details',
                tableId: 'organizations',
                fields: [
                  {
                    fieldId: 'org_slug',
                    fieldName: 'org_slug',
                    fieldDisplayName: loc('Tenant Slug', 'Identifiant client'),
                    dataType: 'string',
                    visible: true,
                    isPrimaryKey: true,
                    isIndex: true,
                    isJoinField: true,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: true
                  },
                  {
                    fieldId: 'org_name',
                    fieldName: 'org_name',
                    fieldDisplayName: { en: 'Company Name', fr: "Nom de l'entreprise" },
                    dataType: 'string',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: false,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: true
                  },
                  {
                    fieldId: 'seat_count',
                    fieldName: 'seat_count',
                    fieldDisplayName: loc('Licensed Seats', 'Sièges autorisés'),
                    dataType: 'number',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: false,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: false
                  }
                ]
              }
            ]
          },
          {
            tableId: 'subscriptions',
            tableName: 'Active Subscriptions',
            groupingId: 'group-saas',
            fields: [
              {
                fieldGroupingId: 'fg-sub',
                fieldGroupingName: 'Plan Attributes',
                tableId: 'subscriptions',
                fields: [
                  {
                    fieldId: 'tier',
                    fieldName: 'tier',
                    fieldDisplayName: loc('Subscription Tier', "Niveau d'abonnement"),
                    dataType: 'string',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: true,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: true,
                    lookupValues: [
                      locVal('starter', 'Starter Tier', 'Niveau Débutant'),
                      locVal('professional', 'Professional Tier', 'Niveau Professionnel'),
                      locVal('enterprise', 'Enterprise Tier', 'Niveau Entreprise')
                    ]
                  },
                  {
                    fieldId: 'mrr',
                    fieldName: 'mrr',
                    fieldDisplayName: loc('Monthly Recurring Revenue (MRR)', 'Revenu récurrent mensuel (MRR)'),
                    dataType: 'currency',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: false,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: false
                  },
                  {
                    fieldId: 'renewal_date',
                    fieldName: 'renewal_date',
                    fieldDisplayName: loc('Next Renewal Date', 'Prochain renouvellement'),
                    dataType: 'date',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: false,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: true
                  }
                ]
              }
            ]
          },
          {
            tableId: 'invoices',
            tableName: 'Billing Invoices',
            groupingId: 'group-saas',
            fields: [
              {
                fieldGroupingId: 'fg-invc',
                fieldGroupingName: 'Payment Details',
                tableId: 'invoices',
                fields: [
                  {
                    fieldId: 'invoice_number',
                    fieldName: 'invoice_number',
                    fieldDisplayName: loc('Invoice #', 'Numéro de facture'),
                    dataType: 'string',
                    visible: true,
                    isPrimaryKey: true,
                    isIndex: true,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: true
                  },
                  {
                    fieldId: 'billing_status',
                    fieldName: 'billing_status',
                    fieldDisplayName: loc('Payment Status', 'Statut de paiement'),
                    dataType: 'string',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: false,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: true,
                    lookupValues: [
                      locVal('paid', 'Paid in Full', 'Payé intégralement'),
                      locVal('pending', 'Pending Payment', 'Paiement en attente'),
                      locVal('overdue', 'Overdue / Late', 'En retard')
                    ]
                  },
                  {
                    fieldId: 'amount_billed',
                    fieldName: 'amount_billed',
                    fieldDisplayName: loc('Amount Billed', 'Montant facturé'),
                    dataType: 'currency',
                    visible: true,
                    isPrimaryKey: false,
                    isIndex: false,
                    isJoinField: false,
                    usableInReports: true,
                    filterable: true,
                    sortable: true,
                    groupable: false
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

@Injectable({ providedIn: 'root' })
export class GpSchemaDataLoaderService {
  /**
   * Built-in curated schema presets across enterprise domains
   */
  readonly presets: SchemaPreset[];

  constructor() {
    this.presets = RAW_PRESETS.map((p) => {
      const norm = this.normalizeSchemaPayload(p);
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        icon: p.icon,
        groupings: norm.groupings,
        relationships: p.relationships || norm.relationships
      };
    });
  }

  /**
   * Returns list of available presets
   */
  getPresetSchemas(): SchemaPreset[] {
    return this.presets;
  }

  /**
   * Parses raw JSON string into normalized groupings and relationships
   */
  parseJson(raw: string, dataPath?: string): { groupings: Grouping[]; relationships?: Relationship[] } {
    if (!raw || !raw.trim()) {
      throw new Error('Empty schema payload provided');
    }

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch (err: any) {
      throw new Error(`Invalid schema JSON: ${err.message}`);
    }

    return this.normalizeSchemaPayload(parsed, dataPath);
  }

  /**
   * Reads a schema JSON File from disk
   */
  async readFromFile(
    file: File,
    dataPath?: string
  ): Promise<{ groupings: Grouping[]; relationships?: Relationship[] }> {
    const text = await file.text();
    return this.parseJson(text, dataPath);
  }

  /**
   * Fetches schema metadata from a REST endpoint URL
   */
  async fetchFromUrl(
    url: string,
    headers?: Record<string, string>,
    dataPath?: string
  ): Promise<{ groupings: Grouping[]; relationships?: Relationship[] }> {
    if (!url || !url.trim()) {
      throw new Error('Schema API URL is required');
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...(headers ?? {})
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();
    return this.normalizeSchemaPayload(json, dataPath);
  }

  /**
   * Universal loader dispatching based on SchemaSourceConfig
   */
  async loadSchema(config: SchemaSourceConfig): Promise<LoadedSchemaResult> {
    let groupings: Grouping[] = [];
    let relationships: Relationship[] | undefined;
    let sourceName = 'Schema';

    switch (config.type) {
      case 'preset': {
        const preset = this.presets.find((p) => p.id === config.presetId) || this.presets[0];
        groupings = JSON.parse(JSON.stringify(preset.groupings));
        relationships = preset.relationships ? JSON.parse(JSON.stringify(preset.relationships)) : undefined;
        sourceName = preset.name;
        break;
      }
      case 'file': {
        if (!config.file) {
throw new Error('No schema file selected');
}
        sourceName = config.fileName || config.file.name;
        const res = await this.readFromFile(config.file, config.dataPath);
        groupings = res.groupings;
        relationships = res.relationships;
        break;
      }
      case 'api': {
        if (!config.url) {
throw new Error('No API URL provided');
}
        sourceName = config.url;
        const res = await this.fetchFromUrl(config.url, config.headers, config.dataPath);
        groupings = res.groupings;
        relationships = res.relationships;
        break;
      }
      case 'json': {
        if (!config.rawJson) {
throw new Error('No JSON schema payload provided');
}
        sourceName = 'Raw Schema JSON';
        const res = this.parseJson(config.rawJson, config.dataPath);
        groupings = res.groupings;
        relationships = res.relationships;
        break;
      }
      default:
        throw new Error(`Unsupported schema source type: ${(config as any).type}`);
    }

    let totalTables = 0;
    let totalFields = 0;
    groupings.forEach((g) => {
      totalTables += g.tables?.length || 0;
      g.tables?.forEach((t) => {
        t.fields?.forEach((fg) => {
          totalFields += fg.fields?.length || 0;
        });
      });
    });

    return {
      groupings,
      relationships,
      sourceType: config.type,
      sourceName,
      totalTables,
      totalFields
    };
  }

  /**
   * Normalizes arbitrary JSON structures (Grouping[], Table[], { groups: ... }, { tables: ... })
   */
  normalizeSchemaPayload(payload: any, dataPath?: string): { groupings: Grouping[]; relationships?: Relationship[] } {
    let target = payload;

    if (dataPath && dataPath.trim()) {
      const parts = dataPath.trim().split('.');
      for (const part of parts) {
        if (target && typeof target === 'object' && part in target) {
          target = target[part];
        } else {
          throw new Error(`Data path "${dataPath}" not found in schema payload`);
        }
      }
    }

    let rawGroupings: any[] = [];
    let relationships: Relationship[] | undefined;

    if (Array.isArray(target)) {
      // Could be an array of Grouping objects or an array of Table objects
      if (target.length > 0 && target[0].tables && Array.isArray(target[0].tables)) {
        rawGroupings = target;
      } else {
        // Flat array of tables: wrap into a default grouping
        rawGroupings = [
          {
            groupingId: 'imported-group',
            groupingName: 'Imported Tables',
            tables: target
          }
        ];
      }
    } else if (target && typeof target === 'object') {
      if (target.groupings && Array.isArray(target.groupings)) {
        rawGroupings = target.groupings;
      } else if (target.groups && Array.isArray(target.groups)) {
        rawGroupings = target.groups;
      } else if (target.tables && Array.isArray(target.tables)) {
        rawGroupings = [
          {
            groupingId: target.groupingId || 'imported-group',
            groupingName: target.groupingName || 'Imported Tables',
            tables: target.tables
          }
        ];
      } else {
        throw new Error('Schema JSON must contain an array of groups/groupings or tables');
      }

      if (target.relationships && Array.isArray(target.relationships)) {
        relationships = target.relationships.map((r: any) => this.normalizeRelationship(r));
      }
    } else {
      throw new Error('Unrecognized schema JSON format');
    }

    const normalizedGroupings: Grouping[] = rawGroupings.map((g, gIdx) => this.normalizeGrouping(g, gIdx));

    return { groupings: normalizedGroupings, relationships };
  }

  private normalizeGrouping(rawGroup: any, idx: number): Grouping {
    const groupId = String(rawGroup.groupingId || rawGroup.id || `group-${idx + 1}`);
    const groupName = String(rawGroup.groupingName || rawGroup.name || `Group ${idx + 1}`);

    const rawTables = Array.isArray(rawGroup.tables) ? rawGroup.tables : [];
    const tables = rawTables.map((t: any, tIdx: number) => this.normalizeTable(t, groupId, tIdx));

    let groupRels: Relationship[] | undefined;
    if (Array.isArray(rawGroup.relationships)) {
      groupRels = rawGroup.relationships.map((r: any) => this.normalizeRelationship(r));
    }

    return {
      groupingId: groupId,
      groupingName: groupName,
      tables,
      relationships: groupRels
    };
  }

  private normalizeTable(rawTable: any, parentGroupId: string, idx: number): Table {
    const tableId = String(rawTable.tableId || rawTable.id || rawTable.name || `table-${idx + 1}`);
    const tableName = String(rawTable.tableName || rawTable.name || `Table ${idx + 1}`);
    const groupingId = String(rawTable.groupingId || parentGroupId);

    let fieldsList: FieldGrouping[] = [];
    if (Array.isArray(rawTable.fields)) {
      if (rawTable.fields.length > 0 && Array.isArray(rawTable.fields[0].fields)) {
        // It's already FieldGrouping[]
        fieldsList = rawTable.fields.map((fg: any, fgIdx: number) => this.normalizeFieldGrouping(fg, tableId, fgIdx));
      } else {
        // It's a flat Field[] list: wrap into default field grouping
        const fields = rawTable.fields.map((f: any, fIdx: number) =>
          this.normalizeField(f, tableId, 'fg-default', fIdx)
        );
        fieldsList = [
          {
            fieldGroupingId: `${tableId}-fg-main`,
            fieldGroupingName: 'General Fields',
            tableId,
            fields
          }
        ];
      }
    }

    return {
      tableId,
      tableName,
      groupingId,
      fields: fieldsList
    };
  }

  private normalizeFieldGrouping(rawFg: any, parentTableId: string, idx: number): FieldGrouping {
    const fgId = String(rawFg.fieldGroupingId || rawFg.id || `${parentTableId}-fg-${idx + 1}`);
    const fgName = String(rawFg.fieldGroupingName || rawFg.name || 'Fields');
    const tableId = String(rawFg.tableId || parentTableId);
    const rawFields = Array.isArray(rawFg.fields) ? rawFg.fields : [];

    return {
      fieldGroupingId: fgId,
      fieldGroupingName: fgName,
      tableId,
      fields: rawFields.map((f: any, fIdx: number) => this.normalizeField(f, tableId, fgId, fIdx))
    };
  }

  private normalizeField(rawField: any, tableId: string, fgId: string, idx: number): Field {
    const fieldId = String(rawField.fieldId || rawField.id || rawField.name || `field-${idx + 1}`);
    const fieldName = String(rawField.fieldName || rawField.name || fieldId);

    // Normalize fieldDisplayName to LocalizedValue
    let fieldDisplayName: LocalizedValue;
    const rawDisplayName = rawField.fieldDisplayName || rawField.displayName || rawField.label || fieldName;
    if (typeof rawDisplayName === 'object' && rawDisplayName !== null && 'displayValue' in rawDisplayName) {
      fieldDisplayName = {
        value: String(rawDisplayName.value || fieldName),
        displayValue: rawDisplayName.displayValue || { en: fieldName }
      };
    } else if (typeof rawDisplayName === 'object' && rawDisplayName !== null) {
      const displayValue: Record<string, string> = {};
      for (const [k, v] of Object.entries(rawDisplayName)) {
        displayValue[k] = String(v);
      }
      fieldDisplayName = {
        value: displayValue['en'] || Object.values(displayValue)[0] || fieldName,
        displayValue
      };
    } else {
      const str = String(rawDisplayName);
      fieldDisplayName = {
        value: str,
        displayValue: { en: str }
      };
    }

    const dataType = rawField.dataType || rawField.type || 'string';

    let lookupValues: FieldValue<string>[] | undefined;
    const rawLookup = rawField.lookupValues || rawField.options || rawField.lookupList;
    if (Array.isArray(rawLookup) && rawLookup.length > 0) {
      lookupValues = rawLookup.map((item: any) => {
        if (typeof item === 'object' && item !== null && 'value' in item) {
          const displayValue =
            item.displayValue && typeof item.displayValue === 'object'
              ? item.displayValue
              : { en: String(item.label || item.name || item.value) };
          return {
            value: String(item.value),
            displayValue
          };
        }
        const str = String(item);
        return {
          value: str,
          displayValue: { en: str }
        };
      });
    }

    return {
      fieldId,
      tableId: String(rawField.tableId || tableId),
      fieldGroupingId: String(rawField.fieldGroupingId || fgId),
      fieldName,
      fieldDisplayName,
      description: rawField.description,
      dataType,
      fieldType: rawField.fieldType,
      visible: rawField.visible !== false,
      isPrimaryKey: Boolean(rawField.isPrimaryKey || rawField.primaryKey),
      isIndex: Boolean(rawField.isIndex || rawField.indexed),
      isJoinField: Boolean(rawField.isJoinField || rawField.foreignKey),
      usableInReports: rawField.usableInReports !== false,
      filterable: rawField.filterable !== false,
      sortable: rawField.sortable !== false,
      groupable: rawField.groupable !== false,
      format: rawField.format,
      aggregationType: rawField.aggregationType,
      lookupValues
    };
  }

  private normalizeRelationship(rawRel: any): Relationship {
    return {
      relationshipId: String(rawRel.relationshipId || rawRel.id || `rel-${Math.random().toString(36).substring(2, 7)}`),
      name: String(rawRel.name || rawRel.label || 'Relationship'),
      sourceTableId: String(rawRel.sourceTableId || rawRel.fromTable || ''),
      sourceFieldId: String(rawRel.sourceFieldId || rawRel.fromField || ''),
      targetTableId: String(rawRel.targetTableId || rawRel.toTable || ''),
      targetFieldId: String(rawRel.targetFieldId || rawRel.toField || ''),
      cardinality: rawRel.cardinality || RelationshipCardinality.OneToMany,
      joinType: rawRel.joinType
    };
  }
}
