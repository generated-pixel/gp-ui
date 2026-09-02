import { GpBaseComponent } from '../../../base/gp-base.component';
import { Component, input, contentChild, TemplateRef, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'gp-column',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './column.component.html',
  styleUrl: './column.component.scss'
})
export class GpColumnComponent extends GpBaseComponent {
  public field = input<string>('');
  public header = input<string>('');
  public sortable = input<boolean>(false);
  public filterable = input<boolean>(false);
  public filterMatchMode = input<string>('contains');
  public width = input<string>('');
  public frozen = input<boolean>(false);
  public align = input<'left' | 'center' | 'right'>('left');

  public headerTemplate = contentChild<TemplateRef<any>>('header');
  public bodyTemplate = contentChild<TemplateRef<any>>('body');
  public filterTemplate = contentChild<TemplateRef<any>>('filter');
}
