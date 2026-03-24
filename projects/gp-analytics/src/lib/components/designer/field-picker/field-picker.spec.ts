import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DEFAULT_GP_ANALYTICS_TRANSLATIONS } from '../../../config/gp-analytics-config';
import { Folder } from '../../../interfaces/folder';
import {
  assertAriaControlsTargetsExist,
  assertIconOnlyButtonsHaveAccessibleText,
  assertToggleButtonsHaveValidAriaExpanded,
} from '../../../testing/a11y-helpers';
import { GP_ANALYTICS_TRANSLATIONS } from '../../../tokens/gp-analytics.token';
import { FieldPicker } from './field-picker';

const MOCK_FOLDERS: Folder[] = [
  {
    id: 'f1',
    name: 'Sales',
    datasets: [
      {
        id: 'ds1',
        name: 'Orders',
        folderId: 'f1',
        fields: [
          { name: 'order_id', dataType: 'integer' },
          { name: 'revenue', label: 'Revenue', dataType: 'number', sortable: true },
        ],
      },
    ],
  },
];

describe('FieldPicker', () => {
  let component: FieldPicker;
  let fixture: ComponentFixture<FieldPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldPicker],
      providers: [
        { provide: GP_ANALYTICS_TRANSLATIONS, useValue: DEFAULT_GP_ANALYTICS_TRANSLATIONS },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FieldPicker);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('folders', MOCK_FOLDERS);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render folder toggle buttons', () => {
    fixture.detectChanges();
    const toggles = fixture.nativeElement.querySelectorAll('.gp-field-picker__folder-toggle');
    expect(toggles.length).toBe(1);
    expect(toggles[0].textContent).toContain('Sales');
  });

  it('should expand a folder when its toggle is clicked', () => {
    fixture.detectChanges();
    const toggle = fixture.nativeElement.querySelector('.gp-field-picker__folder-toggle');
    toggle.click();
    fixture.detectChanges();
    const datasetToggle = fixture.nativeElement.querySelector('.gp-field-picker__dataset-toggle');
    expect(datasetToggle).toBeTruthy();
    expect(datasetToggle.textContent).toContain('Orders');
  });

  it('should expand a dataset and show fields when its toggle is clicked', () => {
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.gp-field-picker__folder-toggle').click();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.gp-field-picker__dataset-toggle').click();
    fixture.detectChanges();
    const fields = fixture.nativeElement.querySelectorAll('.gp-field-picker__field');
    expect(fields.length).toBe(2);
  });

  it('should show empty message when no folders provided', () => {
    fixture.componentRef.setInput('folders', []);
    fixture.detectChanges();
    const empty = fixture.nativeElement.querySelector('.gp-field-picker__empty');
    expect(empty).toBeTruthy();
  });

  it('should provide accessible names for icon-only buttons', () => {
    fixture.detectChanges();
    expect(() => assertIconOnlyButtonsHaveAccessibleText(fixture.nativeElement)).not.toThrow();
  });

  it('should provide valid aria-expanded values for toggle buttons', () => {
    fixture.detectChanges();
    expect(() => assertToggleButtonsHaveValidAriaExpanded(fixture.nativeElement)).not.toThrow();
  });

  it('should provide valid aria-controls targets for toggle buttons', () => {
    fixture.detectChanges();
    expect(() => assertAriaControlsTargetsExist(fixture.nativeElement)).not.toThrow();
  });
});
