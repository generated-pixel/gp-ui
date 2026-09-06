import { Directive, inject } from '@angular/core';
import { GpTranslationService, TranslationKey } from '../../services/translation.service';
import { TranslationParams } from '../../types/translation-params.type';

@Directive()
export abstract class GpAnalyticsComponent {
  protected readonly i18n = inject(GpTranslationService);

  protected translate(key: TranslationKey, params: TranslationParams = {}): string {
    return this.i18n.translate(key, params);
  }
}
