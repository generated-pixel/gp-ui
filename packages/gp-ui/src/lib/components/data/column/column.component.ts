import { GpBaseComponent } from '../../../base/gp-base.component';
import { Component, Input, ContentChild, TemplateRef, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'gp-column',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: ``
})
export class GpColumnComponent extends GpBaseComponent {
  @Input() field = '';
  @Input() header = '';
  @Input() sortable = false;
  @Input() filterable = false;
  @Input() filterMatchMode = 'contains';
  @Input() width = '';
  @Input() frozen = false;
  @Input() align: 'left' | 'center' | 'right' = 'left';

  @ContentChild('header') headerTemplate?: TemplateRef<any>;
  @ContentChild('body') bodyTemplate?: TemplateRef<any>;
  @ContentChild('filter') filterTemplate?: TemplateRef<any>;
}
