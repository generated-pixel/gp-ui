import { Injectable } from '@angular/core';
import { Field, Grouping, Relationship } from '../models';

export type { FieldSelectability } from '../interfaces/field-selectability.interface';
import type { FieldSelectability } from '../interfaces/field-selectability.interface';

@Injectable({ providedIn: 'root' })
export class GpRelationshipGraphService {
  /**
   * Extracts all relationships defined across groupings and optional explicit relationships.
   */
  collectRelationships(groupings: Grouping[] = [], additionalRelationships: Relationship[] = []): Relationship[] {
    const relationships: Relationship[] = [...additionalRelationships];
    const seenIds = new Set<string>(additionalRelationships.map((r) => r.relationshipId));

    for (const group of groupings) {
      if (group.relationships) {
        for (const rel of group.relationships) {
          if (!seenIds.has(rel.relationshipId)) {
            relationships.push(rel);
            seenIds.add(rel.relationshipId);
          }
        }
      }
    }

    return relationships;
  }

  /**
   * Computes the set of table IDs that are eligible for selection given the currently
   * active tables in the dataset.
   *
   * Rules:
   * 1. If activeTableIds is empty, all tables are eligible (returns null to denote wildcard).
   * 2. If activeTableIds has tables, eligible tables are:
   *    - The active tables themselves.
   *    - Any table directly linked to ANY active table via a Relationship (bidirectional).
   */
  getEligibleTableIds(activeTableIds: Iterable<string>, relationships: Relationship[]): Set<string> | null {
    const activeSet = new Set(activeTableIds);
    if (activeSet.size === 0) {
      return null; // Null indicates all tables are eligible when dataset is empty
    }

    const eligible = new Set<string>(activeSet);

    for (const rel of relationships) {
      if (activeSet.has(rel.sourceTableId)) {
        eligible.add(rel.targetTableId);
      }
      if (activeSet.has(rel.targetTableId)) {
        eligible.add(rel.sourceTableId);
      }
    }

    return eligible;
  }

  /**
   * Checks whether a specific table is eligible based on active tables and relationships.
   */
  isTableEligible(tableId: string, activeTableIds: Iterable<string>, relationships: Relationship[]): boolean {
    const eligibleSet = this.getEligibleTableIds(activeTableIds, relationships);
    if (eligibleSet === null) {
      return true;
    }
    return eligibleSet.has(tableId);
  }

  /**
   * Evaluates if a field can be added to the dataset and provides a descriptive reason if not.
   */
  checkFieldSelectability(
    field: Field,
    activeTableIds: Iterable<string>,
    relationships: Relationship[]
  ): FieldSelectability {
    if (!field.visible) {
      return {
        selectable: false,
        reason: 'not-visible',
        message: 'Field is marked not visible'
      };
    }

    if (!field.usableInReports) {
      return {
        selectable: false,
        reason: 'not-usable-in-reports',
        message: 'Field cannot be used in reports'
      };
    }

    const isEligible = this.isTableEligible(field.tableId, activeTableIds, relationships);
    if (!isEligible) {
      return {
        selectable: false,
        reason: 'table-not-related',
        message: 'Table is not directly related to currently selected tables'
      };
    }

    return { selectable: true };
  }

  /**
   * Finds all relationships directly connecting two tables.
   */
  findRelationships(tableIdA: string, tableIdB: string, relationships: Relationship[]): Relationship[] {
    return relationships.filter(
      (r) =>
        (r.sourceTableId === tableIdA && r.targetTableId === tableIdB) ||
        (r.sourceTableId === tableIdB && r.targetTableId === tableIdA)
    );
  }

  /**
   * Finds all table IDs directly linked to a specific table.
   */
  getDirectlyLinkedTableIds(tableId: string, relationships: Relationship[]): string[] {
    const linked = new Set<string>();
    for (const rel of relationships) {
      if (rel.sourceTableId === tableId) {
        linked.add(rel.targetTableId);
      } else if (rel.targetTableId === tableId) {
        linked.add(rel.sourceTableId);
      }
    }
    return Array.from(linked);
  }
}
