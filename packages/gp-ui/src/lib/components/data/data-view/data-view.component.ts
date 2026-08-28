import { GpBaseComponent } from '../../../base/gp-base.component';
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
import { GpIconComponent } from '../../../icons/icon.component';
import { GpPaginatorComponent, GpPageState } from '../paginator/paginator.component';

export type GpDataViewLayout = 'list' | 'grid';

@Component({
  selector: 'gp-data-view',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpPaginatorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './data-view.component.html',
  styleUrl: './data-view.component.scss'
})
export class GpDataViewComponent extends GpBaseComponent {
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
