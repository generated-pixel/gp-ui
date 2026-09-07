import {
  OnInit,
  OnChanges,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy
} from '@angular/core';

/**
 * Lifecycle hook contract for GpAnalyticsBase and GpBase components.
 * Subclasses implement hook methods (onInit, onDestroy, etc.) rather than
 * directly overriding the Angular lifecycle hooks.
 */
export interface GpLifecycle
  extends
    OnInit,
    OnChanges,
    DoCheck,
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy {}
