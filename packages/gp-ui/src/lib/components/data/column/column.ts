import { GpBase } from '../../../base/gp-base';
import { Component, input, contentChild, TemplateRef, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'gp-column',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './column.html',
  styleUrl: './column.scss'
})
export class GpColumn extends GpBase {
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
