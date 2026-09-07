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
  GpDirectionService,
  GpLocaleService,
  GpNumberFormat,
  GpDateTimeFormat,
  GpListFormat,
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
  template: `
    <div class="page-container">
      <gp-confirm-dialog />

      <!-- Page Header -->
      <div class="page-header">
        <div class="header-badges">
          <gp-tag value="Intl ECMA-402 Native" severity="primary" [rounded]="true" />
          <gp-tag value="100% Signal Reactive" severity="success" [rounded]="true" />
          <gp-tag value="10 Standalone Pipes" severity="info" [rounded]="true" />
        </div>
        <h1>Internationalization (i18n) &amp; Locale Conversions</h1>
        <p class="page-desc">
          Enterprise localization suite for gp-ui. Includes bidirectional localized number parsing, currency formatting,
          timezone world conversions, relative time, duration calculations, natural list joining, collation sorting, and
          standalone Angular pipes.
        </p>
      </div>

      <!-- Quick Preset Bar -->
      <div class="doc-section">
        <div class="section-top">
          <h2 class="doc-section-title">Active Environment: {{ activeLocaleName() }} ({{ localeService.locale() }})</h2>
          <div class="locale-badges">
            <span class="meta-pill"><strong>Direction:</strong> {{ localeService.direction().toUpperCase() }}</span>
            <span class="meta-pill"><strong>Currency:</strong> {{ localeService.currency() }}</span>
            <span class="meta-pill"><strong>Timezone:</strong> {{ localeService.timeZone() }}</span>
            <span class="meta-pill"
              ><strong>Decimal:</strong> <code>{{ localeService.separators().decimal }}</code></span
            >
            <span class="meta-pill"
              ><strong>Group:</strong> <code>{{ localeService.separators().group }}</code></span
            >
          </div>
        </div>

        <div class="locale-buttons">
          @for (preset of presets; track preset.code) {
            <gp-button
              [label]="preset.flag + ' ' + preset.name"
              [severity]="localeService.locale() === preset.code ? 'primary' : 'secondary'"
              [variant]="localeService.locale() === preset.code ? 'filled' : 'outlined'"
              (onClickEvent)="selectPreset(preset)"
            />
          }
        </div>
      </div>

      <!-- Section 1: Number Conversions & Live Parser -->
      <div class="doc-section">
        <h2 class="doc-section-title">1. Numeric Conversions &amp; Bidirectional Parser</h2>
        <p class="section-subtext">
          Automatic grouping and decimal separators, currency symbols, percentages, compact notation, units, and file
          sizes.
        </p>

        <div class="grid-cards">
          <div class="stat-card">
            <span class="stat-label">Standard Number (1,234,567.89)</span>
            <span class="stat-val">{{ 1234567.89 | gpNumber: { minimumFractionDigits: 2 } }}</span>
            <span class="stat-meta">Locale-formatted float</span>
          </div>

          <div class="stat-card">
            <span class="stat-label">Currency ({{ localeService.currency() }})</span>
            <span class="stat-val accent">{{ sampleAmount | gpCurrency: localeService.currency() }}</span>
            <span class="stat-meta">Accounting &amp; ISO 4217 standard</span>
          </div>

          <div class="stat-card">
            <span class="stat-label">Percentage (Ratio 0.3456)</span>
            <span class="stat-val">{{ 0.3456 | gpPercent: 2 }}</span>
            <span class="stat-meta">Ratio to localized percent</span>
          </div>

          <div class="stat-card">
            <span class="stat-label">Compact Metric (2,450,000)</span>
            <span class="stat-val">{{ 2450000 | gpCompactNumber }}</span>
            <span class="stat-meta">Short notation</span>
          </div>

          <div class="stat-card">
            <span class="stat-label">File Size (15,728,640 bytes)</span>
            <span class="stat-val">{{ 15728640 | gpByteSize: 'binary' : 2 }}</span>
            <span class="stat-meta">Binary IEC (MiB) or Metric (MB)</span>
          </div>

          <div class="stat-card">
            <span class="stat-label">Ordinal Number (Rank 1, 2, 3)</span>
            <span class="stat-val"
              >{{ 1 | gpOrdinal }}, {{ 2 | gpOrdinal }}, {{ 3 | gpOrdinal }}, {{ 21 | gpOrdinal }}</span
            >
            <span class="stat-meta">Intl.PluralRules ordinal</span>
          </div>
        </div>

        <!-- Live Bidirectional Parser Sandbox -->
        <div class="sandbox-box">
          <div class="sandbox-header">
            <h3><gp-icon name="filter" /> Live Localized String-to-Number Parser</h3>
            <span class="sandbox-sub"
              >Try typing numbers formatted in German, French, Arabic, Swiss, or accounting format!</span
            >
          </div>

          <div class="sandbox-row">
            <div class="input-wrap">
              <label>Enter any localized formatted string:</label>
              <input
                type="text"
                class="demo-input"
                [ngModel]="parseInput()"
                (ngModelChange)="parseInput.set($event)"
                placeholder="e.g. 1.234.567,89 € or (1,234.50) or 45.5%"
              />
              <div class="quick-examples">
                <span class="ex-label">Quick test presets:</span>
                <button class="ex-btn" (click)="setParseExample('1.234.567,89 €')">1.234.567,89 €</button>
                <button class="ex-btn" (click)="setParseExample('(5,432.10)')">(5,432.10)</button>
                <button class="ex-btn" (click)="setParseExample('١٬٢٣٤٫٥٦')">١٬٢٣٤٫٥٦</button>
                <button class="ex-btn" (click)="setSwiss()">1'234'567.89</button>
                <button class="ex-btn" (click)="setParseExample('1 234 567,89')">1 234 567,89</button>
                <button class="ex-btn" (click)="setParseExample('45.5%')">45.5%</button>
              </div>
            </div>

            <div class="result-box">
              <div class="result-item">
                <span class="res-label">Parsed JavaScript Number (Float):</span>
                <code class="res-code">{{ parsedNumberResult() }}</code>
              </div>
              <div class="result-item">
                <span class="res-label">Parsed as Ratio (0-1):</span>
                <code class="res-code">{{ parsedRatioResult() }}</code>
              </div>
              <div class="result-item">
                <span class="res-label">Re-formatted in Active Locale:</span>
                <span class="res-highlight">{{ parsedFormattedResult() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 2: DateTime & Timezone World Engine -->
      <div class="doc-section">
        <h2 class="doc-section-title">2. DateTime &amp; Timezone World Engine</h2>
        <p class="section-subtext">
          Convert timestamps across global time zones, compute DST status, relative time, and human-readable durations.
        </p>

        <div class="tz-controls">
          <label>Select Target World Timezone:</label>
          <div class="tz-buttons">
            @for (tz of commonTimeZones; track tz.timeZone) {
              <button
                class="tz-btn"
                [class.active]="selectedTimeZone() === tz.timeZone"
                (click)="selectedTimeZone.set(tz.timeZone)"
              >
                {{ tz.city }} ({{ tz.region }})
              </button>
            }
          </div>
        </div>

        <div class="grid-cards">
          <div class="stat-card">
            <span class="stat-label">Selected Timezone</span>
            <span class="stat-val small">{{ selectedTimeZone() }}</span>
            <span class="stat-meta"
              >Offset: {{ tzInfo().offsetString }} | {{ tzInfo().abbreviation }} (DST:
              {{ tzInfo().isDST ? 'Active' : 'Standard' }})</span
            >
          </div>

          <div class="stat-card">
            <span class="stat-label">Full Date &amp; Time</span>
            <span class="stat-val medium">{{ now() | gpDate: 'full' : selectedTimeZone() }}</span>
            <span class="stat-meta">Preset: 'full'</span>
          </div>

          <div class="stat-card">
            <span class="stat-label">Short Date &amp; Medium Time</span>
            <span class="stat-val medium"
              >{{ now() | gpDate: 'shortDate' : selectedTimeZone() }}
              {{ now() | gpDate: 'mediumTime' : selectedTimeZone() }}</span
            >
            <span class="stat-meta">Preset: 'shortDate' &amp; 'mediumTime'</span>
          </div>

          <div class="stat-card">
            <span class="stat-label">ISO 8601 Standard</span>
            <span class="stat-val small"
              ><code>{{ now() | gpDate: 'iso' }}</code></span
            >
            <span class="stat-meta">Universal UTC wire format</span>
          </div>
        </div>

        <!-- Relative Time & Duration Sandbox -->
        <div class="sandbox-box mt-3">
          <div class="sandbox-header">
            <h3><gp-icon name="calendar" /> Relative Time &amp; Duration Formatter</h3>
          </div>
          <div class="relative-grid">
            <div class="rel-col">
              <h4>Relative Time (Live)</h4>
              <ul class="rel-list">
                <li>
                  <span>5 minutes ago:</span> <strong>{{ fiveMinutesAgo | gpRelativeTime }}</strong>
                </li>
                <li>
                  <span>3 hours ago:</span> <strong>{{ threeHoursAgo | gpRelativeTime }}</strong>
                </li>
                <li>
                  <span>Yesterday:</span> <strong>{{ yesterday | gpRelativeTime }}</strong>
                </li>
                <li>
                  <span>In 2 days:</span> <strong>{{ inTwoDays | gpRelativeTime }}</strong>
                </li>
              </ul>
            </div>
            <div class="rel-col">
              <h4>Duration Formats (3,665 seconds)</h4>
              <ul class="rel-list">
                <li>
                  <span>Digital style:</span> <strong>{{ 3665 | gpDuration: 'digital' }}</strong>
                </li>
                <li>
                  <span>Long style:</span> <strong>{{ 3665 | gpDuration: 'long' }}</strong>
                </li>
                <li>
                  <span>Short style:</span> <strong>{{ 3665 | gpDuration: 'short' }}</strong>
                </li>
                <li>
                  <span>Narrow style:</span> <strong>{{ 3665 | gpDuration: 'narrow' }}</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 3: Lists, Sorting & Text Utilities -->
      <div class="doc-section">
        <h2 class="doc-section-title">3. Natural Lists &amp; Localized Collation</h2>
        <p class="section-subtext">
          Format string arrays into natural grammatical sentences and sort strings with natural numeric ordering.
        </p>

        <div class="grid-cards">
          <div class="stat-card">
            <span class="stat-label">Conjunction List (gpList)</span>
            <span class="stat-val medium">{{ sampleFrameworks | gpList: 'conjunction' }}</span>
            <span class="stat-meta">Grammatically joined ("and")</span>
          </div>

          <div class="stat-card">
            <span class="stat-label">Disjunction List</span>
            <span class="stat-val medium">{{ sampleChoices | gpList: 'disjunction' }}</span>
            <span class="stat-meta">Joined with "or"</span>
          </div>

          <div class="stat-card">
            <span class="stat-label">Natural Numeric Collation Sort</span>
            <span class="stat-val small">{{ sortedFiles().join(', ') }}</span>
            <span class="stat-meta">"file2" naturally before "file10"</span>
          </div>

          <div class="stat-card">
            <span class="stat-label">Phone &amp; Name Helpers</span>
            <span class="stat-val small">{{ formattedPhone() }} | Initials: {{ initials() }}</span>
            <span class="stat-meta">Clean E.164 &amp; cultural ordering</span>
          </div>
        </div>
      </div>

      <!-- Section 4: Existing Components with Active Locale -->
      <div class="doc-section">
        <h2 class="doc-section-title">4. Localized gp-ui Components Integration</h2>
        <div class="components-row">
          <div class="component-card">
            <h4>Date Picker with Active Locale</h4>
            <gp-date-picker [inline]="true" />
          </div>
          <div class="component-card">
            <h4>Pagination &amp; Dialog</h4>
            <gp-paginator [totalRecords]="100" [rows]="10" />
            <div style="margin-top: 1.5rem;">
              <gp-button label="Trigger Localized Dialog" severity="warning" (onClickEvent)="confirm()" />
            </div>
          </div>
        </div>
      </div>

      <!-- Section 5: Developer Code Guide -->
      <div class="doc-section">
        <h2 class="doc-section-title">5. Developer Quick Start &amp; Usage</h2>
        <p class="section-subtext">
          Import standalone pipes via <code>GP_I18N_PIPES</code> or inject <code>GpLocaleService</code> in services and
          components.
        </p>

        <doc-code [code]="pipesExampleCode" language="html" />
        <doc-code [code]="serviceExampleCode" language="typescript" />
      </div>
    </div>
  `,
  styles: [
    `
      .page-container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }
      .page-header {
        margin-bottom: 2rem;
      }
      .header-badges {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
        flex-wrap: wrap;
      }
      .page-desc {
        color: var(--gp-text-muted, #94a3b8);
        font-size: 1.05rem;
        line-height: 1.6;
        max-width: 850px;
      }
      .doc-section {
        background: var(--gp-surface-card, #1e293b);
        border: 1px solid var(--gp-border, rgba(255, 255, 255, 0.08));
        border-radius: 12px;
        padding: 1.75rem;
        margin-bottom: 2rem;
      }
      .section-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
        margin-bottom: 1rem;
      }
      .doc-section-title {
        font-size: 1.35rem;
        font-weight: 700;
        margin: 0 0 0.5rem 0;
        color: var(--gp-text-primary, #f8fafc);
      }
      .section-subtext {
        color: var(--gp-text-muted, #94a3b8);
        margin: 0 0 1.5rem 0;
        font-size: 0.95rem;
      }
      .locale-badges {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      .meta-pill {
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 0.25rem 0.6rem;
        border-radius: 6px;
        font-size: 0.8rem;
        color: #cbd5e1;
      }
      .meta-pill code {
        color: #38bdf8;
        font-weight: 700;
      }
      .locale-buttons {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
      }
      .grid-cards {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
      }
      .stat-card {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 8px;
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
      }
      .stat-label {
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #94a3b8;
      }
      .stat-val {
        font-size: 1.4rem;
        font-weight: 700;
        color: #f1f5f9;
        font-variant-numeric: tabular-nums;
      }
      .stat-val.accent {
        color: #38bdf8;
      }
      .stat-val.medium {
        font-size: 1.1rem;
      }
      .stat-val.small {
        font-size: 0.95rem;
      }
      .stat-meta {
        font-size: 0.75rem;
        color: #64748b;
      }
      .sandbox-box {
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid rgba(56, 189, 248, 0.2);
        border-radius: 8px;
        padding: 1.5rem;
      }
      .sandbox-header {
        margin-bottom: 1.25rem;
      }
      .sandbox-header h3 {
        margin: 0 0 0.25rem 0;
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #38bdf8;
      }
      .sandbox-sub {
        font-size: 0.85rem;
        color: #94a3b8;
      }
      .sandbox-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
      }
      @media (max-width: 768px) {
        .sandbox-row {
          grid-template-columns: 1fr;
        }
      }
      .input-wrap label {
        display: block;
        font-size: 0.85rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #cbd5e1;
      }
      .demo-input {
        width: 100%;
        box-sizing: border-box;
        padding: 0.75rem 1rem;
        background: #0f172a;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 6px;
        color: #ffffff;
        font-size: 1.05rem;
        outline: none;
        transition: border-color 0.2s;
      }
      .demo-input:focus {
        border-color: #38bdf8;
      }
      .quick-examples {
        margin-top: 0.75rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        align-items: center;
      }
      .ex-label {
        font-size: 0.75rem;
        color: #64748b;
      }
      .ex-btn {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.12);
        color: #cbd5e1;
        border-radius: 4px;
        padding: 0.2rem 0.5rem;
        font-size: 0.75rem;
        cursor: pointer;
        transition: all 0.15s;
      }
      .ex-btn:hover {
        background: rgba(56, 189, 248, 0.2);
        color: #38bdf8;
      }
      .result-box {
        background: #020617;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 6px;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        justify-content: center;
      }
      .result-item {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
      }
      .res-label {
        font-size: 0.75rem;
        color: #94a3b8;
      }
      .res-code {
        font-family: monospace;
        font-size: 1.15rem;
        color: #38bdf8;
        font-weight: 700;
      }
      .res-highlight {
        font-size: 1.15rem;
        color: #34d399;
        font-weight: 700;
      }
      .tz-controls {
        margin-bottom: 1.25rem;
      }
      .tz-controls label {
        display: block;
        font-size: 0.85rem;
        font-weight: 600;
        color: #cbd5e1;
        margin-bottom: 0.5rem;
      }
      .tz-buttons {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
      .tz-btn {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: #cbd5e1;
        padding: 0.35rem 0.75rem;
        border-radius: 6px;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.2s;
      }
      .tz-btn.active {
        background: #38bdf8;
        color: #0f172a;
        font-weight: 700;
        border-color: #38bdf8;
      }
      .relative-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }
      @media (max-width: 640px) {
        .relative-grid {
          grid-template-columns: 1fr;
        }
      }
      .rel-col h4 {
        margin: 0 0 0.75rem 0;
        font-size: 0.95rem;
        color: #38bdf8;
      }
      .rel-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .rel-list li {
        display: flex;
        justify-content: space-between;
        font-size: 0.9rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        padding-bottom: 0.3rem;
      }
      .rel-list li span {
        color: #94a3b8;
      }
      .rel-list li strong {
        color: #f8fafc;
      }
      .components-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }
      @media (max-width: 768px) {
        .components-row {
          grid-template-columns: 1fr;
        }
      }
      .component-card {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 8px;
        padding: 1.25rem;
      }
      .component-card h4 {
        margin: 0 0 1rem 0;
        font-size: 1rem;
        color: #cbd5e1;
      }
      .mt-3 {
        margin-top: 1.5rem;
      }
    `
  ]
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
    if (isNaN(num)) return '-';
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
