import { Injectable } from '@angular/core';
import { DatasetField } from '../models/dataset-field.model';
import {
  DatasetDataSourceConfig,
  LoadedDataResult,
} from '../models/data-source.model';

@Injectable({ providedIn: 'root' })
export class GpDatasetDataLoaderService {
  /**
   * Parses a raw JSON string into an array of records.
   * Supports optional dot-separated dataPath (e.g., 'data.orders' or 'value').
   */
  parseJson(raw: string, dataPath?: string): Record<string, any>[] {
    if (!raw || !raw.trim()) {
      return [];
    }

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch (err: any) {
      throw new Error(`Invalid JSON: ${err.message}`);
    }

    return this.extractRecords(parsed, dataPath);
  }

  /**
   * Reads a JSON File from local disk and extracts records.
   */
  async readFromFile(file: File, dataPath?: string): Promise<Record<string, any>[]> {
    const text = await file.text();
    return this.parseJson(text, dataPath);
  }

  /**
   * Fetches JSON records from a REST/HTTP endpoint URL.
   */
  async fetchFromUrl(
    url: string,
    headers?: Record<string, string>,
    dataPath?: string,
  ): Promise<Record<string, any>[]> {
    if (!url || !url.trim()) {
      throw new Error('API URL is required');
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...(headers ?? {}),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();
    return this.extractRecords(json, dataPath);
  }

  /**
   * Loads data based on a generic DatasetDataSourceConfig.
   */
  async loadData(
    config: DatasetDataSourceConfig,
    fields: DatasetField[] = [],
  ): Promise<LoadedDataResult> {
    let rawRecords: Record<string, any>[] = [];
    let sourceName = 'Generic Source';

    switch (config.type) {
      case 'file': {
        if (!config.file) {
          throw new Error('No file provided');
        }
        sourceName = config.fileName || config.file.name;
        rawRecords = await this.readFromFile(config.file, config.dataPath);
        break;
      }
      case 'api': {
        if (!config.url) {
          throw new Error('No API URL provided');
        }
        sourceName = config.url;
        rawRecords = await this.fetchFromUrl(config.url, config.headers, config.dataPath);
        break;
      }
      case 'json': {
        if (!config.rawJson) {
          throw new Error('No JSON payload provided');
        }
        sourceName = 'Raw JSON Payload';
        rawRecords = this.parseJson(config.rawJson, config.dataPath);
        break;
      }
      default:
        rawRecords = [];
    }

    const mapped = this.mapRecordsToDatasetFields(rawRecords, fields);
    const { matchedFields, unmatchedFields } = this.analyzeFieldMatching(rawRecords, fields);

    return {
      sourceType: config.type,
      sourceName,
      records: mapped,
      totalRecords: mapped.length,
      matchedFields,
      unmatchedFields,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Maps incoming raw record properties to dataset fields.
   * Matches candidate keys: datasetFieldId, fieldId, fieldName, normalized snake/camel, and display values.
   */
  mapRecordsToDatasetFields(
    records: Record<string, any>[],
    fields: DatasetField[],
  ): Record<string, any>[] {
    if (!records || records.length === 0 || !fields || fields.length === 0) {
      return records || [];
    }

    return records.map((rec, index) => {
      const mapped: Record<string, any> = {
        _id: rec['_id'] ?? `custom-row-${index + 1}`,
      };

      for (const field of fields) {
        const found = this.extractFieldValue(rec, field);
        if (found !== undefined) {
          mapped[field.datasetFieldId] = found;
        } else {
          // Keep whatever was already there or null
          mapped[field.datasetFieldId] = rec[field.datasetFieldId] ?? null;
        }
      }

      // Preserve any existing non-field properties
      for (const key of Object.keys(rec)) {
        if (!(key in mapped)) {
          mapped[key] = rec[key];
        }
      }

      return mapped;
    });
  }

  /**
   * Analyzes matching between raw record keys and active dataset fields.
   */
  analyzeFieldMatching(
    records: Record<string, any>[],
    fields: DatasetField[],
  ): { matchedFields: string[]; unmatchedFields: string[] } {
    if (!records || records.length === 0) {
      return { matchedFields: [], unmatchedFields: fields.map((f) => f.fieldName) };
    }

    const sample = records[0];
    const matched: string[] = [];
    const unmatched: string[] = [];

    for (const field of fields) {
      const val = this.extractFieldValue(sample, field);
      if (val !== undefined) {
        matched.push(field.fieldName);
      } else {
        unmatched.push(field.fieldName);
      }
    }

    return { matchedFields: matched, unmatchedFields: unmatched };
  }

  private extractFieldValue(record: Record<string, any>, field: DatasetField): any {
    if (!record || typeof record !== 'object') {
      return undefined;
    }

    // Direct exact matches
    if (field.datasetFieldId in record) return record[field.datasetFieldId];
    if (field.fieldId in record) return record[field.fieldId];
    if (field.fieldName in record) return record[field.fieldName];

    // Case-insensitive & normalized matches
    const recKeys = Object.keys(record);
    const displayValues = field.fieldDisplayName?.displayValue
      ? Object.values(field.fieldDisplayName.displayValue)
      : [];
    const normalizedTargets = [
      this.normalize(field.fieldName),
      this.normalize(field.fieldId),
      this.normalize(String(field.fieldDisplayName?.value ?? '')),
      ...displayValues.map((dv) => this.normalize(dv)),
    ].filter(Boolean);

    for (const key of recKeys) {
      const normKey = this.normalize(key);
      if (normalizedTargets.includes(normKey)) {
        return record[key];
      }
    }

    return undefined;
  }

  private normalize(str: string): string {
    return str.toLowerCase().replace(/[-_\s.]/g, '');
  }

  private extractRecords(data: any, dataPath?: string): Record<string, any>[] {
    let target = data;

    if (dataPath && dataPath.trim()) {
      const parts = dataPath.trim().split('.');
      for (const part of parts) {
        if (target != null && typeof target === 'object' && part in target) {
          target = target[part];
        } else {
          throw new Error(`Data path '${dataPath}' not found in payload`);
        }
      }
    }

    if (Array.isArray(target)) {
      return target;
    }

    if (target != null && typeof target === 'object') {
      // Auto-detect common nested list keys (OData 'value', GraphQL/REST 'data', 'items', 'results', 'records')
      const commonKeys = ['items', 'data', 'results', 'records', 'value', 'rows'];
      for (const k of commonKeys) {
        if (Array.isArray(target[k])) {
          return target[k];
        }
      }

      // Single record object
      return [target];
    }

    throw new Error('Payload does not contain an array of records');
  }
}
