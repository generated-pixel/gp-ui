import { Component } from '@angular/core';

import {
  GpMenubar,
  GpMenu,
  GpContextMenu,
  GpTieredMenu,
  GpMegaMenu,
  GpPanelMenu,
  GpBreadcrumb,
  GpTabs,
  GpTabPanel,
  GpStepper,
  GpStep,
  GpDock,
  GpToolbar,
  GpButton,
  GpMenubarItem,
  GpMegaMenuItem,
  GpMenuItem
} from 'gp-ui';
import { DocCode } from '../../shared/doc-code';
import { DocApiTable, DocApiProperty } from '../../shared/doc-api-table';
import { getComponentDoc } from '../component-docs/component-docs.data';

@Component({
  selector: 'app-navigation-demo',
  standalone: true,
  imports: [
    GpMenubar,
    GpMenu,
    GpContextMenu,
    GpTieredMenu,
    GpMegaMenu,
    GpPanelMenu,
    GpBreadcrumb,
    GpTabs,
    GpTabPanel,
    GpStepper,
    GpStep,
    GpDock,
    GpToolbar,
    GpButton,
    DocCode,
    DocApiTable
  ],
  templateUrl: './navigation-demo.html',
  styleUrl: './navigation-demo.scss'
})
export class NavigationDemo {
  importCode = `import {
  GpMenubar,
  GpMenu,
  GpContextMenu,
  GpTieredMenu,
  GpMegaMenu,
  GpPanelMenu,
  GpTabs,
  GpTabPanel,
  GpStepper,
  GpStep,
  GpBreadcrumb,
  GpDock,
  GpToolbar
} from '@generatedpixel/gp-ui';`;

  menubarCode = `<gp-menubar [model]="menubarItems">
  <div start><strong>MyApp</strong></div>
  <div end><gp-button label="Profile" size="sm" /></div>
</gp-menubar>`;

  breadcrumbCode = '<gp-breadcrumb [model]="breadcrumbItems" [home]="{ icon: \'home\' }" />';

  tabsCode = `<gp-tabs>
  <gp-tab-panel header="Overview" icon="home">Overview tab content...</gp-tab-panel>
  <gp-tab-panel header="Settings" icon="sliders" [closable]="true">Settings tab content...</gp-tab-panel>
</gp-tabs>`;

  stepperCode = `<gp-stepper #stepper>
  <gp-step label="Step 1">
    <p>Step 1 content...</p>
    <gp-button label="Next" (onClickEvent)="stepper.next()" />
  </gp-step>
  <gp-step label="Step 2">
    <p>Step 2 content...</p>
  </gp-step>
</gp-stepper>`;

  menubarItems: GpMenubarItem[] = [
    {
      label: 'File',
      icon: 'file',
      items: [
        { label: 'New Project', icon: 'plus' },
        {
          label: 'Open',
          icon: 'folder-open',
          items: [
            { label: 'Workspace', icon: 'window' },
            { label: 'Recent Files', icon: 'clock' }
          ]
        },
        { separator: true },
        { label: 'Export', icon: 'download', badge: 'PRO' }
      ]
    },
    {
      label: 'Edit',
      icon: 'edit',
      items: [
        { label: 'Undo', icon: 'refresh' },
        { label: 'Copy', icon: 'copy' }
      ]
    },
    { label: 'Users', icon: 'user' },
    { label: 'Settings', icon: 'sliders' }
  ];

  menuItems: GpMenuItem[] = [
    { label: 'Dashboard', icon: 'home' },
    { label: 'Messages', icon: 'envelope', badge: '3' },
    { label: 'Settings', icon: 'sliders' },
    { separator: true },
    { label: 'Logout', icon: 'sign-out' }
  ];

  tieredMenuItems: GpMenubarItem[] = [
    {
      label: 'File',
      icon: 'file',
      items: [
        { label: 'New Document', icon: 'plus' },
        {
          label: 'Export As',
          icon: 'download',
          items: [
            { label: 'PDF Document', icon: 'file' },
            { label: 'CSV Sheet', icon: 'table' },
            { label: 'JSON Data', icon: 'code' }
          ]
        }
      ]
    },
    {
      label: 'Edit',
      icon: 'edit',
      items: [
        { label: 'Undo', icon: 'refresh' },
        { label: 'Redo', icon: 'refresh' }
      ]
    },
    { label: 'Help', icon: 'question-circle' }
  ];

  megaMenuItems: GpMegaMenuItem[] = [
    {
      label: 'Products',
      icon: 'window',
      root: true,
      columns: [
        {
          label: 'UI Framework',
          icon: 'palette',
          items: [
            {
              label: 'Buttons & Actions',
              icon: 'check',
              description: 'Interactive buttons, split triggers & speed dials',
              iconColor: '#6366f1',
              iconBg: 'rgba(99, 102, 241, 0.12)',
              badge: 'NEW',
              badgeSeverity: 'success'
            },
            {
              label: 'Form Controls',
              icon: 'edit',
              description: '20+ accessible form components with signals',
              iconColor: '#0ea5e9',
              iconBg: 'rgba(14, 165, 233, 0.12)'
            },
            {
              label: 'Data Tables',
              icon: 'table',
              description: 'Sorting, filtering, pagination & virtual scroll',
              iconColor: '#10b981',
              iconBg: 'rgba(16, 185, 129, 0.12)'
            }
          ]
        },
        {
          label: 'Platform Services',
          icon: 'sliders',
          items: [
            {
              label: 'Theme Engine',
              icon: 'sliders',
              description: '8 curated color palettes with dark mode support',
              iconColor: '#f59e0b',
              iconBg: 'rgba(245, 158, 11, 0.12)'
            },
            {
              label: 'Cloud Sync',
              icon: 'folder',
              description: 'Real-time reactive state synchronization',
              iconColor: '#8b5cf6',
              iconBg: 'rgba(139, 92, 246, 0.12)'
            },
            {
              label: 'Enterprise Security',
              icon: 'lock',
              description: 'Role-based access control & SOC2 compliance',
              iconColor: '#ec4899',
              iconBg: 'rgba(236, 72, 153, 0.12)'
            }
          ],
          featured: {
            title: 'GP-UI Enterprise Suite',
            description: 'Unlock 75+ advanced components, templates & priority SLA support.',
            actionLabel: 'Learn More'
          }
        }
      ]
    },
    {
      label: 'Solutions',
      icon: 'layer-group',
      root: true,
      columns: [
        {
          label: 'By Use Case',
          items: [
            {
              label: 'Admin Dashboards',
              icon: 'window',
              description: 'High-density metrics, tables, and analytics'
            },
            {
              label: 'Design Systems',
              icon: 'palette',
              description: 'Tokenized multi-brand styling architecture'
            }
          ]
        },
        {
          label: 'By Industry',
          items: [
            {
              label: 'Fintech & Banking',
              icon: 'dollar-sign',
              description: 'Strict security, validation & real-time streams'
            },
            {
              label: 'Healthcare',
              icon: 'heart',
              description: 'HIPAA-compliant, accessible interfaces'
            }
          ]
        }
      ]
    },
    {
      label: 'Documentation',
      icon: 'file',
      routerLink: '/getting-started'
    }
  ];

  panelMenuItems: GpMenubarItem[] = [
    {
      label: 'Documents',
      icon: 'folder',
      items: [
        {
          label: 'Work',
          icon: 'folder',
          items: [
            { label: 'Resume.pdf', icon: 'file' },
            { label: 'Proposal.docx', icon: 'file' }
          ]
        },
        { label: 'Personal', icon: 'folder' }
      ]
    },
    {
      label: 'Settings',
      icon: 'sliders',
      items: [
        { label: 'Profile', icon: 'user' },
        { label: 'Security', icon: 'lock' },
        { label: 'Billing', icon: 'dollar-sign' }
      ]
    }
  ];

  contextMenuItems: GpMenuItem[] = [
    { label: 'Cut', icon: 'cut' },
    { label: 'Copy', icon: 'copy' },
    { label: 'Paste', icon: 'paste' },
    { separator: true },
    {
      label: 'Share',
      icon: 'share-alt',
      items: [
        { label: 'Copy Link', icon: 'link' },
        { label: 'Email Report', icon: 'envelope' }
      ]
    },
    { separator: true },
    { label: 'Delete', icon: 'trash' }
  ];

  breadcrumbItems = [{ label: 'Components' }, { label: 'Navigation' }, { label: 'Breadcrumb' }];

  dockItems = [
    { icon: 'home', label: 'Home' },
    { icon: 'search', label: 'Search' },
    { icon: 'calendar', label: 'Calendar' },
    { icon: 'user', label: 'Profile' },
    { icon: 'sliders', label: 'Settings' }
  ];

  tabsProperties: DocApiProperty[] = getComponentDoc('tabs')?.properties ?? [];
  stepperProperties: DocApiProperty[] = getComponentDoc('stepper')?.properties ?? [];
  panelMenuProperties: DocApiProperty[] = getComponentDoc('panel-menu')?.properties ?? [];
  menubarProperties: DocApiProperty[] = getComponentDoc('menubar')?.properties ?? [];
  breadcrumbProperties: DocApiProperty[] = getComponentDoc('breadcrumb')?.properties ?? [];
  dockProperties: DocApiProperty[] = getComponentDoc('dock')?.properties ?? [];
  toolbarProperties: DocApiProperty[] = getComponentDoc('toolbar')?.properties ?? [];
}
