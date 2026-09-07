import { Directive, input, signal, computed, inject, SimpleChanges } from '@angular/core';
import { UniqueId } from '../../utils/unique-id';
import { GpTranslationService } from '../../services/translation.service';
import type { GpLifecycle } from '../../interfaces/gp-lifecycle.interface';
import type { TranslationKey } from '../../types/translation-key.type';
import type { TranslationParams } from '../../types/translation-params.type';

/**
 * Base Component Directive for all gp-analytics UI components, mirroring the gp-ui GpBase architecture.
 * Provides consistent id generation, custom styling hooks, accessibility, loading and disabled states,
 * and safe Angular lifecycle hook wrapping.
 */
@Directive()
export abstract class GpAnalyticsBase implements GpLifecycle {
  /** Injected translation service for centralized i18n / localization */
  public translationService = inject(GpTranslationService);

  /** Injected translation service alias for backward compatibility */
  public readonly i18n = this.translationService;

  /** Unique element identifier */
  public id = input<string>(UniqueId.generate('gp_ana_'));

  /** Input signal for consumer-provided input identifier */
  public inputIdInput = input<string>('', { alias: 'inputId' });

  /** Component-level generated default input identifier */
  public defaultInputId = signal<string>('');

  /** Fallback input identifier if not specified at component level or consumer level */
  private readonly fallbackInputId: string = UniqueId.generate('gp_ana_input_');

  /** Unique input identifier for native form controls, labels, and aria associations */
  public inputId = computed<string>(() => {
    const custom = this.inputIdInput();
    if (custom) {
      return custom;
    }
    const compDefault = this.defaultInputId();
    if (compDefault) {
      return compDefault;
    }
    return this.fallbackInputId;
  });

  /** Custom CSS classes applied to host or root container */
  public styleClass = input<string>('');

  /** Custom inline styles applied to host or root container */
  public style = input<{ [klass: string]: any } | null>(null);

  /** Accessible label for screen readers */
  public ariaLabel = input<string>('');

  /** Accessible labelledby id for screen readers */
  public ariaLabelledBy = input<string>('');

  /** Accessible describedby id for screen readers (e.g. error messages or help text) */
  public ariaDescribedBy = input<string>('');

  /** Disabled state */
  public disabled = input<boolean>(false);

  /** Loading state indicator */
  public loading = input<boolean>(false);

  /**
   * Helper method to compose CSS class strings, filtering out falsy values and appending styleClass().
   */
  public cx(...classes: (string | boolean | null | undefined)[]): string {
    return [...classes, this.styleClass()].filter(Boolean).join(' ');
  }

  /**
   * Helper translation method.
   */
  protected translate(key: TranslationKey, params: TranslationParams = {}): string {
    return this.translationService.translate(key, params);
  }

  onInit(): void {
    // NOOP - to be implemented by subclasses
  }

  onChanges(changes: SimpleChanges): void {
    // NOOP - to be implemented by subclasses
  }

  onDoCheck(): void {
    // NOOP - to be implemented by subclasses
  }

  onAfterContentInit(): void {
    // NOOP - to be implemented by subclasses
  }

  onAfterContentChecked(): void {
    // NOOP - to be implemented by subclasses
  }

  onAfterViewInit(): void {
    // NOOP - to be implemented by subclasses
  }

  onAfterViewChecked(): void {
    // NOOP - to be implemented by subclasses
  }

  onDestroy(): void {
    // NOOP - to be implemented by subclasses
  }

  /******************** Angular Lifecycle Hooks ********************/

  /**
   * ⚠ Do not override ngOnInit!
   * Use 'onInit()' in subclasses instead.
   */
  ngOnInit(): void {
    this.onInit();
  }

  /**
   * ⚠ Do not override ngOnChanges!
   * Use 'onChanges(changes: SimpleChanges)' in subclasses instead.
   */
  ngOnChanges(changes: SimpleChanges): void {
    this.onChanges(changes);
  }

  /**
   * ⚠ Do not override ngDoCheck!
   * Use 'onDoCheck()' in subclasses instead.
   */
  ngDoCheck(): void {
    this.onDoCheck();
  }

  /**
   * ⚠ Do not override ngAfterContentInit!
   * Use 'onAfterContentInit()' in subclasses instead.
   */
  ngAfterContentInit(): void {
    this.onAfterContentInit();
  }

  /**
   * ⚠ Do not override ngAfterContentChecked!
   * Use 'onAfterContentChecked()' in subclasses instead.
   */
  ngAfterContentChecked(): void {
    this.onAfterContentChecked();
  }

  /**
   * ⚠ Do not override ngAfterViewInit!
   * Use 'onAfterViewInit()' in subclasses instead.
   */
  ngAfterViewInit(): void {
    this.onAfterViewInit();
  }

  /**
   * ⚠ Do not override ngAfterViewChecked!
   * Use 'onAfterViewChecked()' in subclasses instead.
   */
  ngAfterViewChecked(): void {
    this.onAfterViewChecked();
  }

  /**
   * ⚠ Do not override ngOnDestroy!
   * Use 'onDestroy()' in subclasses instead.
   */
  ngOnDestroy(): void {
    this.onDestroy();
  }
}
