import { Field } from './field';

export interface Dataset {
  id: string;
  name: string;
  folderId: string;
  fields: Field[];
}
