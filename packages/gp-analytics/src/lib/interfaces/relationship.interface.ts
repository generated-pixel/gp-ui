import { JoinType } from '../enums/join-type.enum';
import { RelationshipCardinality } from '../enums/relationship-cardinality.enum';

export interface Relationship {
  relationshipId: string;
  name?: string;
  sourceTableId: string;
  sourceFieldId: string;
  targetTableId: string;
  targetFieldId: string;
  cardinality?: RelationshipCardinality | `${RelationshipCardinality}`;
  joinType?: JoinType | `${JoinType}`;
  description?: string;
}
