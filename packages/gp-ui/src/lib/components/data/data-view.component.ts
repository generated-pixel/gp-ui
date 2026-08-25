import { GpEditableBaseComponent } from '../../base/gp-editable-base.component';
import { Component, Input, ContentChild, TemplateRef, ChangeDetectionStrategy, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';
import { GpPaginatorComponent, GpPageState } from './paginator.component';

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
export class GpDataViewComponent extends GpEditableBaseComponent {
  @Input() override value: any[] = [];
  @Input() layout: GpDataViewLayout = 'list';
  @Input() layoutOptions = true;
  @Input() paginator = false;
  @Input() rows = 6;

  @ContentChild('header') headerTemplate?: TemplateRef<any>;
  @ContentChild('item') itemTemplate?: TemplateRef<any>;
  @ContentChild('listitem') listItemTemplate?: TemplateRef<any>;
  @ContentChild('griditem') gridItemTemplate?: TemplateRef<any>;

  protected first = signal<number>(0);

  public setLayout(l: GpDataViewLayout): void {
    this.layout = l;
  }

  public displayedValue = () => {
    if (!this.paginator) return this.value;
    const start = this.first();
    return this.value.slice(start, start + this.rows);
  };

  public onPaginationChange(state: GpPageState): void {
    this.first.set(state.first);
    this.rows = state.rows;
  }
}
