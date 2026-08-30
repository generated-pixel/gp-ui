import { signal } from '@angular/core';
import { BehaviorSubject, Subject, of, throwError } from 'rxjs';
import {
  normalizeKpiWidgetData,
  normalizeChartWidgetData,
  normalizeTableWidgetData,
  normalizeListWidgetData,
  normalizeProgressWidgetData,
  executeWidgetNavigation,
  createWidgetDataResolver
} from './services/widget-data-resolver';

describe('GpWidgetDataResolver & Type Normalizers', () => {
  describe('normalizeKpiWidgetData', () => {
    it('should normalize a primitive number', () => {
      const result = normalizeKpiWidgetData(1250);
      expect(result.value).toBe(1250);
      expect(result.label).toBe('Metric');
    });

    it('should normalize a primitive string', () => {
      const result = normalizeKpiWidgetData('$45.2k');
      expect(result.value).toBe('$45.2k');
      expect(result.label).toBe('Metric');
    });

    it('should infer positive/negative trend from change text', () => {
      const pos = normalizeKpiWidgetData({ label: 'ARR', value: '$1.2M', change: '+18.5%' });
      expect(pos.trend).toBe('pos');

      const neg = normalizeKpiWidgetData({ label: 'Churn', value: '4.2%', change: '-2.1%' });
      expect(neg.trend).toBe('neg');
    });
  });

  describe('normalizeChartWidgetData', () => {
    it('should normalize monthly data array', () => {
      const raw = [
        { month: 'Jan', amt: '$10k', pct: 40 },
        { month: 'Feb', amt: '$20k', pct: 80 }
      ];
      const result = normalizeChartWidgetData(raw);
      expect(result.monthlyData?.length).toBe(2);
      expect(result.monthlyData?.[0].month).toBe('Jan');
      expect(result.monthlyData?.[1].pct).toBe(80);
    });

    it('should normalize numeric series array', () => {
      const raw = [10, 20, 30, 40];
      const result = normalizeChartWidgetData(raw);
      expect(result.series?.length).toBe(1);
      expect(result.series?.[0].data).toEqual([10, 20, 30, 40]);
    });
  });

  describe('normalizeTableWidgetData', () => {
    it('should auto-generate column headers when given raw row objects', () => {
      const rawRows = [
        { id: 1, customerName: 'Acme Corp', status: 'Active', amount: '$5,000' },
        { id: 2, customerName: 'Globex', status: 'Pending', amount: '$3,200' }
      ];
      const result = normalizeTableWidgetData(rawRows);
      expect(result.rows?.length).toBe(2);
      expect(result.columns?.length).toBe(4);
      expect(result.columns?.[0].field).toBe('id');
      expect(result.columns?.[1].header).toBe('Customer Name');
    });
  });

  describe('normalizeListWidgetData', () => {
    it('should normalize array of string items', () => {
      const raw = ['Server restarted', 'Backup completed'];
      const result = normalizeListWidgetData(raw);
      expect(result.items?.length).toBe(2);
      expect(result.items?.[0].title).toBe('Server restarted');
    });
  });

  describe('normalizeProgressWidgetData', () => {
    it('should normalize a single progress number', () => {
      const result = normalizeProgressWidgetData(75);
      expect(result.items?.length).toBe(1);
      expect(result.items?.[0].percentage).toBe(75);
    });
  });

  describe('executeWidgetNavigation', () => {
    it('should invoke router.navigate when routerLink is provided', () => {
      const routerSpy = {
        navigate: jasmine.createSpy('navigate')
      };
      const navConfig = {
        routerLink: ['/dashboard', 'finance'],
        queryParams: { period: 'Q1' }
      };
      const result = executeWidgetNavigation(navConfig, routerSpy as any);
      expect(result).toBe(true);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard', 'finance'], {
        queryParams: { period: 'Q1' },
        fragment: undefined
      });
    });
  });

  describe('createWidgetDataResolver', () => {
    it('should resolve direct raw value synchronously', () => {
      const state = createWidgetDataResolver(() => ({ label: 'Direct', value: 100 }));
      expect(state.loading()).toBe(false);
      expect(state.error()).toBeNull();
      expect(state.data()).toEqual({ label: 'Direct', value: 100 });
    });

    it('should resolve Angular Signal data', () => {
      const mySignal = signal({ label: 'Signal Data', value: 500 });
      const state = createWidgetDataResolver(() => mySignal);
      expect(state.loading()).toBe(false);
      expect(state.data()?.value).toBe(500);
    });

    it('should resolve RxJS Subject / Observable stream and react to emissions', () => {
      const subject = new BehaviorSubject<{ count: number }>({ count: 1 });
      const state = createWidgetDataResolver(() => subject);

      expect(state.loading()).toBe(false);
      expect(state.data()?.count).toBe(1);

      subject.next({ count: 2 });
      expect(state.data()?.count).toBe(2);

      subject.next({ count: 42 });
      expect(state.data()?.count).toBe(42);
    });

    it('should resolve Native Promise data', async () => {
      const promise = Promise.resolve({ label: 'Async Promised', value: 999 });
      const state = createWidgetDataResolver(() => promise);

      expect(state.loading()).toBe(true);

      const val = await promise;
      expect(val.value).toBe(999);
      // Data signal updates on next microtask
      setTimeout(() => {
        expect(state.loading()).toBe(false);
        expect(state.data()?.value).toBe(999);
      }, 0);
    });

    it('should catch and surface Observable errors', () => {
      const obs$ = throwError(() => new Error('API Rate Limited'));
      const state = createWidgetDataResolver(() => obs$);

      expect(state.loading()).toBe(false);
      expect(state.error()).toBe('API Rate Limited');
    });
  });
});
