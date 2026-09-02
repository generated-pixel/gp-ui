import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpDateBase } from './gp-date-base';

@Component({
  standalone: true,
  template: '<div>{{ currentMonthName() }} {{ currentYear() }}</div>'
})
class TestDateHost extends GpDateBase<Date> {}

describe('GpDateBase', () => {
  let fixture: ComponentFixture<TestDateHost>;
  let component: TestDateHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestDateHost]
    }).compileComponents();

    fixture = TestBed.createComponent(TestDateHost);
    component = fixture.componentInstance;
  });

  it('should initialize with default view date and calendar computed metadata', () => {
    expect(component.currentYear()).toBe(new Date().getFullYear());
    expect(component.currentMonth()).toBe(new Date().getMonth());
    expect(component.weekDayNames().length).toBe(7);
  });

  it('should navigate months with prevMonth and nextMonth', () => {
    component.viewDate.set(new Date(2026, 5, 15)); // June 2026
    expect(component.currentMonth()).toBe(5);

    component.prevMonth();
    expect(component.currentMonth()).toBe(4); // May

    component.nextMonth();
    expect(component.currentMonth()).toBe(5); // June
  });

  it('should correctly compare dates using isSameDay', () => {
    const d1 = new Date(2026, 8, 2, 10, 30);
    const d2 = new Date(2026, 8, 2, 18, 45);
    const d3 = new Date(2026, 8, 3, 10, 30);

    expect(component.isSameDay(d1, d2)).toBe(true);
    expect(component.isSameDay(d1, d3)).toBe(false);
    expect(component.isSameDay(null, d1)).toBe(false);
  });

  it('should toggle overlay visibility', () => {
    expect(component.overlayVisible()).toBe(false);
    component.toggleOverlay();
    expect(component.overlayVisible()).toBe(true);
    component.closeOverlay();
    expect(component.overlayVisible()).toBe(false);
  });
});
