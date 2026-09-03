import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpTree } from './tree';
import { Component } from '@angular/core';
import { GpTreeNode } from '../tree-node/tree-node.interface';

@Component({
  standalone: true,
  imports: [GpTree],
  template: ` <gp-tree [value]="nodes" selectionMode="single" [(selection)]="selectedNode" /> `
})
class TestHostComponent {
  selectedNode: any = null;
  nodes: GpTreeNode[] = [
    {
      label: 'Parent Node',
      expanded: false,
      children: [{ label: 'Child Node' }]
    }
  ];
}

describe('GpTree', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let tree: GpTree;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, GpTree]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    tree = fixture.debugElement.children[0].componentInstance;
  });

  it('should render tree root node and expand on click', () => {
    expect(fixture.nativeElement.textContent).toContain('Parent Node');
    expect(fixture.nativeElement.textContent).not.toContain('Child Node');

    const toggler = fixture.nativeElement.querySelector('.gp-treeselect-toggler');
    expect(toggler).toBeTruthy();
    toggler.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Child Node');
  });
});
