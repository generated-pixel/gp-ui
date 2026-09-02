import { Directive, DestroyRef, inject, input, output, computed, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { GpGridItem } from '../models/grid-item.model';
import { GpWidgetDataSource, GpWidgetNavigationConfig } from '../models/grid-widget.model';
import {
  createWidgetDataResolver,
  executeWidgetNavigation,
  GpResolvedWidgetState
} from '../services/widget-data-resolver';

/**
 * Base class for all typed and custom widgets in gp-grid.
 * Encapsulates reactive data source resolution, loading and error lifecycle states,
 * router navigation handling, and polling refresh triggers.
 */
@Directive()
export abstract class GpGridWidgetBase<TData = any, TRaw = any> {
  protected destroyRef = inject(DestroyRef);
  protected router = inject(Router, { optional: true });

  /**
   * Universal reactive data source (direct object, Signal, Observable, Subject, Promise, or provider function).
   */
  public dataSource = input<GpWidgetDataSource<TRaw> | undefined>(undefined);

  /**
   * Direct structured data payload.
   */
  public data = input<TData | undefined>(undefined);

  /**
   * Grid item host configuration if embedded inside GpGrid.
   */
  public item = input<GpGridItem | undefined>(undefined);

  /**
   * Optional automatic polling / refresh interval in milliseconds.
   */
  public refreshInterval = input<number | undefined>(undefined);

  /**
   * Output emitted when navigation occurs via routerLink.
   */
  public navigate = output<{ routerLink: string | any[]; queryParams?: Record<string, any> }>();

  /**
   * Output emitted when a data refresh is triggered.
   */
  public refreshTrigger = output<void>();

  /**
   * Internal reactive stream resolution state.
   */
  protected resolvedState: GpResolvedWidgetState<TRaw>;

  constructor() {
    this.resolvedState = createWidgetDataResolver<TRaw>(
      () => this.dataSource() ?? (this.data() as any) ?? this.item()?.dataSource ?? this.item()?.widgetData,
      this.destroyRef,
      () => this.refreshInterval() ?? this.item()?.refreshInterval
    );
  }

  /**
   * Whether the widget is currently loading data.
   */
  public isLoading: Signal<boolean> = computed(() => {
    return !!(this.item()?.loading || this.resolvedState.loading());
  });

  /**
   * Current error message if data resolution failed.
   */
  public errorMessage: Signal<string | null> = computed(() => {
    return this.item()?.error ? String(this.item()?.error) : this.resolvedState.error();
  });

  /**
   * Raw resolved data from the data source or direct input.
   */
  public rawData: Signal<TRaw | null> = computed(() => {
    return this.resolvedState.data() ?? (this.data() as any) ?? this.item()?.widgetData ?? null;
  });

  /**
   * Abstract or virtual normalized data signal implemented by child widgets.
   */
  public abstract normalizedData: Signal<TData>;

  /**
   * Triggers a manual re-resolution / reload of the widget data source.
   */
  public refresh(): void {
    this.resolvedState.refresh();
    this.refreshTrigger.emit();
  }

  /**
   * Helper to execute router navigation and emit the navigate event.
   */
  protected executeNavigation(navConfig: GpWidgetNavigationConfig | undefined, event?: Event): boolean {
    if (!navConfig?.routerLink) {
      return false;
    }
    const navigated = executeWidgetNavigation(navConfig, this.router, event);
    if (navigated) {
      this.navigate.emit({
        routerLink: navConfig.routerLink,
        queryParams: navConfig.queryParams
      });
    }
    return navigated;
  }
}
