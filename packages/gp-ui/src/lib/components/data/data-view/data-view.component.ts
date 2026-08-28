import { GpBaseComponent } from '../../../base/gp-base.component';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ContentChild,
  TemplateRef,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal,
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
  private _data = signal<any[]>([]);
  public layoutSignal = signal<GpDataViewLayout>('list');
  public rowsSignal = signal<number>(6);
  public firstSignal = signal<number>(0);

  @Input()
  public set value(val: any[]) {
    this._data.set(Array.isArray(val) ? val : []);
  }
  public get value(): any[] {
    return this._data();
  }

  @Input()
  public set layout(val: GpDataViewLayout) {
    this.layoutSignal.set(val || 'list');
  }
  public get layout(): GpDataViewLayout {
    return this.layoutSignal();
  }

  @Input()
  public set rows(val: number) {
    this.rowsSignal.set(Number(val) || 6);
  }
  public get rows(): number {
    return this.rowsSignal();
  }

  @Input()
  public set first(val: number) {
    this.firstSignal.set(Number(val) || 0);
  }
  public get first(): number {
    return this.firstSignal();
  }

  @Input() layoutOptions = true;
  @Input() paginator = false;
  @Input() rowsPerPageOptions: number[] = [];

  @Output() onPage = new EventEmitter<GpPageState>();
  @Output() onLayoutChange = new EventEmitter<GpDataViewLayout>();

  @ContentChild('header') headerTemplate?: TemplateRef<any>;
  @ContentChild('item') itemTemplate?: TemplateRef<any>;
  @ContentChild('listitem') listItemTemplate?: TemplateRef<any>;
  @ContentChild('griditem') gridItemTemplate?: TemplateRef<any>;

  public totalRecordsCount = computed(() => this._data().length);

  public displayedValue = computed(() => {
    const data = this._data();
    if (!this.paginator) {
      return data;
    }
    const start = this.firstSignal();
    const r = this.rowsSignal() || 6;
    return data.slice(start, start + r);
  });

  public setLayout(l: GpDataViewLayout): void {
    this.layoutSignal.set(l);
    this.onLayoutChange.emit(l);
  }

  public onPaginationChange(state: GpPageState): void {
    this.firstSignal.set(state.first);
    this.rowsSignal.set(state.rows);
    this.onPage.emit(state);
  }
}
