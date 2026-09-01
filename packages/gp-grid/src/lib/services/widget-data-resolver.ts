import { DestroyRef, Injectable, Signal, computed, inject, isSignal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription, isObservable, timer } from 'rxjs';
import {
  GpKpiWidgetData,
  GpChartWidgetData,
  GpTableWidgetData,
  GpListWidgetData,
  GpProgressWidgetData,
  GpGridTableColumn,
  GpWidgetDataSource,
  GpWidgetNavigationConfig
} from '../models/grid-widget.model';

export interface GpResolvedWidgetState<T> {
  data: Signal<T | null>;
  loading: Signal<boolean>;
  error: Signal<string | null>;
  refresh: () => void;
}

/**
 * Normalizes unknown KPI data into a well-formed GpKpiWidgetData object.
 */
export function normalizeKpiWidgetData(raw: any): GpKpiWidgetData {
  if (raw === null || raw === undefined) {
    return { label: 'Metric', value: 0 };
  }

  if (typeof raw === 'number' || typeof raw === 'string') {
    return {
      label: 'Metric',
      value: raw
    };
  }

  const trend =
    raw.trend ||
    raw.trendType ||
    (raw.change?.startsWith('+') ? 'pos' : raw.change?.startsWith('-') ? 'neg' : 'neutral');

  return {
    label: raw.label || raw.title || raw.name || 'Metric',
    value: raw.value ?? raw.val ?? raw.amount ?? raw.count ?? 0,
    change: raw.change || raw.delta || raw.trendText,
    trendText: raw.trendText || raw.change,
    trend,
    trendType: trend,
    icon: raw.icon,
    iconBg: raw.iconBg,
    iconColor: raw.iconColor,
    subtitle: raw.subtitle || raw.desc || raw.description,
    target: raw.target,
    progress: raw.progress ?? raw.pct,
    meta: raw.meta,
    routerLink: raw.routerLink,
    queryParams: raw.queryParams,
    onClick: raw.onClick
  };
}

/**
 * Normalizes unknown chart data into a well-formed GpChartWidgetData object.
 */
export function normalizeChartWidgetData(raw: any): GpChartWidgetData {
  if (!raw) {
    return { series: [], monthlyData: [] };
  }

  // If passed an array of monthly objects
  if (Array.isArray(raw)) {
    if (raw.length > 0 && typeof raw[0] === 'object' && ('month' in raw[0] || 'amt' in raw[0] || 'pct' in raw[0])) {
      return {
        monthlyData: raw.map((item) => ({
          month: item.month || item.name || item.label || '',
          amt: item.amt || item.amount || String(item.value ?? item.pct ?? 0),
          pct: Number(item.pct ?? item.percentage ?? item.value ?? 0),
          count: item.count,
          meta: item.meta,
          routerLink: item.routerLink,
          queryParams: item.queryParams
        }))
      };
    }

    // If passed a simple number array
    if (raw.length > 0 && typeof raw[0] === 'number') {
      return {
        series: [{ name: 'Series 1', data: raw }]
      };
    }
  }

  return {
    title: raw.title,
    subtitle: raw.subtitle,
    badge: raw.badge,
    badgeSeverity: raw.badgeSeverity,
    categories: raw.categories || [],
    series: raw.series || [],
    monthlyData: raw.monthlyData || [],
    timeRangeOptions: raw.timeRangeOptions || ['7D', '30D', '90D', '1Y', 'ALL'],
    selectedTimeRange: raw.selectedTimeRange || '30D',
    routerLink: raw.routerLink,
    queryParams: raw.queryParams,
    onSelectTimeRange: raw.onSelectTimeRange,
    onBarClick: raw.onBarClick
  };
}

/**
 * Normalizes unknown table data into a well-formed GpTableWidgetData object.
 */
export function normalizeTableWidgetData(raw: any): GpTableWidgetData {
  if (!raw) {
    return { columns: [], rows: [] };
  }

  // If passed a raw array of row records
  if (Array.isArray(raw)) {
    const rows = raw;
    let columns: GpGridTableColumn[] = [];

    if (rows.length > 0 && typeof rows[0] === 'object') {
      columns = Object.keys(rows[0])
        .filter((key) => !key.startsWith('_') && key !== 'routerLink' && key !== 'queryParams')
        .map((key) => ({
          field: key,
          header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
          sortable: true
        }));
    }

    return {
      columns,
      rows,
      exportable: true
    };
  }

  const rows = raw.rows || raw.data || raw.items || [];
  let columns: GpGridTableColumn[] = raw.columns || [];

  if (columns.length === 0 && rows.length > 0 && typeof rows[0] === 'object') {
    columns = Object.keys(rows[0])
      .filter((key) => !key.startsWith('_') && key !== 'routerLink' && key !== 'queryParams')
      .map((key) => ({
        field: key,
        header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
        sortable: true
      }));
  }

  return {
    title: raw.title,
    subtitle: raw.subtitle,
    columns,
    rows,
    exportable: raw.exportable ?? true,
    filterPlaceholder: raw.filterPlaceholder || 'Filter table...',
    pageSize: raw.pageSize,
    totalRecords: raw.totalRecords || rows.length,
    routerLink: raw.routerLink,
    queryParams: raw.queryParams,
    onRowClick: raw.onRowClick
  };
}

/**
 * Normalizes unknown list / activity feed data.
 */
export function normalizeListWidgetData(raw: any): GpListWidgetData {
  if (!raw) {
    return { items: [] };
  }

  if (Array.isArray(raw)) {
    return {
      items: raw.map((item, idx) => {
        if (typeof item === 'string') {
          return { id: String(idx), title: item };
        }
        return {
          id: item.id || String(idx),
          title: item.title || item.name || item.label || 'Item',
          subtitle: item.subtitle || item.desc || item.description,
          category: item.category,
          meta: item.meta,
          time: item.time || item.date || item.timestamp,
          avatar: item.avatar,
          avatarLabel: item.avatarLabel,
          badge: item.badge,
          badgeSeverity: item.badgeSeverity,
          icon: item.icon,
          iconBg: item.iconBg,
          iconColor: item.iconColor,
          revenue: item.revenue,
          sales: item.sales,
          status: item.status,
          customData: item.customData,
          routerLink: item.routerLink,
          queryParams: item.queryParams,
          onClick: item.onClick
        };
      })
    };
  }

  return {
    title: raw.title,
    subtitle: raw.subtitle,
    actionLabel: raw.actionLabel,
    items: raw.items || [],
    routerLink: raw.routerLink,
    queryParams: raw.queryParams,
    onItemClick: raw.onItemClick
  };
}

/**
 * Normalizes unknown progress / quota data.
 */
export function normalizeProgressWidgetData(raw: any): GpProgressWidgetData {
  if (!raw) {
    return { items: [] };
  }

  if (typeof raw === 'number') {
    return {
      items: [{ label: 'Overall Progress', percentage: Math.min(100, Math.max(0, raw)), pct: raw }]
    };
  }

  if (Array.isArray(raw)) {
    return {
      items: raw.map((item) => ({
        label: item.label || item.name || item.title || 'Goal',
        percentage: Number(item.percentage ?? item.pct ?? item.value ?? 0),
        pct: Number(item.percentage ?? item.pct ?? item.value ?? 0),
        valueText: item.valueText || item.valText,
        valText: item.valueText || item.valText,
        color: item.color,
        severity: item.severity,
        target: item.target,
        routerLink: item.routerLink,
        queryParams: item.queryParams,
        onClick: item.onClick
      }))
    };
  }

  const items = raw.items || raw.quotas || raw.goals || [];

  return {
    title: raw.title,
    subtitle: raw.subtitle,
    target: raw.target,
    goalsTitle: raw.goalsTitle || raw.title,
    goalsTarget: raw.goalsTarget || raw.target,
    items: items.map((item: any) => ({
      label: item.label || item.name || item.title || 'Goal',
      percentage: Number(item.percentage ?? item.pct ?? item.value ?? 0),
      pct: Number(item.percentage ?? item.pct ?? item.value ?? 0),
      valueText: item.valueText || item.valText,
      valText: item.valueText || item.valText,
      color: item.color,
      severity: item.severity,
      target: item.target,
      routerLink: item.routerLink,
      queryParams: item.queryParams,
      onClick: item.onClick
    })),
    quotas: raw.quotas,
    routerLink: raw.routerLink,
    queryParams: raw.queryParams,
    onItemClick: raw.onItemClick
  };
}

/**
 * Safe router and external navigation handler.
 */
export function executeWidgetNavigation(
  nav: GpWidgetNavigationConfig | undefined,
  router: Router | null | undefined,
  event?: Event
): boolean {
  if (!nav) {
    return false;
  }

  if (event) {
    event.stopPropagation();
  }

  if (nav.routerLink && router) {
    const commands = Array.isArray(nav.routerLink) ? nav.routerLink : [nav.routerLink];
    router.navigate(commands, {
      queryParams: nav.queryParams,
      fragment: nav.fragment,
      ...nav.routerOptions
    });
    return true;
  }

  if (nav.href && typeof window !== 'undefined') {
    if (nav.linkTarget === '_blank') {
      window.open(nav.href, '_blank');
    } else {
      window.location.href = nav.href;
    }
    return true;
  }

  return false;
}

/**
 * Core utility to hook up a GpWidgetDataSource (direct value, Signal, Observable, Subject, Promise, or fetcher)
 * to standard reactive signals with automated lifecycle management.
 */
export function createWidgetDataResolver<T = any>(
  getSource: () => GpWidgetDataSource<T> | undefined,
  destroyRef?: DestroyRef,
  getRefreshInterval?: () => number | undefined
): GpResolvedWidgetState<T> {
  const dataSignal = signal<T | null>(null);
  const loadingSignal = signal<boolean>(false);
  const errorSignal = signal<string | null>(null);

  let activeSub: Subscription | null = null;
  let intervalSub: Subscription | null = null;

  function cleanup() {
    if (activeSub) {
      activeSub.unsubscribe();
      activeSub = null;
    }
    if (intervalSub) {
      intervalSub.unsubscribe();
      intervalSub = null;
    }
  }

  if (destroyRef) {
    destroyRef.onDestroy(() => cleanup());
  }

  function resolve() {
    cleanup();
    errorSignal.set(null);

    const source = getSource();

    if (source === undefined || source === null) {
      dataSignal.set(null);
      loadingSignal.set(false);
      return;
    }

    // 1. Angular Signal
    if (isSignal(source)) {
      loadingSignal.set(false);
      dataSignal.set(source());
      return;
    }

    // 2. RxJS Observable / Subject / BehaviorSubject
    if (isObservable(source)) {
      loadingSignal.set(true);
      activeSub = (source as Observable<T>).subscribe({
        next: (val) => {
          dataSignal.set(val);
          loadingSignal.set(false);
          errorSignal.set(null);
        },
        error: (err) => {
          loadingSignal.set(false);
          errorSignal.set(err?.message || String(err) || 'Failed to load widget data');
        }
      });
      setupInterval();
      return;
    }

    // 3. Native Promise
    if (
      source instanceof Promise ||
      (typeof source === 'object' && 'then' in source && typeof (source as any).then === 'function')
    ) {
      loadingSignal.set(true);
      (source as Promise<T>)
        .then((val) => {
          dataSignal.set(val);
          loadingSignal.set(false);
          errorSignal.set(null);
        })
        .catch((err) => {
          loadingSignal.set(false);
          errorSignal.set(err?.message || String(err) || 'Failed to load widget data');
        });
      setupInterval();
      return;
    }

    // 4. Provider function
    if (typeof source === 'function') {
      try {
        loadingSignal.set(true);
        const result = (source as Function)();
        if (isObservable(result)) {
          activeSub = (result as Observable<T>).subscribe({
            next: (val) => {
              dataSignal.set(val);
              loadingSignal.set(false);
              errorSignal.set(null);
            },
            error: (err) => {
              loadingSignal.set(false);
              errorSignal.set(err?.message || String(err) || 'Failed to load widget data');
            }
          });
        } else if (result instanceof Promise || (typeof result === 'object' && result && 'then' in result)) {
          (result as Promise<T>)
            .then((val) => {
              dataSignal.set(val);
              loadingSignal.set(false);
              errorSignal.set(null);
            })
            .catch((err) => {
              loadingSignal.set(false);
              errorSignal.set(err?.message || String(err) || 'Failed to load widget data');
            });
        } else {
          dataSignal.set(result);
          loadingSignal.set(false);
        }
      } catch (err: any) {
        loadingSignal.set(false);
        errorSignal.set(err?.message || String(err) || 'Failed to evaluate widget data function');
      }
      setupInterval();
      return;
    }

    // 5. Direct Raw Value
    dataSignal.set(source as T);
    loadingSignal.set(false);
    setupInterval();
  }

  function setupInterval() {
    const intervalMs = getRefreshInterval ? getRefreshInterval() : undefined;
    if (intervalMs && intervalMs > 0) {
      intervalSub = timer(intervalMs, intervalMs).subscribe(() => {
        const currentSource = getSource();
        if (typeof currentSource === 'function' || isObservable(currentSource)) {
          resolve();
        }
      });
    }
  }

  // Initial resolve
  resolve();

  return {
    data: dataSignal.asReadonly(),
    loading: loadingSignal.asReadonly(),
    error: errorSignal.asReadonly(),
    refresh: () => resolve()
  };
}

@Injectable({
  providedIn: 'root'
})
export class GpWidgetDataService {
  private router = inject(Router, { optional: true });

  /**
   * Safe navigate with router link.
   */
  navigate(nav: GpWidgetNavigationConfig | undefined, event?: Event): boolean {
    return executeWidgetNavigation(nav, this.router, event);
  }
}
