import { GpBase } from '../../../base/gp-base';
import {
  Component,
  input,
  model,
  output,
  contentChild,
  TemplateRef,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIcon } from '../../../icons/icon';
import { GpPaginator, GpPageState } from '../paginator/paginator';

export type GpDataViewLayout = 'list' | 'grid';

@Component({
  selector: 'gp-data-view',
  standalone: true,
  imports: [CommonModule, GpIcon, GpPaginator],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './data-view.html',
  styleUrl: './data-view.scss'
})
export class GpDataView extends GpBase {
  public value = input<any[]>([]);
  public layout = model<GpDataViewLayout>('list');
  public rows = model<number>(6);
  public first = model<number>(0);
  public layoutOptions = input<boolean>(true);
  public paginator = input<boolean>(false);
  public rowsPerPageOptions = input<number[]>([]);

  public onPage = output<GpPageState>();
  public onLayoutChange = output<GpDataViewLayout>();

  public headerTemplate = contentChild<TemplateRef<any>>('header');
  public itemTemplate = contentChild<TemplateRef<any>>('item');
  public listItemTemplate = contentChild<TemplateRef<any>>('listitem');
  public gridItemTemplate = contentChild<TemplateRef<any>>('griditem');

  public totalRecordsCount = computed(() => this.value().length);

  public displayedValue = computed(() => {
    const data = this.value();
    if (!this.paginator()) {
      return data;
    }
    const start = this.first();
    const r = this.rows() || 6;
    return data.slice(start, start + r);
  });

  public setLayout(l: GpDataViewLayout): void {
    this.layout.set(l);
    this.onLayoutChange.emit(l);
  }

  public onPaginationChange(state: GpPageState): void {
    this.first.set(state.first);
    this.rows.set(state.rows);
    this.onPage.emit(state);
  }
}
