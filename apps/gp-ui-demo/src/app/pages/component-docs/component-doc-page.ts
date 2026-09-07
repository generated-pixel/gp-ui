import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import {
  GpAccordion,
  GpAccordionTab,
  GpAutoComplete,
  GpAvatar,
  GpBadge,
  GpBlockUI,
  GpBlockUIDirective,
  GpBreadcrumb,
  GpButton,
  GpButtonGroup,
  GpCard,
  GpCarousel,
  GpCascadeSelect,
  GpCheckbox,
  GpChip,
  GpColorPicker,
  GpColumn,
  GpConfirmDialog,
  GpConfirmationService,
  GpContextMenu,
  GpDataView,
  GpDatePicker,
  GpDialog,
  GpDivider,
  GpDock,
  GpDrawer,
  GpEmptyState,
  GpFieldset,
  GpFileUpload,
  GpImage,
  GpInputMask,
  GpInputNumber,
  GpInputText,
  GpListbox,
  GpMegaMenu,
  GpMegaMenuItem,
  GpMenu,
  GpMenuItem,
  GpMenubar,
  GpMenubarItem,
  GpMessage,
  GpMeterGroup,
  GpMultiSelect,
  GpOrgChart,
  GpPaginator,
  GpPanel,
  GpPanelMenu,
  GpPassword,
  GpPopover,
  GpProgressBar,
  GpProgressSpinner,
  GpRadioButton,
  GpRating,
  GpScrollPanel,
  GpSelect,
  GpSkeleton,
  GpSlider,
  GpSpeedDial,
  GpSplitButton,
  GpSplitter,
  GpSplitterPanel,
  GpStep,
  GpStepper,
  GpSwitch,
  GpTable,
  GpTag,
  GpTextarea,
  GpTimePicker,
  GpTimeline,
  GpTieredMenu,
  GpToast,
  GpToastService,
  GpToggleButton,
  GpToolbar,
  GpTree,
  GpTreeSelect,
  GpTreeTable,
  GpVirtualScroller,
  GpLabel,
  GpFloatLabel,
  GpInsetLabel,
  GpFormField,
  GpDateRangePicker,
  GpHtmlEditor,
  GpMdEditor,
  GpInputTextDirective
} from 'gp-ui';
import { GpIcon, GP_DEFAULT_ICONS } from 'gp-ui-icons';
import { DocApiTable } from '../../shared/doc-api-table';
import { DocCode } from '../../shared/doc-code';
import { getComponentDoc } from './component-docs.data';

@Component({
  selector: 'app-component-doc-page',
  standalone: true,
  imports: [
    CommonModule,
    GpAccordion,
    GpAccordionTab,
    GpAutoComplete,
    GpAvatar,
    GpBadge,
    GpBlockUI,
    GpBlockUIDirective,
    GpBreadcrumb,
    GpButton,
    GpButtonGroup,
    GpCard,
    GpCarousel,
    GpCascadeSelect,
    GpCheckbox,
    GpChip,
    GpColorPicker,
    GpColumn,
    GpConfirmDialog,
    GpContextMenu,
    GpDataView,
    GpDatePicker,
    GpDialog,
    GpDivider,
    GpDock,
    GpDrawer,
    GpEmptyState,
    GpFieldset,
    GpFileUpload,
    GpIcon,
    GpImage,
    GpInputMask,
    GpInputNumber,
    GpInputText,
    GpListbox,
    GpMegaMenu,
    GpMenu,
    GpMenubar,
    GpMessage,
    GpMeterGroup,
    GpMultiSelect,
    GpOrgChart,
    GpPaginator,
    GpPanel,
    GpPanelMenu,
    GpPassword,
    GpPopover,
    GpProgressBar,
    GpProgressSpinner,
    GpRadioButton,
    GpRating,
    GpScrollPanel,
    GpSelect,
    GpSkeleton,
    GpSlider,
    GpSpeedDial,
    GpSplitButton,
    GpSplitter,
    GpSplitterPanel,
    GpStep,
    GpStepper,
    GpSwitch,
    GpTable,
    GpTag,
    GpTextarea,
    GpTimePicker,
    GpTimeline,
    GpTieredMenu,
    GpToast,
    GpToggleButton,
    GpToolbar,
    GpTree,
    GpTreeSelect,
    GpTreeTable,
    GpVirtualScroller,
    GpHtmlEditor,
    GpMdEditor,
    GpLabel,
    GpFloatLabel,
    GpInsetLabel,
    GpFormField,
    GpDateRangePicker,
    GpInputTextDirective,
    DocCode,
    DocApiTable
  ],
  templateUrl: './component-doc-page.html',
  styleUrl: './component-doc-page.scss'
})
export class ComponentDocPage implements OnInit {
  private confirmationService = inject(GpConfirmationService);
  private toastService = inject(GpToastService);

  doc: ReturnType<typeof getComponentDoc>;
  allIconNames: string[] = Object.keys(GP_DEFAULT_ICONS);
  searchTerm = '';
  demoDialogVisible = false;
  demoDrawerVisible = false;

  demoOptions = [
    { label: 'Designer', value: 'designer' },
    { label: 'Developer', value: 'developer' },
    { label: 'Manager', value: 'manager' }
  ];

  demoCities = [
    { label: 'Rome, Italy', value: 'rome', subtext: 'Capital of Italy', icon: 'map-pin', badge: 'Europe' },
    { label: 'Paris, France', value: 'paris', subtext: 'Capital of France', icon: 'map-pin', badge: 'Europe' },
    { label: 'New York, USA', value: 'nyc', subtext: 'United States', icon: 'map-pin', badge: 'Americas' },
    { label: 'London, UK', value: 'london', subtext: 'United Kingdom', icon: 'map-pin', badge: 'Europe' },
    { label: 'Tokyo, Japan', value: 'tokyo', subtext: 'Capital of Japan', icon: 'map-pin', badge: 'Asia' },
    { label: 'Berlin, Germany', value: 'berlin', subtext: 'Capital of Germany', icon: 'map-pin', badge: 'Europe' },
    { label: 'Madrid, Spain', value: 'madrid', subtext: 'Capital of Spain', icon: 'map-pin', badge: 'Europe' },
    { label: 'Sydney, Australia', value: 'sydney', subtext: 'Australia', icon: 'map-pin', badge: 'Oceania' }
  ];

  demoRows = [
    { name: 'Alpha', status: 'Ready' },
    { name: 'Beta', status: 'In progress' },
    { name: 'Gamma', status: 'Planned' }
  ];

  demoMenuItems: GpMenuItem[] = [
    { label: 'Overview', icon: 'home' },
    { label: 'Settings', icon: 'sliders' },
    { label: 'Archive', icon: 'folder' }
  ];

  demoMenubarItems: GpMenubarItem[] = [
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

  demoTieredMenuItems: GpMenubarItem[] = [
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

  demoPanelMenuItems: GpMenubarItem[] = [
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

  demoContextMenuItems: GpMenuItem[] = [
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

  demoMegaMenuItems: GpMegaMenuItem[] = [
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
              label: 'Buttons & Triggers',
              icon: 'check',
              description: 'Primary, tonal, split & speed dials',
              iconColor: '#6366f1',
              iconBg: 'rgba(99, 102, 241, 0.12)',
              badge: 'POPULAR'
            },
            {
              label: 'Form Components',
              icon: 'edit',
              description: 'Reactive form controls with Signals',
              iconColor: '#0ea5e9',
              iconBg: 'rgba(14, 165, 233, 0.12)'
            },
            {
              label: 'Data Grids',
              icon: 'table',
              description: 'Tables, trees, paginators & virtual scroll',
              iconColor: '#10b981',
              iconBg: 'rgba(16, 185, 129, 0.12)'
            }
          ]
        },
        {
          label: 'Platform Cloud',
          icon: 'sliders',
          items: [
            {
              label: 'Analytics & Insights',
              icon: 'sliders',
              description: 'Real-time telemetry and audit logging',
              iconColor: '#f59e0b',
              iconBg: 'rgba(245, 158, 11, 0.12)'
            },
            {
              label: 'Storage & Assets',
              icon: 'folder',
              description: 'Distributed CDN media management',
              iconColor: '#8b5cf6',
              iconBg: 'rgba(139, 92, 246, 0.12)'
            }
          ],
          featured: {
            title: 'Enterprise Architecture',
            description: 'Deploy mission-critical Angular applications with zero third-party lock-in.',
            actionLabel: 'Explore'
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
          label: 'Enterprise Use',
          items: [
            { label: 'Security & SSO', icon: 'lock', description: 'SAML, OAuth2, and MFA integrations' },
            { label: 'Compliance Audit', icon: 'check-circle', description: 'Automated SOC2 and HIPAA tracking' }
          ]
        }
      ]
    }
  ];

  demoCascadeOptions = [
    {
      name: 'North America',
      code: 'NA',
      items: [
        {
          name: 'United States',
          code: 'US',
          items: [
            { name: 'California', code: 'CA' },
            { name: 'Texas', code: 'TX' }
          ]
        },
        {
          name: 'Canada',
          code: 'CA_NAT',
          items: [
            { name: 'Ontario', code: 'ON' },
            { name: 'Quebec', code: 'QC' }
          ]
        }
      ]
    }
  ];

  demoOrgChartNode = {
    label: 'Sarah Connor',
    icon: 'user',
    data: { title: 'Chief Executive Officer', department: 'Executive' },
    expanded: true,
    children: [
      {
        label: 'John Connor',
        icon: 'user',
        data: { title: 'Chief Technology Officer', department: 'Engineering' },
        expanded: true,
        children: [
          { label: 'Elena Rostova', icon: 'user', data: { title: 'Lead Architect', department: 'Platform' } },
          { label: 'Marcus Wright', icon: 'user', data: { title: 'Principal Engineer', department: 'Core' } }
        ]
      },
      {
        label: 'Kyle Reese',
        icon: 'user',
        data: { title: 'Chief Financial Officer', department: 'Finance' },
        expanded: true,
        children: [
          { label: 'Katherine Brewster', icon: 'user', data: { title: 'Finance Director', department: 'Accounting' } }
        ]
      }
    ]
  };

  demoDockItems: GpMenuItem[] = [
    { label: 'Finder', icon: 'folder' },
    { label: 'App Store', icon: 'download' },
    { label: 'Settings', icon: 'sliders' },
    { label: 'Code', icon: 'code' }
  ];

  demoCarouselItems = [
    { title: 'Modern UI Components', desc: 'Over 75 accessible, customizable Angular components.' },
    { title: 'Built-in Multi-Theming', desc: 'Seamless Light & Dark mode switching.' },
    { title: 'Zero Third-Party Dependencies', desc: 'Fast, clean, high-performance architecture.' }
  ];

  demoTableData = [
    { id: 'PRJ-101', name: 'Quantum UI Engine', category: 'Core Platform', status: 'Active', budget: '$48,000' },
    { id: 'PRJ-102', name: 'Nexus Cloud Sync', category: 'Infrastructure', status: 'In Review', budget: '$32,500' },
    { id: 'PRJ-103', name: 'Aegis Security Gateway', category: 'Security', status: 'Completed', budget: '$94,000' },
    { id: 'PRJ-104', name: 'Hyperion Analytics', category: 'Data Science', status: 'Active', budget: '$61,200' },
    { id: 'PRJ-105', name: 'Vanguard Design System', category: 'Frontend', status: 'In Review', budget: '$28,000' },
    { id: 'PRJ-106', name: 'Pulse Notification Service', category: 'Messaging', status: 'Active', budget: '$19,500' },
    {
      id: 'PRJ-107',
      name: 'Titan Database Cluster',
      category: 'Infrastructure',
      status: 'Completed',
      budget: '$112,000'
    }
  ];

  demoTreeNodes = [
    {
      label: 'Engineering',
      icon: 'folder',
      expanded: true,
      data: { label: 'Engineering', size: '24 MB', type: 'Folder' },
      children: [
        { label: 'Frontend', icon: 'file-code', data: { label: 'Frontend', size: '12 MB', type: 'Source' } },
        { label: 'Platform', icon: 'server', data: { label: 'Platform', size: '12 MB', type: 'Service' } }
      ]
    },
    {
      label: 'Design',
      icon: 'folder',
      expanded: true,
      data: { label: 'Design', size: '8.4 MB', type: 'Folder' },
      children: [
        { label: 'Product', icon: 'layout', data: { label: 'Product', size: '5 MB', type: 'Figma' } },
        { label: 'Brand', icon: 'palette', data: { label: 'Brand', size: '3.4 MB', type: 'Assets' } }
      ]
    }
  ];

  demoVirtualScrollItems = Array.from({ length: 10000 }, (_, i) => ({
    id: i + 1,
    name: `Enterprise Record #${i + 1}`,
    email: `user.${i + 1}@generatedpixel.dev`,
    role: i % 4 === 0 ? 'Admin' : i % 4 === 1 ? 'Developer' : i % 4 === 2 ? 'Editor' : 'Viewer',
    status: i % 3 === 0 ? 'Active' : i % 3 === 1 ? 'Pending' : 'Offline'
  }));

  demoMeterItems = [
    { label: 'Design', value: 45, color: 'var(--gp-primary)' },
    { label: 'Engineering', value: 30, color: 'var(--gp-info)' },
    { label: 'Operations', value: 25, color: 'var(--gp-success)' }
  ];

  demoTimelineEvents = [
    { status: 'Ordered', date: '15/10/2026 10:30', icon: 'check', color: '#6366f1' },
    { status: 'Processing', date: '15/10/2026 14:00', icon: 'refresh', color: '#f59e0b' },
    { status: 'Shipped', date: '16/10/2026 09:15', icon: 'upload', color: '#0ea5e9' },
    { status: 'Delivered', date: '17/10/2026 16:20', icon: 'check-circle', color: '#10b981' }
  ];

  get filteredIconNames(): string[] {
    if (!this.searchTerm.trim()) {
      return this.allIconNames;
    }
    const term = this.searchTerm.toLowerCase();
    return this.allIconNames.filter((name) => name.toLowerCase().includes(term));
  }

  onIconSearch(value: string): void {
    this.searchTerm = value;
  }

  triggerConfirm(): void {
    this.confirmationService.confirm({
      header: 'Confirm Action',
      message: 'Are you sure you want to proceed with this operation?',
      icon: 'exclamation-triangle',
      accept: () => {
        this.toastService.add({ severity: 'success', summary: 'Confirmed', detail: 'Operation approved.' });
      }
    });
  }

  triggerSuccessToast(): void {
    this.toastService.add({ severity: 'success', summary: 'Success', detail: 'Operation completed successfully.' });
  }

  triggerInfoToast(): void {
    this.toastService.add({ severity: 'info', summary: 'Information', detail: 'New system update available.' });
  }

  triggerWarningToast(): void {
    this.toastService.add({ severity: 'warning', summary: 'Warning', detail: 'Disk usage is near limit.' });
  }

  triggerDangerToast(): void {
    this.toastService.add({ severity: 'error', summary: 'Error', detail: 'Failed to establish database connection.' });
  }

  demoBlockUiDocument = false;
  demoBlockUiTarget = false;
  demoBlockUiDirective = false;

  blockDemoDocument(): void {
    this.demoBlockUiDocument = true;
    setTimeout(() => {
      this.demoBlockUiDocument = false;
      this.cdr.markForCheck();
    }, 2500);
  }

  blockDemoTarget(): void {
    this.demoBlockUiTarget = true;
    setTimeout(() => {
      this.demoBlockUiTarget = false;
      this.cdr.markForCheck();
    }, 2500);
  }

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('component');
      this.doc = slug ? getComponentDoc(slug) : undefined;
      if (this.doc) {
        this.titleService.setTitle(`${this.doc.name} — Angular Component & UI Docs — gp-ui`);
        this.metaService.updateTag({ name: 'description', content: this.doc.description });
        this.metaService.updateTag({ property: 'og:title', content: `${this.doc.name} — gp-ui Angular Component` });
        this.metaService.updateTag({ property: 'og:description', content: this.doc.description });
      }
      this.searchTerm = '';
      this.cdr.markForCheck();
    });
  }
}
