import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { Field, FieldDataType } from '../../../interfaces/field';
import { GpIconMapperService } from '../../../icons/gp-icon-mapper.service';
import { GP_ANALYTICS_TRANSLATIONS } from '../../../tokens/gp-analytics.token';
import { GpIcon } from '../../icon/icon';

@Component({
  selector: 'gp-field-item',
  imports: [GpIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './field-item.html',
  styleUrls: ['./field-item.css'],
})
export class FieldItem {
  readonly field = input.required<Field>();

  protected readonly t = inject(GP_ANALYTICS_TRANSLATIONS);
  private readonly iconMapper = inject(GpIconMapperService);
  protected readonly typeLabels = computed<Record<FieldDataType, string>>(() => ({
    string: this.t.fieldTypeLabelString,
    number: this.t.fieldTypeLabelNumber,
    integer: this.t.fieldTypeLabelInteger,
    boolean: this.t.fieldTypeLabelBoolean,
    date: this.t.fieldTypeLabelDate,
    datetime: this.t.fieldTypeLabelDateTime,
    time: this.t.fieldTypeLabelTime,
  }));
  protected readonly typeIcon = computed(() => this.iconMapper.fieldType(this.field().dataType));
  protected readonly typeLabel = computed(() => this.typeLabels()[this.field().dataType] ?? '?');
  protected readonly displayName = computed(() => this.field().label ?? this.field().name);
}
