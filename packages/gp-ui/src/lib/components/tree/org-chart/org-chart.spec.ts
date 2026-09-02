import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GpOrgChart } from './org-chart';
import { GpTreeNode } from '../tree-node/tree-node.interface';

@Component({
  standalone: true,
  imports: [GpOrgChart],
  template: ' <gp-org-chart [value]="rootNode" selectionMode="single" [(selection)]="selectedNode" /> '
})
class TestOrgChartHost {
  selectedNode: GpTreeNode | null = null;

  rootNode: GpTreeNode = {
    label: 'CEO',
    data: { title: 'Executive' },
    children: [
      {
        label: 'CTO',
        data: { title: 'Engineering' },
        children: [{ label: 'Lead Developer' }]
      },
      {
        label: 'CFO',
        data: { title: 'Finance' }
      }
    ]
  };
}

describe('GpOrgChart', () => {
  let fixture: ComponentFixture<TestOrgChartHost>;
  let host: TestOrgChartHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestOrgChartHost]
    }).compileComponents();

    fixture = TestBed.createComponent(TestOrgChartHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render root and child nodes', () => {
    const nodeLabels = fixture.nativeElement.querySelectorAll('.gp-orgchart-node-label');
    expect(nodeLabels.length).toBeGreaterThanOrEqual(3);
    expect(nodeLabels[0].textContent.trim()).toBe('CEO');
  });

  it('should toggle node expansion when toggler button is clicked', () => {
    const chart = fixture.debugElement.children[0].componentInstance as GpOrgChart;
    const root = host.rootNode;

    expect(chart.isExpanded(root)).toBe(true);

    chart.toggleNode(root, new MouseEvent('click'));
    fixture.detectChanges();
    expect(chart.isExpanded(root)).toBe(false);

    chart.toggleNode(root, new MouseEvent('click'));
    fixture.detectChanges();
    expect(chart.isExpanded(root)).toBe(true);
  });

  it('should support node selection in single mode', () => {
    const chart = fixture.debugElement.children[0].componentInstance as GpOrgChart;
    const cto = host.rootNode.children![0];

    expect(chart.isSelected(cto)).toBe(false);

    chart.onNodeClick(cto, new MouseEvent('click'));
    fixture.detectChanges();
    expect(chart.isSelected(cto)).toBe(true);
    expect(host.selectedNode).toBe(cto);

    chart.onNodeClick(cto, new MouseEvent('click'));
    fixture.detectChanges();
    expect(chart.isSelected(cto)).toBe(false);
    expect(host.selectedNode).toBeNull();
  });
});
