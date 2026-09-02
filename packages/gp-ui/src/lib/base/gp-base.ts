import {
  Directive,
  input,
  OnInit,
  OnChanges,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy,
  SimpleChanges
} from '@angular/core';
import { UniqueId } from '../utils/unique-id';

/**
 * Base Component for all gp-ui UI components.
 * Provides consistent id generation, custom styling hooks, accessibility, and disabled state.
 */
@Directive()
export abstract class GpBase
  implements OnInit, OnChanges, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy
{
  /** Unique element identifier */
  public id = input<string>(UniqueId.generate('gp_'));

  /** Custom CSS classes applied to host or root container */
  public styleClass = input<string>('');

  /** Custom inline styles applied to host or root container */
  public style = input<{ [klass: string]: any } | null>(null);

  /** Accessible label for screen readers */
  public ariaLabel = input<string>('');

  /** Disabled state */
  public disabled = input<boolean>(false);

  onInit() {
    // NOOP - to be implemented by subclasses
  }

  onChanges(changes: SimpleChanges) {
    // NOOP - to be implemented by subclasses
  }

  onDoCheck() {
    // NOOP - to be implemented by subclasses
  }

  onAfterContentInit() {
    // NOOP - to be implemented by subclasses
  }

  onAfterContentChecked() {
    // NOOP - to be implemented by subclasses
  }

  onAfterViewInit() {
    // NOOP - to be implemented by subclasses
  }

  onAfterViewChecked() {
    // NOOP - to be implemented by subclasses
  }

  onDestroy() {
    // NOOP - to be implemented by subclasses
  }

  /******************** Angular Lifecycle Hooks ********************/

  /**
   * ⚠ Do not override ngOnInit!
   *
   * Use 'onInit()' in subclasses instead.
   */
  ngOnInit() {
    this.onInit();
  }

  /**
   * ⚠ Do not override ngOnChanges!
   *
   * Use 'onChanges(changes: SimpleChanges)' in subclasses instead.
   */
  ngOnChanges(changes: SimpleChanges) {
    this.onChanges(changes);
  }

  /**
   * ⚠ Do not override ngDoCheck!
   *
   * Use 'onDoCheck()' in subclasses instead.
   */
  ngDoCheck() {
    this.onDoCheck();
  }

  /**
   * ⚠ Do not override ngAfterContentInit!
   *
   * Use 'onAfterContentInit()' in subclasses instead.
   */
  ngAfterContentInit() {
    this.onAfterContentInit();
  }

  /**
   * ⚠ Do not override ngAfterContentChecked!
   *
   * Use 'onAfterContentChecked()' in subclasses instead.
   */
  ngAfterContentChecked() {
    this.onAfterContentChecked();
  }

  /**
   * ⚠ Do not override ngAfterViewInit!
   *
   * Use 'onAfterViewInit()' in subclasses instead.
   */
  ngAfterViewInit() {
    this.onAfterViewInit();
  }

  /**
   * ⚠ Do not override ngAfterViewChecked!
   *
   * Use 'onAfterViewChecked()' in subclasses instead.
   */
  ngAfterViewChecked() {
    this.onAfterViewChecked();
  }

  /**
   * ⚠ Do not override ngOnDestroy!
   *
   * Use 'onDestroy()' in subclasses instead.
   */
  ngOnDestroy() {
    this.onDestroy();
  }
}
