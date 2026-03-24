import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DEFAULT_GP_ANALYTICS_TRANSLATIONS } from '../../../config/gp-analytics-config';
import { GP_ANALYTICS_TRANSLATIONS } from '../../../tokens/gp-analytics.token';
import { FieldItem } from './field-item';

describe('FieldItem', () => {
  let component: FieldItem;
  let fixture: ComponentFixture<FieldItem>;

  const mockField = { name: 'revenue', label: 'Revenue', dataType: 'number' as const };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldItem],
      providers: [
        { provide: GP_ANALYTICS_TRANSLATIONS, useValue: DEFAULT_GP_ANALYTICS_TRANSLATIONS },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FieldItem);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('field', mockField);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the field label when provided', () => {
    fixture.detectChanges();
    const name = fixture.nativeElement.querySelector('.gp-field-item__name');
    expect(name.textContent).toContain('Revenue');
  });

  it('should fall back to field name when label is absent', () => {
    fixture.componentRef.setInput('field', { name: 'id', dataType: 'integer' as const });
    fixture.detectChanges();
    const name = fixture.nativeElement.querySelector('.gp-field-item__name');
    expect(name.textContent).toContain('id');
  });

  it('should render the data type badge', () => {
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.gp-field-item__badge');
    expect(badge).toBeTruthy();
    expect(badge.textContent.trim()).toBe('#');
  });

  it('should apply the data-type modifier class to the badge', () => {
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.gp-field-item__badge');
    expect(badge.classList.contains('gp-field-item__badge--number')).toBe(true);
  });
});
