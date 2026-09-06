import { Injectable, signal } from '@angular/core';

export type SupportedLocale = 'en' | 'fr';
export type TranslationKey =
  | 'metadataCatalogue'
  | 'schemaExplorer'
  | 'browseMetadata'
  | 'expandInstructions'
  | 'grouping'
  | 'metadataTree'
  | 'noVisibleFields'
  | 'noMetadataGroups'
  | 'valueSeparation'
  | 'oneValueManyDisplays'
  | 'storedValue'
  | 'english'
  | 'french'
  | 'language'
  | 'foundationIntro'
  | 'searchFieldsOrTables'
  | 'allGroups'
  | 'fieldsSelected'
  | 'selectDatasetFields'
  | 'datasetFields'
  | 'fieldProperties'
  | 'aggregation'
  | 'filterable'
  | 'sortable'
  | 'groupable'
  | 'baseFieldNotFilterable'
  | 'baseFieldNotSortable'
  | 'baseFieldNotGroupable'
  | 'tableNotRelated'
  | 'datasetPreview'
  | 'simulatedData'
  | 'noFieldsSelected'
  | 'dragFieldsHere'
  | 'addField'
  | 'removeField'
  | 'reorderFields'
  | 'datasetName'
  | 'primaryKey'
  | 'joinKey'
  | 'dataType'
  | 'sourceTable'
  | 'selectedFieldDetails'
  | 'clearAll'
  | 'inDataset'
  | 'linkedTables'
  | 'raw'
  | 'sum'
  | 'average'
  | 'min'
  | 'max'
  | 'count'
  | 'countDistinct'
  | 'groupBy'
  | 'groupByTable'
  | 'groupByRole'
  | 'groupByNone'
  | 'dimensions'
  | 'measures'
  | 'toggleGroupBy'
  | 'isGrouped'
  | 'groupedByDimensions'
  | 'flatRows'
  | 'dataSource'
  | 'loadDataSource'
  | 'simulatedDataSource'
  | 'fileDataSource'
  | 'apiDataSource'
  | 'rawJsonDataSource'
  | 'selectSourceType'
  | 'dragDropJsonFile'
  | 'apiUrl'
  | 'apiUrlPlaceholder'
  | 'dataPath'
  | 'dataPathPlaceholder'
  | 'rawJsonPlaceholder'
  | 'loadData'
  | 'loading'
  | 'resetToSimulated'
  | 'fieldsMatched'
  | 'recordsLoaded'
  | 'sourceActive'
  | 'close'
  | 'noFileSelected'
  | 'enterValidUrl'
  | 'enterValidJson'
  | 'loadSchema'
  | 'loadSchemaTitle'
  | 'schemaSource'
  | 'presetSchema'
  | 'schemaLoaded'
  | 'rawJsonSchemaPlaceholder'
  | 'filters'
  | 'datasetFilters'
  | 'addFilter'
  | 'noFiltersDefined'
  | 'filterValue'
  | 'selectFilterField'
  | 'operator'
  | 'applyFilter'
  | 'cancel'
  | 'translatedList'
  | 'filterByThisField'
  | 'equals'
  | 'notEquals'
  | 'inList'
  | 'greaterThan'
  | 'greaterOrEqual'
  | 'lessThan'
  | 'lessOrEqual'
  | 'contains'
  | 'startsWith'
  | 'isNull'
  | 'isNotNull'
  | 'filteredCount'
  | 'activeFilters'
  | 'clearAllFilters'
  | 'availableOptions';

type TranslationParams = Record<string, number | string>;

const translations: Record<SupportedLocale, Record<TranslationKey, string>> = {
  en: {
    metadataCatalogue: 'Metadata catalogue',
    schemaExplorer: 'Schema explorer',
    browseMetadata: 'Browse your metadata',
    expandInstructions: 'Expand a group, then a table',
    grouping: 'Grouping',
    metadataTree: 'Metadata catalogue',
    noVisibleFields: 'No visible fields',
    noMetadataGroups: 'No metadata groups available.',
    valueSeparation: 'Value separation',
    oneValueManyDisplays: 'One value, many display values',
    storedValue: 'Stored value',
    english: 'English',
    french: 'French',
    language: 'Language',
    foundationIntro: 'Tables, fields, joins, and localized display values in one inspectable model.',
    searchFieldsOrTables: 'Search tables and fields...',
    allGroups: 'All groups',
    fieldsSelected: 'fields selected',
    selectDatasetFields: 'Select dataset fields',
    datasetFields: 'Dataset fields',
    fieldProperties: 'Field properties',
    aggregation: 'Aggregation',
    filterable: 'Filterable in dataset',
    sortable: 'Sortable in dataset',
    groupable: 'Groupable in dataset',
    baseFieldNotFilterable: 'Base field schema is not filterable',
    baseFieldNotSortable: 'Base field schema is not sortable',
    baseFieldNotGroupable: 'Base field schema is not groupable',
    tableNotRelated: 'Table is not related to selected dataset tables',
    datasetPreview: 'Dataset preview',
    simulatedData: 'Simulated preview data',
    noFieldsSelected: 'No dataset fields selected',
    dragFieldsHere: 'Drag fields here or click + from the catalogue',
    addField: 'Add field to dataset',
    removeField: 'Remove field from dataset',
    reorderFields: 'Reorder fields',
    datasetName: 'Dataset name',
    primaryKey: 'Primary key',
    joinKey: 'Join key',
    dataType: 'Data type',
    sourceTable: 'Source table',
    selectedFieldDetails: 'Configure how this field behaves in your dataset',
    clearAll: 'Clear all',
    inDataset: 'In dataset',
    linkedTables: 'Linked tables',
    raw: 'Raw (None)',
    sum: 'Sum',
    average: 'Average',
    min: 'Minimum',
    max: 'Maximum',
    count: 'Count',
    countDistinct: 'Count distinct',
    groupBy: 'Group by',
    groupByTable: 'By Table',
    groupByRole: 'By Role',
    groupByNone: 'Flat List',
    dimensions: 'Dimensions (Group by)',
    measures: 'Measures (Aggregated)',
    toggleGroupBy: 'Toggle Group By',
    isGrouped: 'Grouped dimension',
    groupedByDimensions: 'Grouped by Dimensions',
    flatRows: 'Flat Rows',
    dataSource: 'Data Source',
    loadDataSource: 'Load Custom Data',
    simulatedDataSource: 'Simulated (Auto)',
    fileDataSource: 'JSON File',
    apiDataSource: 'REST API',
    rawJsonDataSource: 'Raw JSON',
    selectSourceType: 'Select Data Source',
    dragDropJsonFile: 'Drag & drop a JSON file here or click to browse',
    apiUrl: 'API Endpoint URL',
    apiUrlPlaceholder: 'https://api.example.com/data',
    dataPath: 'Data Path (optional, e.g. items or value)',
    dataPathPlaceholder: 'e.g. data.items, value, or records',
    rawJsonPlaceholder: 'Paste your JSON array or object here...',
    loadData: 'Load Data',
    loading: 'Loading...',
    resetToSimulated: 'Reset to Simulated Data',
    fieldsMatched: '{matched} of {total} fields matched',
    recordsLoaded: '{count} records loaded',
    sourceActive: 'Custom Source Active',
    close: 'Close',
    noFileSelected: 'Please select a JSON file to load',
    enterValidUrl: 'Please enter a valid HTTP/HTTPS URL',
    enterValidJson: 'Please provide valid JSON text',
    loadSchema: 'Load Schema',
    loadSchemaTitle: 'Load Schema Metadata',
    schemaSource: 'Schema Source',
    presetSchema: 'Curated Presets',
    schemaLoaded: '{tables} tables and {fields} fields loaded',
    rawJsonSchemaPlaceholder: 'Paste schema JSON ({ groupings: [...] } or Table[])...',
    filters: 'Filters',
    datasetFilters: 'Dataset Filters',
    addFilter: 'Add Filter',
    noFiltersDefined: 'No filters defined. Add a filter to refine the dataset rows.',
    filterValue: 'Filter Value',
    selectFilterField: 'Select Field...',
    operator: 'Operator',
    applyFilter: 'Apply Filter',
    cancel: 'Cancel',
    translatedList: 'Localized Lookup List',
    filterByThisField: 'Filter by this field',
    equals: 'Equals (=)',
    notEquals: 'Not Equals (!=)',
    inList: 'In List (one of)',
    greaterThan: 'Greater Than (>)',
    greaterOrEqual: 'Greater or Equal (>=)',
    lessThan: 'Less Than (<)',
    lessOrEqual: 'Less or Equal (<=)',
    contains: 'Contains',
    startsWith: 'Starts With',
    isNull: 'Is Empty / Null',
    isNotNull: 'Is Not Empty',
    filteredCount: 'Filtered: {count} of {total} rows',
    activeFilters: 'Active Filters',
    clearAllFilters: 'Clear All Filters',
    availableOptions: 'Available options (translated)'
  },
  fr: {
    metadataCatalogue: 'Catalogue de métadonnées',
    schemaExplorer: 'Explorateur de schéma',
    browseMetadata: 'Parcourir vos métadonnées',
    expandInstructions: 'Développez un groupe, puis une table',
    grouping: 'Groupe',
    metadataTree: 'Catalogue de métadonnées',
    noVisibleFields: 'Aucun champ visible',
    noMetadataGroups: 'Aucun groupe de métadonnées disponible.',
    valueSeparation: 'Séparation des valeurs',
    oneValueManyDisplays: 'Une valeur, plusieurs affichages',
    storedValue: 'Valeur stockée',
    english: 'Anglais',
    french: 'Français',
    language: 'Langue',
    foundationIntro: 'Tables, champs, jointures et valeurs affichées localisées dans un modèle inspectable.',
    searchFieldsOrTables: 'Rechercher des tables et champs...',
    allGroups: 'Tous les groupes',
    fieldsSelected: 'champs sélectionnés',
    selectDatasetFields: 'Sélectionner les champs du jeu de données',
    datasetFields: 'Champs du jeu de données',
    fieldProperties: 'Propriétés du champ',
    aggregation: 'Agrégation',
    filterable: 'Filtrable dans le jeu',
    sortable: 'Triable dans le jeu',
    groupable: 'Regroupable dans le jeu',
    baseFieldNotFilterable: 'Le schéma du champ de base n’est pas filtrable',
    baseFieldNotSortable: 'Le schéma du champ de base n’est pas triable',
    baseFieldNotGroupable: 'Le schéma du champ de base n’est pas regroupable',
    tableNotRelated: 'La table n’est pas liée aux tables sélectionnées',
    datasetPreview: 'Aperçu du jeu de données',
    simulatedData: 'Données simulées d’aperçu',
    noFieldsSelected: 'Aucun champ sélectionné',
    dragFieldsHere: 'Glissez des champs ici ou cliquez sur + dans le catalogue',
    addField: 'Ajouter le champ au jeu de données',
    removeField: 'Supprimer le champ',
    reorderFields: 'Réorganiser les champs',
    datasetName: 'Nom du jeu de données',
    primaryKey: 'Clé primaire',
    joinKey: 'Clé de jointure',
    dataType: 'Type de données',
    sourceTable: 'Table source',
    selectedFieldDetails: 'Configurez le comportement de ce champ',
    clearAll: 'Tout effacer',
    inDataset: 'Dans le jeu',
    linkedTables: 'Tables reliées',
    raw: 'Brut (Aucun)',
    sum: 'Somme',
    average: 'Moyenne',
    min: 'Minimum',
    max: 'Maximum',
    count: 'Nombre',
    countDistinct: 'Nombre distinct',
    groupBy: 'Grouper par',
    groupByTable: 'Par table',
    groupByRole: 'Par rôle',
    groupByNone: 'Liste plate',
    dimensions: 'Dimensions (Regroupement)',
    measures: 'Mesures (Agrégées)',
    toggleGroupBy: 'Basculer le regroupement',
    isGrouped: 'Dimension regroupée',
    groupedByDimensions: 'Regroupé par dimensions',
    flatRows: 'Lignes plates',
    dataSource: 'Source de données',
    loadDataSource: 'Charger des données personnalisées',
    simulatedDataSource: 'Simulé (Auto)',
    fileDataSource: 'Fichier JSON',
    apiDataSource: 'API REST',
    rawJsonDataSource: 'JSON brut',
    selectSourceType: 'Sélectionner la source',
    dragDropJsonFile: 'Glissez un fichier JSON ici ou cliquez pour parcourir',
    apiUrl: 'URL du point de terminaison API',
    apiUrlPlaceholder: 'https://api.exemple.com/donnees',
    dataPath: 'Chemin des données (optionnel, ex: items ou value)',
    dataPathPlaceholder: 'ex: data.items, value ou records',
    rawJsonPlaceholder: 'Collez votre tableau ou objet JSON ici...',
    loadData: 'Charger les données',
    loading: 'Chargement...',
    resetToSimulated: 'Revenir aux données simulées',
    fieldsMatched: '{matched} sur {total} champs correspondants',
    recordsLoaded: '{count} enregistrements chargés',
    sourceActive: 'Source personnalisée active',
    close: 'Fermer',
    noFileSelected: 'Veuillez sélectionner un fichier JSON',
    enterValidUrl: 'Veuillez entrer une URL HTTP/HTTPS valide',
    enterValidJson: 'Veuillez fournir un texte JSON valide',
    loadSchema: 'Charger le schéma',
    loadSchemaTitle: 'Charger les métadonnées du schéma',
    schemaSource: 'Source du schéma',
    presetSchema: 'Préréglages de domaine',
    schemaLoaded: '{tables} tables et {fields} champs chargés',
    rawJsonSchemaPlaceholder: 'Collez le schéma JSON ({ groupings: [...] } ou Table[])...',
    filters: 'Filtres',
    datasetFilters: 'Filtres du jeu de données',
    addFilter: 'Ajouter un filtre',
    noFiltersDefined: 'Aucun filtre défini. Ajoutez un filtre pour affiner les lignes.',
    filterValue: 'Valeur du filtre',
    selectFilterField: 'Sélectionner un champ...',
    operator: 'Opérateur',
    applyFilter: 'Appliquer le filtre',
    cancel: 'Annuler',
    translatedList: 'Liste de recherche localisée',
    filterByThisField: 'Filtrer par ce champ',
    equals: 'Égal à (=)',
    notEquals: 'Différent de (!=)',
    inList: 'Dans la liste (un parmi)',
    greaterThan: 'Supérieur à (>)',
    greaterOrEqual: 'Supérieur ou égal (>=)',
    lessThan: 'Inférieur à (<)',
    lessOrEqual: 'Inférieur ou égal (<=)',
    contains: 'Contient',
    startsWith: 'Commence par',
    isNull: 'Est vide / nul',
    isNotNull: 'N’est pas vide',
    filteredCount: 'Filtré : {count} sur {total} lignes',
    activeFilters: 'Filtres actifs',
    clearAllFilters: 'Effacer tous les filtres',
    availableOptions: 'Options disponibles (traduites)'
  }
};

@Injectable({ providedIn: 'root' })
export class GpTranslationService {
  readonly locale = signal<SupportedLocale>('en');

  setLocale(locale: SupportedLocale): void {
    this.locale.set(locale);
  }

  translate(key: TranslationKey, params: TranslationParams = {}): string {
    let text = translations[this.locale()]?.[key] ?? key;
    for (const [name, value] of Object.entries(params)) {
      text = text.replace(`{${name}}`, String(value));
    }
    return text;
  }
}
