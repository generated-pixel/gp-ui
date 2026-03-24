import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DEFAULT_GP_ANALYTICS_TRANSLATIONS } from '../../config/gp-analytics-config';
import { Folder } from '../../interfaces/folder';
import {
  assertAriaControlsTargetsExist,
  assertIconOnlyButtonsHaveAccessibleText,
  assertToggleButtonsHaveValidAriaExpanded,
} from '../../testing/a11y-helpers';
import { GP_ANALYTICS_TRANSLATIONS } from '../../tokens/gp-analytics.token';
import { Designer } from './designer';

const MOCK_FOLDERS: Folder[] = [
  {
    id: 'folder-1',
    name: 'Sales',
    datasets: [
      {
        id: 'dataset-1',
        folderId: 'folder-1',
        name: 'Orders',
        fields: [
          { name: 'order_id', dataType: 'integer' },
          { name: 'revenue', dataType: 'number', sortable: true },
        ],
      },
    ],
  },
];

describe('Designer', () => {
  let component: Designer;
  let fixture: ComponentFixture<Designer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Designer],
      providers: [
        { provide: GP_ANALYTICS_TRANSLATIONS, useValue: DEFAULT_GP_ANALYTICS_TRANSLATIONS },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Designer);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('folders', MOCK_FOLDERS);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title input', () => {
    fixture.componentRef.setInput('title', 'Custom Designer');
    fixture.detectChanges();

    const titleElement = fixture.nativeElement.querySelector('.gp-designer-title');
    expect(titleElement.textContent).toContain('Custom Designer');
  });

  it('should fall back to translation default title', () => {
    fixture.detectChanges();
    const titleElement = fixture.nativeElement.querySelector('.gp-designer-title');
    expect(titleElement.textContent).toContain(
      DEFAULT_GP_ANALYTICS_TRANSLATIONS.designerDefaultTitle,
    );
  });

  it('should render artifact type options', () => {
    fixture.detectChanges();
    const select: HTMLSelectElement = fixture.nativeElement.querySelector(
      '#gp-designer-artifact-type',
    );
    expect(select).toBeTruthy();
    const values = Array.from(select.options).map((o) => o.value);
    expect(values).toEqual(['tabular', 'graph', 'kpi']);
  });

  it('should emit selectionChange when artifact type changes', () => {
    const emitSpy = vi.spyOn(component.selectionChange, 'emit');
    fixture.detectChanges();
    const select: HTMLSelectElement = fixture.nativeElement.querySelector(
      '#gp-designer-artifact-type',
    );
    select.value = 'graph';
    select.dispatchEvent(new Event('change'));

    expect(emitSpy).toHaveBeenCalledWith({
      artifactType: 'graph',
      graphType: 'bar',
      fields: [],
    });
  });

  it('should render graph type options when graph artifact is selected', () => {
    fixture.detectChanges();
    const artifactSelect: HTMLSelectElement = fixture.nativeElement.querySelector(
      '#gp-designer-artifact-type',
    );
    artifactSelect.value = 'graph';
    artifactSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const graphTypeSelect: HTMLSelectElement =
      fixture.nativeElement.querySelector('#gp-designer-graph-type');
    expect(graphTypeSelect).toBeTruthy();
    const values = Array.from(graphTypeSelect.options).map((o) => o.value);
    expect(values).toEqual(['pie', 'bar', 'stacked-bar', 'column', 'stacked-column', 'radial']);
  });

  it('should emit selectionChange when graph type changes', () => {
    const emitSpy = vi.spyOn(component.selectionChange, 'emit');
    fixture.detectChanges();

    const artifactSelect: HTMLSelectElement = fixture.nativeElement.querySelector(
      '#gp-designer-artifact-type',
    );
    artifactSelect.value = 'graph';
    artifactSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const graphTypeSelect: HTMLSelectElement =
      fixture.nativeElement.querySelector('#gp-designer-graph-type');
    graphTypeSelect.value = 'pie';
    graphTypeSelect.dispatchEvent(new Event('change'));

    expect(emitSpy).toHaveBeenLastCalledWith({
      artifactType: 'graph',
      graphType: 'pie',
      fields: [],
    });
  });

  it('should render preview after refresh is clicked', () => {
    fixture.detectChanges();
    (component as any).updateSelectedFields([
      {
        field: { name: 'revenue', dataType: 'number' },
        aggregation: 'sum',
        groupBy: false,
      },
    ]);
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.gp-designer-preview__refresh',
    );
    expect(button.disabled).toBe(false);

    button.click();
    fixture.detectChanges();

    const previewWidget = fixture.nativeElement.querySelector('gp-widget');
    expect(previewWidget).toBeTruthy();
  });

  it('should mark preview as outdated after selection changes post-refresh', () => {
    fixture.detectChanges();
    (component as any).updateSelectedFields([
      {
        field: { name: 'revenue', dataType: 'number' },
        aggregation: 'sum',
        groupBy: false,
      },
    ]);
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.gp-designer-preview__refresh',
    );
    button.click();
    fixture.detectChanges();

    (component as any).updateSelectedFields([
      {
        field: { name: 'revenue', dataType: 'number' },
        aggregation: 'sum',
        groupBy: false,
      },
      {
        field: { name: 'region', dataType: 'string' },
        aggregation: 'none',
        groupBy: true,
      },
    ]);
    fixture.detectChanges();

    const status = fixture.nativeElement.querySelector('.gp-designer-preview__status');
    expect(status.textContent).toContain(
      DEFAULT_GP_ANALYTICS_TRANSLATIONS.designerPreviewStatusOutdated,
    );
  });

  it('should show KPI guidance text when kpi is selected', () => {
    fixture.detectChanges();
    const select: HTMLSelectElement = fixture.nativeElement.querySelector(
      '#gp-designer-artifact-type',
    );
    select.value = 'kpi';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const hint = fixture.nativeElement.querySelector('.gp-designer-hint');
    expect(hint.textContent).toContain(DEFAULT_GP_ANALYTICS_TRANSLATIONS.designerHintKpi);
  });

  it('should show translated graph errors from config', () => {
    fixture.detectChanges();
    const select: HTMLSelectElement = fixture.nativeElement.querySelector(
      '#gp-designer-artifact-type',
    );
    select.value = 'graph';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const errorText = fixture.nativeElement.querySelector('.gp-designer-errors')?.textContent ?? '';
    expect(errorText).toContain(DEFAULT_GP_ANALYTICS_TRANSLATIONS.designerErrorAtLeastOneField);
  });

  it('should show translated KPI error from config', () => {
    fixture.detectChanges();
    const select: HTMLSelectElement = fixture.nativeElement.querySelector(
      '#gp-designer-artifact-type',
    );
    select.value = 'kpi';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const errorText = fixture.nativeElement.querySelector('.gp-designer-errors')?.textContent ?? '';
    expect(errorText).toContain(DEFAULT_GP_ANALYTICS_TRANSLATIONS.designerErrorKpiNeedsValueField);
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
