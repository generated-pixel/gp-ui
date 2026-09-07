import { Component, input } from '@angular/core';

export interface DocApiProperty {
  name: string;
  type: string;
  default?: string;
  description: string;
  kind?: 'input' | 'output' | 'model' | 'query' | 'prop';
}

@Component({
  selector: 'doc-api-table',
  standalone: true,
  imports: [],
  templateUrl: './doc-api-table.html',
  styleUrl: './doc-api-table.scss'
})
export class DocApiTable {
  public title = input<string>('Properties (Inputs)');
  public properties = input<DocApiProperty[]>([]);
  public hasDefaults = input<boolean>(true);
}
