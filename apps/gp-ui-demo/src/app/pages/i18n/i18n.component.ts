import { Component, inject, signal } from '@angular/core';

import {
  GpButtonComponent,
  GpDatePickerComponent,
  GpPaginatorComponent,
  GpConfirmDialogComponent,
  GpConfirmationService,
  GpTranslationService,
  GpDirectionService,
  GP_DEFAULT_TRANSLATION,
  GP_SPANISH_TRANSLATION,
  GP_GERMAN_TRANSLATION,
  GP_ARABIC_TRANSLATION
} from 'gp-ui';

@Component({
  selector: 'app-i18n-page',
  standalone: true,
  imports: [GpButtonComponent, GpDatePickerComponent, GpPaginatorComponent, GpConfirmDialogComponent],
  template: `
    <div class="page-container">
      <gp-confirm-dialog />

      <div class="page-header">
        <h1>Internationalization (i18n) & RTL</h1>
        <p class="page-desc">
          gp-ui supports configurable translation bundles, locale-aware date/number formatting, and bidirectional
          (LTR/RTL) rendering.
        </p>
      </div>

      <div class="doc-section">
        <h2 class="doc-section-title">Active Locale: {{ activeLocale() }}</h2>
        <div class="locale-buttons">
          <gp-button label="English (LTR)" (onClickEvent)="setLocale('English', enBundle, 'ltr')" />
          <gp-button
            label="Español (LTR)"
            severity="secondary"
            (onClickEvent)="setLocale('Español', esBundle, 'ltr')"
          />
          <gp-button
            label="Deutsch (LTR)"
            severity="secondary"
            (onClickEvent)="setLocale('Deutsch', deBundle, 'ltr')"
          />
          <gp-button label="العربية (RTL)" severity="secondary" (onClickEvent)="setLocale('Arabic', arBundle, 'rtl')" />
        </div>
      </div>

      <div class="doc-section">
        <h2 class="doc-section-title">Locale-Aware Date Picker</h2>
        <div class="doc-demo-box">
          <gp-date-picker [inline]="true" />
        </div>
      </div>

      <div class="doc-section">
        <h2 class="doc-section-title">Localized Pagination & Buttons</h2>
        <div class="doc-demo-box">
          <gp-paginator [totalRecords]="50" [rows]="10" />
        </div>
      </div>

      <div class="doc-section">
        <h2 class="doc-section-title">Confirmation Dialog i18n</h2>
        <div class="doc-demo-box">
          <gp-button label="Trigger Localized Dialog" severity="warning" (onClickEvent)="confirm()" />
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .locale-buttons {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
      }
    `
  ]
})
export class I18nPageComponent {
  private translationService = inject(GpTranslationService);
  private directionService = inject(GpDirectionService);
  private confirmationService = inject(GpConfirmationService);

  protected activeLocale = signal<string>('English');

  enBundle = GP_DEFAULT_TRANSLATION;
  esBundle = GP_SPANISH_TRANSLATION;
  deBundle = GP_GERMAN_TRANSLATION;
  arBundle = GP_ARABIC_TRANSLATION;

  public setLocale(name: string, bundle: any, dir: 'ltr' | 'rtl'): void {
    this.activeLocale.set(name);
    this.translationService.setTranslation(bundle);
    this.directionService.setDirection(dir);
  }

  public confirm(): void {
    this.confirmationService.confirm({
      header: this.translationService.get('accept') + ' / ' + this.translationService.get('reject'),
      message: 'Perform localized action?',
      acceptLabel: this.translationService.get('accept'),
      rejectLabel: this.translationService.get('reject')
    });
  }
}
