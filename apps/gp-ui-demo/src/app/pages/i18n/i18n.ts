import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  GpButton,
  GpTag,
  GpIcon,
  GpDatePicker,
  GpPaginator,
  GpConfirmDialog,
  GpConfirmationService,
  GpTranslationService,
  GpLocaleService,
  GpNumberFormat,
  GpDateTimeFormat,
  GpCollator,
  GpPhoneFormat,
  GpNameFormat,
  GP_I18N_PIPES,
  GP_COMMON_TIMEZONES,
  GP_DEFAULT_TRANSLATION,
  GP_SPANISH_TRANSLATION,
  GP_GERMAN_TRANSLATION,
  GP_ARABIC_TRANSLATION
} from 'gp-ui';
import { DocCode } from '../../shared/doc-code';

interface LocalePreset {
  name: string;
  code: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  currency: string;
  bundle: any;
}

@Component({
  selector: 'app-i18n-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GpButton,
    GpTag,
    GpIcon,
    GpDatePicker,
    GpPaginator,
    GpConfirmDialog,
    DocCode,
    GP_I18N_PIPES
  ],
  templateUrl: './i18n.html',
  styleUrl: './i18n.scss'
})
export class I18nPage {
  public localeService = inject(GpLocaleService);
  private translationService = inject(GpTranslationService);
  private confirmationService = inject(GpConfirmationService);

  public now = signal<Date>(new Date());
  public sampleAmount = 1450.99;
  public selectedTimeZone = signal<string>('UTC');

  public parseInput = signal<string>('1.234.567,89 €');

  public parsedNumberResult = computed(() => {
    const res = GpNumberFormat.parse(this.parseInput(), this.localeService.locale());
    return isNaN(res) ? 'Invalid number format' : String(res);
  });

  public parsedRatioResult = computed(() => {
    const res = GpNumberFormat.parse(this.parseInput(), this.localeService.locale(), { parseAsRatio: true });
    return isNaN(res) ? 'N/A' : String(res);
  });

  public parsedFormattedResult = computed(() => {
    const num = GpNumberFormat.parse(this.parseInput(), this.localeService.locale());
    if (isNaN(num)) {
      return '-';
    }
    return GpNumberFormat.format(num, { minimumFractionDigits: 2 }, this.localeService.locale());
  });

  public tzInfo = computed(() => GpDateTimeFormat.getTimeZoneOffset(this.selectedTimeZone(), this.now()));

  public commonTimeZones = GP_COMMON_TIMEZONES.slice(0, 8);

  public sampleFrameworks = ['Angular', 'TypeScript', 'Signals', 'Vite'];
  public sampleChoices = ['Credit Card', 'PayPal', 'Apple Pay'];

  public sortedFiles = computed(() => {
    const files = ['file10.ts', 'file2.ts', 'file1.ts', 'file20.ts'];
    return GpCollator.sort(files, undefined, undefined, this.localeService.locale());
  });

  public formattedPhone = computed(() => GpPhoneFormat.format('5551234567', 'international'));
  public initials = computed(() => GpNameFormat.initials('Graeme Gorman'));

  public fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  public threeHoursAgo = new Date(Date.now() - 3 * 3600 * 1000);
  public yesterday = new Date(Date.now() - 86400 * 1000);
  public inTwoDays = new Date(Date.now() + 2 * 86400 * 1000);

  public presets: LocalePreset[] = [
    { name: 'English (US)', code: 'en-US', flag: '🇺🇸', dir: 'ltr', currency: 'USD', bundle: GP_DEFAULT_TRANSLATION },
    { name: 'Deutsch (DE)', code: 'de-DE', flag: '🇩🇪', dir: 'ltr', currency: 'EUR', bundle: GP_GERMAN_TRANSLATION },
    { name: 'Français (FR)', code: 'fr-FR', flag: '🇫🇷', dir: 'ltr', currency: 'EUR', bundle: GP_DEFAULT_TRANSLATION },
    { name: 'Español (ES)', code: 'es-ES', flag: '🇪🇸', dir: 'ltr', currency: 'EUR', bundle: GP_SPANISH_TRANSLATION },
    { name: '日本語 (JP)', code: 'ja-JP', flag: '🇯🇵', dir: 'ltr', currency: 'JPY', bundle: GP_DEFAULT_TRANSLATION },
    { name: 'العربية (AE)', code: 'ar-AE', flag: '🇦🇪', dir: 'rtl', currency: 'AED', bundle: GP_ARABIC_TRANSLATION },
    { name: 'English (UK)', code: 'en-GB', flag: '🇬🇧', dir: 'ltr', currency: 'GBP', bundle: GP_DEFAULT_TRANSLATION }
  ];

  public activeLocaleName = computed(() => {
    const cur = this.localeService.locale();
    const found = this.presets.find((p) => p.code === cur);
    return found ? found.name : cur;
  });

  public selectPreset(preset: LocalePreset): void {
    this.localeService.setLocale(preset.code);
    this.localeService.setCurrency(preset.currency);
    this.translationService.setTranslation(preset.bundle);
  }

  public setParseExample(val: string): void {
    this.parseInput.set(val);
  }

  public setSwiss(): void {
    this.parseInput.set("1'234'567.89");
  }

  public confirm(): void {
    this.confirmationService.confirm({
      header: this.translationService.get('accept') + ' / ' + this.translationService.get('reject'),
      message: 'Perform localized action?',
      acceptLabel: this.translationService.get('accept'),
      rejectLabel: this.translationService.get('reject')
    });
  }

  public pipesExampleCode = `<!-- Import GP_I18N_PIPES in your standalone component -->
import { Component } from '@angular/core';
import { GP_I18N_PIPES } from 'gp-ui';

@Component({
  standalone: true,
  imports: [GP_I18N_PIPES],
  template: \`
    <!-- Number & Currency Formatting -->
    <span>{{ amount | gpNumber: { minimumFractionDigits: 2 } }}</span>
    <span>{{ price | gpCurrency: 'EUR' }}</span>
    <span>{{ ratio | gpPercent: 1 }}</span>
    <span>{{ followers | gpCompactNumber }}</span>
    <span>{{ fileSize | gpByteSize: 'binary' : 2 }}</span>
    <span>{{ rank | gpOrdinal }}</span>

    <!-- DateTime, Timezone & Relative Time -->
    <span>{{ orderDate | gpDate: 'full' : 'Asia/Tokyo' }}</span>
    <span>{{ updatedDate | gpRelativeTime }}</span>
    <span>{{ elapsedSeconds | gpDuration: 'digital' }}</span>

    <!-- Natural Lists -->
    <span>{{ tags | gpList: 'conjunction' }}</span>
  \`
})
export class MyComponent {
  amount = 1234567.89;
  price = 49.99;
  ratio = 0.456;
  followers = 2500000;
  fileSize = 10485760;
  rank = 1;
  orderDate = new Date();
  updatedDate = new Date(Date.now() - 300000);
  elapsedSeconds = 3665;
  tags = ['Angular', 'TypeScript', 'Signals'];
}`;

  public serviceExampleCode = `// Inject GpLocaleService for global signals and bidirectional conversion
import { Component, inject } from '@angular/core';
import { GpLocaleService, GpNumberFormat, GpDateTimeFormat } from 'gp-ui';

@Component({ ... })
export class MyServiceOrComponent {
  private localeService = inject(GpLocaleService);

  // Switch locale or currency globally anytime
  changeToGerman() {
    this.localeService.setLocale('de-DE');
    this.localeService.setCurrency('EUR');
    this.localeService.setTimeZone('Europe/Berlin');
  }

  // Bidirectional string-to-number parsing (handles European dots/commas, Swiss apostrophes, Arabic numerals)
  parseInput(userInput: string) {
    const rawNumber = this.localeService.parseNumber(userInput); // e.g. "1.234,56 €" -> 1234.56
    console.log('Parsed number:', rawNumber);
  }

  // Pure TS utilities (usable without Angular context too!)
  calculateTimezone() {
    const nyDate = GpDateTimeFormat.toTimeZone(new Date(), 'America/New_York');
    const offset = GpDateTimeFormat.getTimeZoneOffset('America/New_York');
    console.log('NY Offset:', offset.offsetString); // e.g. -04:00
  }
}`;
}
