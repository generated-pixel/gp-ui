import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpTreeComponent, GpOrgChartComponent, GpTreeNode } from 'gp-ui';

@Component({
  selector: 'app-tree-demo',
  standalone: true,
  imports: [CommonModule, GpTreeComponent, GpOrgChartComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Tree & Hierarchical Components</h1>
        <p class="page-desc">Hierarchical data visualization including Tree view and Organization Chart.</p>
      </div>

      <!-- Tree with Checkbox Selection -->
      <div class="doc-section">
        <h2 class="doc-section-title">Tree with Filtering & Checkbox Selection</h2>
        <div class="tree-container">
          <gp-tree [value]="filesTree" selectionMode="checkbox" [filter]="true" />
        </div>
      </div>

      <!-- Organization Chart -->
      <div class="doc-section">
        <h2 class="doc-section-title">Organization Chart</h2>
        <gp-org-chart [value]="orgRoot" />
      </div>
    </div>
  `,
  styles: [`
    .tree-container {
      max-width: 24rem;
    }
  `]
})
export class TreeDemoComponent {
  filesTree: GpTreeNode[] = [
    {
      key: '0',
      label: 'Documents',
      icon: 'folder',
      children: [
        {
          key: '0-0',
          label: 'Work',
          icon: 'folder',
          children: [
            { key: '0-0-0', label: 'Expenses.xlsx', icon: 'file' },
            { key: '0-0-1', label: 'Resume.docx', icon: 'file' }
          ]
        },
        {
          key: '0-1',
          label: 'Home',
          icon: 'folder',
          children: [
            { key: '0-1-0', label: 'Invoices.pdf', icon: 'file' }
          ]
        }
      ]
    },
    {
      key: '1',
      label: 'Pictures',
      icon: 'folder',
      children: [
        { key: '1-0', label: 'barcelona.jpg', icon: 'file' },
        { key: '1-1', label: 'primeui.png', icon: 'file' }
      ]
    }
  ];

  orgRoot: GpTreeNode = {
    label: 'CEO - Sarah Connor',
    icon: 'user',
    children: [
      {
        label: 'CTO - John Connor',
        icon: 'user',
        children: [
          { label: 'Engineering Lead', icon: 'user' },
          { label: 'DevOps Lead', icon: 'user' }
        ]
      },
      {
        label: 'CFO - Kyle Reese',
        icon: 'user',
        children: [
          { label: 'Accounting Manager', icon: 'user' }
        ]
      }
    ]
  };
}
