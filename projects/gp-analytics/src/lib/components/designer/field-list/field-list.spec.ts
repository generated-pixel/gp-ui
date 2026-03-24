import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DEFAULT_GP_ANALYTICS_TRANSLATIONS } from '../../../config/gp-analytics-config';
import { SelectedField } from '../../../interfaces/selected-field';
import { GP_ANALYTICS_TRANSLATIONS } from '../../../tokens/gp-analytics.token';
import { assertIconOnlyButtonsHaveAccessibleText } from '../../../testing/a11y-helpers';
import { FieldList } from './field-list';

const INITIAL_FIELDS: SelectedField[] = [
  {
    field: { name: 'revenue', label: 'Revenue', dataType: 'number', sortable: true },
    aggregation: 'sum',
    groupBy: false,
  },
  {
    field: { name: 'region', label: 'Region', dataType: 'string', sortable: true },
    aggregation: 'none',
    groupBy: true,
  },
];

describe('FieldList', () => {
  let component: FieldList;
  let fixture: ComponentFixture<FieldList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldList],
      providers: [
        { provide: GP_ANALYTICS_TRANSLATIONS, useValue: DEFAULT_GP_ANALYTICS_TRANSLATIONS },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FieldList);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('fields', INITIAL_FIELDS);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render selected field rows', () => {
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('.gp-field-list__item');
    expect(rows.length).toBe(2);
  });

  it('should show empty state when no fields are selected', () => {
    fixture.componentRef.setInput('fields', []);
    fixture.detectChanges();
    const empty = fixture.nativeElement.querySelector('.gp-field-list__empty');
    expect(empty).toBeTruthy();
  });

  it('should emit fieldsChange when removing a field', () => {
    const emitSpy = vi.spyOn(component.fieldsChange, 'emit');
    fixture.detectChanges();
    const removeButtons = fixture.nativeElement.querySelectorAll('.gp-field-list__remove');
    removeButtons[0].click();

    expect(emitSpy).toHaveBeenCalled();
    const payload = emitSpy.mock.calls.at(-1)?.[0] as SelectedField[];
    expect(payload.length).toBe(1);
    expect(payload[0].field.name).toBe('region');
  });

  it('should show column format control in tabular mode', () => {
    fixture.componentRef.setInput('artifactType', 'tabular');
    fixture.detectChanges();
    const labels = Array.from(
      fixture.nativeElement.querySelectorAll(
        '.gp-field-list__control-label',
      ) as NodeListOf<HTMLElement>,
    ).map((el) => el.textContent ?? '');

    expect(labels.some((text) => text.includes('Format'))).toBe(true);
  });

  it('should show graph role control in graph mode', () => {
    fixture.componentRef.setInput('artifactType', 'graph');
    fixture.detectChanges();
    const labels = Array.from(
      fixture.nativeElement.querySelectorAll(
        '.gp-field-list__control-label',
      ) as NodeListOf<HTMLElement>,
    ).map((el) => el.textContent ?? '');

    expect(labels.some((text) => text.includes('Role'))).toBe(true);
  });

  it('should provide accessible names for icon-only buttons', () => {
    fixture.detectChanges();
    expect(() => assertIconOnlyButtonsHaveAccessibleText(fixture.nativeElement)).not.toThrow();
  });
});
