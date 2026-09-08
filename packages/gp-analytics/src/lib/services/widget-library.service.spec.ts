import { TestBed } from '@angular/core/testing';
import { GpWidgetLibraryService } from './widget-library.service';

describe('GpWidgetLibraryService', () => {
  let service: GpWidgetLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GpWidgetLibraryService]
    });
    service = TestBed.inject(GpWidgetLibraryService);
  });

  it('should be created and contain seeded widgets and reports', () => {
    expect(service).toBeTruthy();
    expect(service.widgetLibrary().length).toBeGreaterThan(0);
    expect(service.reportLibrary().length).toBeGreaterThan(0);
  });

  it('allows adding and removing widget templates', () => {
    const initialCount = service.widgetLibrary().length;
    const added = service.addWidget({
      name: 'Custom Profit Metric',
      description: 'Profit margin tracker',
      category: 'kpi',
      createdBy: 'Dashboard Designer',
      widgetConfig: {
        type: 'kpi',
        title: 'Profit Margin',
        grid: { x: 0, y: 0, w: 3, h: 2 },
        measure: { fieldId: 'margin', aggregation: 'avg' }
      }
    });

    expect(added.id).toContain('lib-w-');
    expect(service.widgetLibrary().length).toBe(initialCount + 1);

    service.removeWidget(added.id);
    expect(service.widgetLibrary().length).toBe(initialCount);
  });

  it('allows adding and removing report templates', () => {
    const initialCount = service.reportLibrary().length;
    const added = service.addReport({
      name: 'Executive Profit Matrix',
      category: 'Financial',
      createdBy: 'Dashboard Designer',
      reportConfig: {
        id: 'rpt-profit',
        name: 'Executive Profit Matrix',
        type: 'pivot',
        config: {
          title: 'Executive Profit Matrix',
          rowDimension: 'region',
          colDimension: 'status',
          measure: { fieldId: 'margin', aggregation: 'sum' }
        }
      }
    });

    expect(added.id).toContain('lib-r-');
    expect(service.reportLibrary().length).toBe(initialCount + 1);

    service.removeReport(added.id);
    expect(service.reportLibrary().length).toBe(initialCount);
  });
});
