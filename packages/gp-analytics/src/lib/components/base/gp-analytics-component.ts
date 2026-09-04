import { Directive, inject } from '@angular/core';
import { GpTranslationService, TranslationKey } from '../../services/translation.service';

type TranslationParams = Record<string, number | string>;

@Directive()
export abstract class GpAnalyticsComponent {
  protected readonly i18n = inject(GpTranslationService);

  protected translate(key: TranslationKey, params: TranslationParams = {}): string {
    return this.i18n.translate(key, params);
  }
}
