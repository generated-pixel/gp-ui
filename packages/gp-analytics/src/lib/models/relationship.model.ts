export type RelationshipCardinality = 'one-to-one' | 'one-to-many';

export interface Relationship {
  relationshipId: string;
  name: string;
  sourceTableId: string;
  sourceFieldId: string;
  targetTableId: string;
  targetFieldId: string;
  cardinality: RelationshipCardinality;
}
