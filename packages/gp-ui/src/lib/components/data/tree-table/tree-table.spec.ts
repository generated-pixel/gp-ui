import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpTreeTable } from './tree-table';
import { GpColumn } from '../column/column';
import { Component } from '@angular/core';
import { GpTreeNode } from '../../tree/tree-node/tree-node.interface';

@Component({
  standalone: true,
  imports: [GpTreeTable, GpColumn],
  template: `
    <gp-tree-table [value]="nodes">
      <gp-column field="name" header="Name" />
      <gp-column field="size" header="Size" />
    </gp-tree-table>
  `
})
class TestHostComponent {
  nodes: GpTreeNode[] = [
    {
      label: 'Documents',
      icon: 'folder',
      expanded: false,
      data: { name: 'Documents', size: '10 MB' },
      children: [
        {
          label: 'Resume.pdf',
          icon: 'file',
          data: { name: 'Resume.pdf', size: '2 MB' }
        }
      ]
    }
  ];
}

describe('GpTreeTable', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, GpTreeTable, GpColumn]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render headers and root nodes', () => {
    const table = fixture.nativeElement.querySelector('.gp-treetable');
    expect(table).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Documents');
    expect(fixture.nativeElement.textContent).not.toContain('Resume.pdf');
  });

  it('should expand child node when toggler is clicked', () => {
    const toggler = fixture.nativeElement.querySelector('.gp-treeselect-toggler');
    expect(toggler).toBeTruthy();
    toggler.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Resume.pdf');
  });
});
