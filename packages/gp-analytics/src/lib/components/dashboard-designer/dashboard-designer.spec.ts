import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { GpDashboardDesigner } from './dashboard-designer';
import { GpDataEngineService } from '../../services/data-engine.service';
import { GpTranslationService } from '../../services/translation.service';
import { createDefaultDashboardConfig, createBlankDashboardConfig } from '../../models/dashboard.model';

describe('GpDashboardDesigner', () => {
  const mockData = [
    { customer_name: 'Northwind', status: 'Completed', total: 5000, quantity: 10, region: 'AMER' },
    { customer_name: 'Acme', status: 'Completed', total: 8000, quantity: 15, region: 'EMEA' },
    { customer_name: 'Acme', status: 'Pending', total: 2000, quantity: 4, region: 'EMEA' },
  ];

  function createComponent() {
    TestBed.configureTestingModule({
      imports: [GpDashboardDesigner],
      providers: [GpDataEngineService, GpTranslationService],
    });
    const fixture = TestBed.createComponent(GpDashboardDesigner);
    const component = fixture.componentInstance;
    fixture.componentRef.setInput('records', mockData);
    return { fixture, component };
  }

  it('initializes with default dashboard config and design mode', () => {
    const { fixture, component } = createComponent();
    fixture.detectChanges();

    expect(component.config().widgets.length).toBeGreaterThanOrEqual(5);
    expect(component.activeMode()).toBe('design');
    expect(component.selectedWidget()).toBeNull();
  });

  it('toggles between design and live preview modes', () => {
    const { fixture, component } = createComponent();
    fixture.detectChanges();

    component.setMode('preview');
    expect(component.activeMode()).toBe('preview');
    expect(component.isInspectorOpen()).toBe(false);

    component.setMode('design');
    expect(component.activeMode()).toBe('design');
  });

  it('adds a new KPI widget to the dashboard configuration', () => {
    const { fixture, component } = createComponent();
    fixture.detectChanges();

    const initialCount = component.config().widgets.length;
    component.addWidget('kpi');
    fixture.detectChanges();

    const updated = component.config().widgets;
    expect(updated.length).toBe(initialCount + 1);

    const added = updated[updated.length - 1];
    expect(added.type).toBe('kpi');
    expect(component.selectedWidgetId()).toBe(added.id);
    expect(component.isInspectorOpen()).toBe(true);
  });

  it('adds a new Chart widget with specific chart type', () => {
    const { fixture, component } = createComponent();
    fixture.detectChanges();

    const initialCount = component.config().widgets.length;
    component.addWidget('chart', 'donut');
    fixture.detectChanges();

    const updated = component.config().widgets;
    expect(updated.length).toBe(initialCount + 1);

    const added = updated[updated.length - 1];
    expect(added.type).toBe('chart');
    if (added.type === 'chart') {
      expect(added.chartType).toBe('donut');
    }
  });

  it('duplicates an existing widget', () => {
    const { fixture, component } = createComponent();
    fixture.detectChanges();

    const firstWidget = component.config().widgets[0];
    const initialCount = component.config().widgets.length;

    component.duplicateWidget(firstWidget);
    fixture.detectChanges();

    const updated = component.config().widgets;
    expect(updated.length).toBe(initialCount + 1);
    const cloned = updated[updated.length - 1];
    expect(cloned.id).not.toBe(firstWidget.id);
    expect(cloned.title).toContain('(Copy)');
  });

  it('deletes a widget and closes inspector if deleted widget was selected', () => {
    const { fixture, component } = createComponent();
    fixture.detectChanges();

    const firstWidget = component.config().widgets[0];
    component.openWidgetInspector(firstWidget);
    expect(component.isInspectorOpen()).toBe(true);

    component.deleteWidget(firstWidget.id);
    fixture.detectChanges();

    expect(component.config().widgets.find((w) => w.id === firstWidget.id)).toBeUndefined();
    expect(component.isInspectorOpen()).toBe(false);
    expect(component.selectedWidgetId()).toBeNull();
  });

  it('synchronizes layout changes from gp-grid', () => {
    const { fixture, component } = createComponent();
    fixture.detectChanges();

    const firstWidget = component.config().widgets[0];
    const updatedGridItems = [
      { id: firstWidget.id, x: 2, y: 3, w: 5, h: 4 },
    ];

    component.onLayoutChange(updatedGridItems);
    fixture.detectChanges();

    const updated = component.config().widgets.find((w) => w.id === firstWidget.id);
    expect(updated?.grid.x).toBe(2);
    expect(updated?.grid.y).toBe(3);
    expect(updated?.grid.w).toBe(5);
    expect(updated?.grid.h).toBe(4);
  });

  it('loads preset templates', () => {
    const { fixture, component } = createComponent();
    fixture.detectChanges();

    component.loadTemplate('blank');
    expect(component.config().widgets.length).toBe(0);

    component.loadTemplate('operations');
    expect(component.config().widgets.length).toBeGreaterThan(0);
    expect(component.config().title).toBe('Operations & Fulfillment Pulse');
  });

  it('imports valid JSON and rejects invalid JSON', () => {
    const { fixture, component } = createComponent();
    fixture.detectChanges();

    // Invalid JSON
    component.jsonBuffer.set('{ invalid json }');
    component.applyImportedJson();
    expect(component.jsonError()).toBeDefined();

    // Valid JSON
    const blank = createBlankDashboardConfig('Imported Test Dashboard');
    component.jsonBuffer.set(JSON.stringify(blank));
    component.applyImportedJson();
    expect(component.config().title).toBe('Imported Test Dashboard');
    expect(component.isJsonModalOpen()).toBe(false);
  });

  it('configures widget movement properties like draggable, resizable, locked, and fixed', () => {
    const { fixture, component } = createComponent();
    fixture.detectChanges();

    const firstWidget = component.config().widgets[0];
    component.openWidgetInspector(firstWidget);

    component.updateSelectedWidget({
      grid: {
        ...firstWidget.grid,
        draggable: false,
        resizable: false,
        locked: true,
        fixed: true,
      },
    });
    fixture.detectChanges();

    const updated = component.config().widgets.find((w) => w.id === firstWidget.id);
    expect(updated?.grid.draggable).toBe(false);
    expect(updated?.grid.resizable).toBe(false);
    expect(updated?.grid.locked).toBe(true);
    expect(updated?.grid.fixed).toBe(true);
  });

  it('updates dashboard-level movement settings and compaction mode', () => {
    const { fixture, component } = createComponent();
    fixture.detectChanges();

    component.updateDashboardSettings({
      allowMove: false,
      allowResize: false,
      compactType: 'none',
    });
    fixture.detectChanges();

    expect(component.config().allowMove).toBe(false);
    expect(component.config().allowResize).toBe(false);
    expect(component.config().compactType).toBe('none');
  });

  it('saves the updated layout with moved coordinates', () => {
    const { fixture, component } = createComponent();
    fixture.detectChanges();

    let savedConfig: any = null;
    component.save.subscribe((cfg) => {
      savedConfig = cfg;
    });

    const targetWidget = component.config().widgets[0];
    // Move item on canvas
    component.onLayoutChange([
      { id: targetWidget.id, x: 8, y: 4, w: 4, h: 2 },
    ]);
    fixture.detectChanges();

    component.saveDashboard();

    expect(savedConfig).not.toBeNull();
    const savedWidget = savedConfig.widgets.find((w: any) => w.id === targetWidget.id);
    expect(savedWidget.grid.x).toBe(8);
    expect(savedWidget.grid.y).toBe(4);
  });
});
