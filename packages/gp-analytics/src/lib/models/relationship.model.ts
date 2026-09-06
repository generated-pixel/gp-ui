import { JoinType } from './join-type.model';

export { JoinType };

export enum RelationshipCardinality {
  OneToOne = 'one-to-one',
  OneToMany = 'one-to-many',
  ManyToOne = 'many-to-one',
  ManyToMany = 'many-to-many'
}

export interface Relationship {
  relationshipId: string;
  name: string;
  sourceTableId: string;
  sourceFieldId: string;
  targetTableId: string;
  targetFieldId: string;
  cardinality: RelationshipCardinality | `${RelationshipCardinality}`;
  joinType?: JoinType | `${JoinType}`;
}
