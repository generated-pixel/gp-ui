import { Component } from '@angular/core';

import { GpTreeComponent, GpOrgChartComponent, GpTreeNode } from 'gp-ui';

@Component({
  selector: 'app-tree-demo',
  standalone: true,
  imports: [GpTreeComponent, GpOrgChartComponent],
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
        <h2 class="doc-section-title">Organization Chart (Interactive &amp; Collapsible)</h2>
        <p class="doc-section-desc">
          Hierarchical organizational structure with collapsible nodes, connector lines, and selection support.
        </p>
        <div
          style="width: 100%; overflow-x: auto; background: var(--gp-surface-ground); border-radius: 8px; padding: 1.5rem 0.5rem; border: 1px solid var(--gp-surface-border);"
        >
          <gp-org-chart [value]="orgRoot" selectionMode="single" [(selection)]="selectedOrgNode" />
        </div>
        @if (selectedOrgNode) {
          <div
            style="margin-top: 1rem; padding: 0.75rem 1rem; background: var(--gp-surface-card); border-radius: 6px; border: 1px solid var(--gp-primary-light);"
          >
            Selected Node: <strong>{{ selectedOrgNode.label }}</strong> ({{
              selectedOrgNode.data?.title || 'Team Member'
            }})
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .tree-container {
        max-width: 24rem;
      }
    `
  ]
})
export class TreeDemoComponent {
  selectedOrgNode: GpTreeNode | null = null;

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
          children: [{ key: '0-1-0', label: 'Invoices.pdf', icon: 'file' }]
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
    label: 'Sarah Connor',
    icon: 'user',
    data: { title: 'Chief Executive Officer', department: 'Executive' },
    children: [
      {
        label: 'John Connor',
        icon: 'user',
        data: { title: 'Chief Technology Officer', department: 'Engineering' },
        children: [
          {
            label: 'Elena Rostova',
            icon: 'user',
            data: { title: 'Lead Architect', department: 'Platform' }
          },
          {
            label: 'Marcus Wright',
            icon: 'user',
            data: { title: 'Principal Engineer', department: 'Infrastructure' }
          }
        ]
      },
      {
        label: 'Kyle Reese',
        icon: 'user',
        data: { title: 'Chief Financial Officer', department: 'Finance' },
        children: [
          {
            label: 'Katherine Brewster',
            icon: 'user',
            data: { title: 'Finance Director', department: 'Accounting' }
          }
        ]
      }
    ]
  };
}
