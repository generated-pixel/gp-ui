import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GpLocaleService } from './gp-locale.service';
import {
  GpNumberPipe,
  GpCurrencyPipe,
  GpPercentPipe,
  GpCompactNumberPipe,
  GpByteSizePipe,
  GpOrdinalPipe,
  GpDatePipe,
  GpRelativeTimePipe,
  GpDurationPipe,
  GpListPipe,
  GP_I18N_PIPES
} from './gp-i18n.pipes';

@Component({
  standalone: true,
  imports: [GP_I18N_PIPES],
  template: `
    <div id="number">{{ 1234567.89 | gpNumber: { minimumFractionDigits: 2 } }}</div>
    <div id="currency">{{ 49.99 | gpCurrency: 'USD' }}</div>
    <div id="percent">{{ 0.755 | gpPercent: 1 }}</div>
    <div id="compact">{{ 2500000 | gpCompactNumber }}</div>
    <div id="bytes">{{ 1048576 | gpByteSize: 'binary' }}</div>
    <div id="ordinal">{{ 1 | gpOrdinal }}</div>
    <div id="date">{{ testDate | gpDate: 'shortDate' : 'UTC' }}</div>
    <div id="duration">{{ 3600 | gpDuration: 'digital' }}</div>
    <div id="list">{{ ['Alpha', 'Beta', 'Gamma'] | gpList }}</div>
  `
})
class TestHostComponent {
  testDate = new Date('2026-09-07T12:00:00Z');
}

describe('GP_I18N_PIPES in Angular component', () => {
  let localeService: GpLocaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent]
    });
    localeService = TestBed.inject(GpLocaleService);
    localeService.setLocale('en-US');
    localeService.setCurrency('USD');
  });

  it('renders all pipes correctly in template', () => {
    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('#number')?.textContent).toBe('1,234,567.89');
    expect(el.querySelector('#currency')?.textContent).toBe('$49.99');
    expect(el.querySelector('#percent')?.textContent).toBe('75.5%');
    expect(el.querySelector('#compact')?.textContent).toBe('2.5M');
    expect(el.querySelector('#bytes')?.textContent).toBe('1 MiB');
    expect(el.querySelector('#ordinal')?.textContent).toBe('1st');
    expect(el.querySelector('#date')?.textContent).toBe('9/7/2026');
    expect(el.querySelector('#duration')?.textContent).toBe('01:00:00');
    expect(el.querySelector('#list')?.textContent).toBe('Alpha, Beta, and Gamma');
  });

  it('updates outputs when locale service changes', () => {
    localeService.setLocale('de-DE');
    localeService.setCurrency('EUR');

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('#number')?.textContent).toBe('1.234.567,89');
    expect(el.querySelector('#bytes')?.textContent).toBe('1 MiB');
    expect(el.querySelector('#ordinal')?.textContent).toBe('1.');
  });
});
