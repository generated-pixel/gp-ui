import { Dataset } from './dataset';

export interface Folder {
  id: string;
  name: string;
  datasets: Dataset[];
}
