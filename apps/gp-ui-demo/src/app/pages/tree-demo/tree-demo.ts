import { Component } from '@angular/core';

import { GpTree, GpOrgChart, GpTreeNode } from 'gp-ui';

@Component({
  selector: 'app-tree-demo',
  standalone: true,
  imports: [GpTree, GpOrgChart],
  templateUrl: './tree-demo.html',
  styleUrl: './tree-demo.scss'
})
export class TreeDemo {
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
