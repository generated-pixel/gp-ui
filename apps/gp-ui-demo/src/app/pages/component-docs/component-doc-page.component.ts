import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  GpAccordionComponent,
  GpAccordionTabComponent,
  GpAutoCompleteComponent,
  GpAvatarComponent,
  GpBadgeComponent,
  GpBreadcrumbComponent,
  GpButtonComponent,
  GpButtonGroupComponent,
  GpCardComponent,
  GpCarouselComponent,
  GpCascadeSelectComponent,
  GpCheckboxComponent,
  GpChipComponent,
  GpColorPickerComponent,
  GpColumnComponent,
  GpConfirmDialogComponent,
  GpConfirmationService,
  GpContextMenuComponent,
  GpDataViewComponent,
  GpDatePickerComponent,
  GpDividerComponent,
  GpDockComponent,
  GpDrawerComponent,
  GpEmptyStateComponent,
  GpFieldsetComponent,
  GpFileUploadComponent,
  GpImageComponent,
  GpInputMaskComponent,
  GpInputNumberComponent,
  GpInputTextComponent,
  GpListboxComponent,
  GpMegaMenuComponent,
  GpMegaMenuItem,
  GpMenuComponent,
  GpMenuItem,
  GpMenubarComponent,
  GpMessageComponent,
  GpMeterGroupComponent,
  GpMultiSelectComponent,
  GpOrgChartComponent,
  GpPaginatorComponent,
  GpPanelComponent,
  GpPanelMenuComponent,
  GpPasswordComponent,
  GpPopoverComponent,
  GpProgressBarComponent,
  GpProgressSpinnerComponent,
  GpRadioButtonComponent,
  GpRatingComponent,
  GpScrollPanelComponent,
  GpSelectComponent,
  GpSkeletonComponent,
  GpSliderComponent,
  GpSpeedDialComponent,
  GpSplitButtonComponent,
  GpSplitterComponent,
  GpSplitterPanelComponent,
  GpStepComponent,
  GpStepperComponent,
  GpSwitchComponent,
  GpTableComponent,
  GpTagComponent,
  GpTextareaComponent,
  GpTimePickerComponent,
  GpTimelineComponent,
  GpTieredMenuComponent,
  GpToastComponent,
  GpToastService,
  GpToggleButtonComponent,
  GpToolbarComponent,
  GpTreeComponent,
  GpTreeSelectComponent,
  GpTreeTableComponent,
  GpVirtualScrollerComponent
} from 'gp-ui';
import { GpIconComponent, GP_DEFAULT_ICONS } from 'gp-ui-icons';
import { DocApiTableComponent } from '../../shared/doc-api-table.component';
import { DocCodeComponent } from '../../shared/doc-code.component';
import { getComponentDoc } from './component-docs.data';

@Component({
  selector: 'app-component-doc-page',
  standalone: true,
  imports: [
    CommonModule,
    GpAccordionComponent,
    GpAccordionTabComponent,
    GpAutoCompleteComponent,
    GpAvatarComponent,
    GpBadgeComponent,
    GpBreadcrumbComponent,
    GpButtonComponent,
    GpButtonGroupComponent,
    GpCardComponent,
    GpCarouselComponent,
    GpCascadeSelectComponent,
    GpCheckboxComponent,
    GpChipComponent,
    GpColorPickerComponent,
    GpColumnComponent,
    GpConfirmDialogComponent,
    GpContextMenuComponent,
    GpDataViewComponent,
    GpDatePickerComponent,
    GpDividerComponent,
    GpDockComponent,
    GpDrawerComponent,
    GpEmptyStateComponent,
    GpFieldsetComponent,
    GpFileUploadComponent,
    GpIconComponent,
    GpImageComponent,
    GpInputMaskComponent,
    GpInputNumberComponent,
    GpInputTextComponent,
    GpListboxComponent,
    GpMegaMenuComponent,
    GpMenuComponent,
    GpMenubarComponent,
    GpMessageComponent,
    GpMeterGroupComponent,
    GpMultiSelectComponent,
    GpOrgChartComponent,
    GpPaginatorComponent,
    GpPanelComponent,
    GpPanelMenuComponent,
    GpPasswordComponent,
    GpPopoverComponent,
    GpProgressBarComponent,
    GpProgressSpinnerComponent,
    GpRadioButtonComponent,
    GpRatingComponent,
    GpScrollPanelComponent,
    GpSelectComponent,
    GpSkeletonComponent,
    GpSliderComponent,
    GpSpeedDialComponent,
    GpSplitButtonComponent,
    GpSplitterComponent,
    GpSplitterPanelComponent,
    GpStepComponent,
    GpStepperComponent,
    GpSwitchComponent,
    GpTableComponent,
    GpTagComponent,
    GpTextareaComponent,
    GpTimePickerComponent,
    GpTimelineComponent,
    GpTieredMenuComponent,
    GpToastComponent,
    GpToggleButtonComponent,
    GpToolbarComponent,
    GpTreeComponent,
    GpTreeSelectComponent,
    GpTreeTableComponent,
    GpVirtualScrollerComponent,
    DocCodeComponent,
    DocApiTableComponent
  ],
  template: `
    @if (doc) {
      <div class="page-container">
        <div class="page-header">
          <div class="title-row">
            <gp-badge [value]="doc.category" severity="secondary" />
            <gp-tag value="100% Signals" severity="success" [rounded]="true" />
            <h1>{{ doc.name }}</h1>
          </div>
          <p class="page-desc">{{ doc.description }}</p>
        </div>

        <div class="doc-section">
          <h2 class="doc-section-title">Import</h2>
          <doc-code [code]="doc.importStatement" language="typescript" />
        </div>

        <div class="doc-section">
          <h2 class="doc-section-title">Example</h2>
          <div class="doc-demo-box">
            <ng-container [ngTemplateOutlet]="exampleTemplate"></ng-container>
          </div>
          <doc-code [code]="doc.exampleCode" language="html" />
        </div>

        <div class="doc-section">
          <h2 class="doc-section-title">API Reference</h2>
          <p class="doc-section-desc" style="color: var(--gp-text-color-secondary); margin-bottom: 1rem;">
            This component utilizes modern Angular <strong>Signal Inputs</strong> (<code>input()</code>), <strong>Two-Way Models</strong> (<code>model()</code>), and <strong>Output Signals</strong> (<code>output()</code>).
          </p>
          <doc-api-table title="Properties &amp; Signal Inputs" [properties]="doc.properties" />
          @if (doc.events?.length) {
            <doc-api-table title="Events &amp; Output Signals" [properties]="doc.events" [hasDefaults]="false" />
          }
        </div>

        @if (doc.slug === 'icon') {
          <div class="doc-section">
            <div class="icon-header-row">
              <h2 class="doc-section-title" style="margin: 0;">Available Icons ({{ filteredIconNames.length }})</h2>
              <input
                type="text"
                placeholder="Search icons..."
                class="icon-search-input"
                (input)="onIconSearch($any($event.target).value)"
              />
            </div>
            <div class="icon-grid">
              @for (iconName of filteredIconNames; track iconName) {
                <div class="icon-card">
                  <gp-icon [name]="iconName" size="1.75em" />
                  <span class="icon-name">{{ iconName }}</span>
                </div>
              }
            </div>
          </div>
        }
      </div>
    } @else {
      <div class="page-container">
        <div class="page-header">
          <h1>Component not found</h1>
          <p class="page-desc">This component documentation page does not exist yet.</p>
        </div>
      </div>
    }

    <ng-template #exampleTemplate>
      @switch (doc?.slug) {
        @case ('button') {
          <gp-button label="Primary" severity="primary" />
          <gp-button label="Outlined" variant="outlined" severity="secondary" />
        }
        @case ('button-group') {
          <gp-button-group>
            <gp-button label="Daily" severity="secondary" />
            <gp-button label="Weekly" severity="primary" />
            <gp-button label="Monthly" severity="secondary" />
          </gp-button-group>
        }
        @case ('split-button') {
          <gp-split-button label="Save" icon="check" [model]="demoMenuItems" severity="primary" />
        }
        @case ('speed-dial') {
          <gp-speed-dial [model]="demoMenuItems" direction="up" />
        }
        @case ('toggle-button') {
          <gp-toggle-button label="Bold" [value]="true" />
        }
        @case ('input-text') {
          <gp-input-text label="Name" placeholder="Jane Doe" />
        }
        @case ('select') {
          <gp-select [options]="demoOptions" placeholder="Select role" />
        }
        @case ('textarea') {
          <gp-textarea label="Notes" placeholder="Write a short note" [rows]="3" />
        }
        @case ('password') {
          <gp-password label="Password" placeholder="Choose a password" />
        }
        @case ('input-number') {
          <gp-input-number label="Budget" prefix="$" [min]="0" [step]="50" />
        }
        @case ('checkbox') {
          <gp-checkbox label="I agree to the terms" [value]="true" />
        }
        @case ('radio-button') {
          <gp-radio-button value="personal" label="Personal" />
          <gp-radio-button value="business" label="Business" />
        }
        @case ('switch') {
          <gp-switch label="Push notifications" [value]="true" />
        }
        @case ('slider') {
          <div style="min-width: 220px;"><gp-slider [min]="0" [max]="100" [value]="68" /></div>
        }
        @case ('rating') {
          <gp-rating [value]="4" [max]="5" />
        }
        @case ('color-picker') {
          <div style="display:flex; align-items:center; gap:1rem;">
            <gp-color-picker [value]="'#6366f1'" />
            <span style="font-size:0.875rem; font-family:monospace; color:var(--gp-text-color-secondary);">#6366f1</span>
          </div>
        }
        @case ('input-mask') {
          <div style="min-width: 240px;">
            <gp-input-mask mask="(999) 999-9999" placeholder="(555) 000-0000" helperText="Phone number format" />
          </div>
        }
        @case ('cascade-select') {
          <div style="min-width: 240px;">
            <gp-cascade-select [options]="demoCascadeOptions" placeholder="Select location..." />
          </div>
        }
        @case ('multi-select') {
          <gp-multi-select [options]="demoOptions" placeholder="Select skills" />
        }
        @case ('listbox') {
          <gp-listbox [options]="demoOptions" />
        }
        @case ('autocomplete') {
          <gp-autocomplete [suggestions]="demoOptions" placeholder="Search cities" />
        }
        @case ('tree-select') {
          <gp-tree-select [options]="demoTreeNodes" placeholder="Select department" />
        }
        @case ('date-picker') {
          <gp-date-picker placeholder="MM/DD/YYYY" />
        }
        @case ('time-picker') {
          <gp-time-picker hourFormat="12" />
        }
        @case ('file-upload') {
          <gp-file-upload [multiple]="true" accept="image/*" />
        }
        @case ('column') {
          <div style="width: 100%; max-width: 480px;">
            <gp-table [value]="demoRows">
              <gp-column field="name" header="Project Name" [sortable]="true" />
              <gp-column field="status" header="Status" />
            </gp-table>
          </div>
        }
        @case ('table') {
          <div style="display:flex; flex-direction:column; gap:0.5rem; min-width:260px;">
            <div
              style="display:flex; justify-content:space-between; padding:0.5rem 0.75rem; border:1px solid var(--gp-surface-border); border-radius:6px;"
            >
              <span>Name</span><span>Status</span>
            </div>
            <div
              style="display:flex; justify-content:space-between; padding:0.5rem 0.75rem; border:1px solid var(--gp-surface-border); border-radius:6px;"
            >
              <span>Alpha</span><span>Ready</span>
            </div>
          </div>
        }
        @case ('tree-table') {
          <div style="width: 100%; max-width: 480px;">
            <gp-tree-table [value]="demoTreeNodes">
              <gp-column field="label" header="Department" />
            </gp-tree-table>
          </div>
        }
        @case ('paginator') {
          <gp-paginator [totalRecords]="200" [rows]="10" />
        }
        @case ('data-view') {
          <gp-data-view [value]="demoRows" layout="grid" />
        }
        @case ('virtual-scroller') {
          <gp-virtual-scroller [items]="demoRows" [itemSize]="48" />
        }
        @case ('tree') {
          <gp-tree [value]="demoTreeNodes" selectionMode="single" />
        }
        @case ('org-chart') {
          <div style="width: 100%; overflow-x: auto; padding: 0.5rem;">
            <gp-org-chart [value]="demoOrgChartNode" />
          </div>
        }
        @case ('menu') {
          <gp-menu [model]="demoMenuItems" />
        }
        @case ('menubar') {
          <gp-menubar [model]="demoMenuItems" />
        }
        @case ('context-menu') {
          <div
            (contextmenu)="demoContextMenu.show($event)"
            style="padding: 1.5rem 2rem; border: 2px dashed var(--gp-surface-border); border-radius: 8px; cursor: context-menu; text-align: center; width: 100%;"
          >
            Right-click anywhere inside this box to trigger Context Menu
            <gp-context-menu #demoContextMenu [model]="demoMenuItems" />
          </div>
        }
        @case ('breadcrumb') {
          <gp-breadcrumb [model]="demoMenuItems" />
        }
        @case ('panel-menu') {
          <gp-panel-menu [model]="demoMenuItems" />
        }
        @case ('tiered-menu') {
          <gp-tiered-menu [model]="demoMenuItems" />
        }
        @case ('mega-menu') {
          <div style="width: 100%;">
            <gp-mega-menu [model]="demoMegaMenuItems" />
          </div>
        }
        @case ('stepper') {
          <gp-stepper>
            <gp-step label="Account" />
            <gp-step label="Profile" />
            <gp-step label="Review" />
          </gp-stepper>
        }
        @case ('tabs') {
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <gp-button label="Overview" severity="primary" />
            <gp-button label="Details" variant="outlined" severity="secondary" />
          </div>
        }
        @case ('dock') {
          <div style="position: relative; height: 110px; width: 100%; display: flex; align-items: flex-end; justify-content: center; background: var(--gp-surface-ground); border-radius: 8px; padding-bottom: 0.5rem;">
            <gp-dock [model]="demoDockItems" position="bottom" />
          </div>
        }
        @case ('toolbar') {
          <div style="width: 100%;">
            <gp-toolbar>
              <div start style="display:flex; gap:0.5rem;">
                <gp-button label="New" icon="plus" severity="primary" size="sm" />
                <gp-button label="Open" icon="folder-open" severity="secondary" variant="outlined" size="sm" />
              </div>
              <div end style="display:flex; gap:0.5rem;">
                <gp-button icon="sliders" severity="secondary" variant="text" size="sm" />
                <gp-button icon="trash" severity="danger" variant="text" size="sm" />
              </div>
            </gp-toolbar>
          </div>
        }
        @case ('dialog') {
          <gp-button label="Open Dialog" severity="primary" />
        }
        @case ('confirm-dialog') {
          <div>
            <gp-confirm-dialog />
            <gp-button label="Trigger Confirm Dialog" icon="exclamation-triangle" severity="warning" (onClickEvent)="triggerConfirm()" />
          </div>
        }
        @case ('drawer') {
          <div>
            <gp-button label="Open Right Drawer" icon="bars" severity="primary" (onClickEvent)="demoDrawerVisible = true" />
            <gp-drawer header="Settings &amp; Configuration" position="right" [visibleProp]="demoDrawerVisible" (visibleChange)="demoDrawerVisible = $event">
              <div style="padding: 1.25rem;">
                <p style="margin-top:0;">Drawer content panel overlaying page context.</p>
                <gp-button label="Close Drawer" severity="secondary" (onClickEvent)="demoDrawerVisible = false" />
              </div>
            </gp-drawer>
          </div>
        }
        @case ('popover') {
          <div style="display:flex; gap:1rem; align-items:center;">
            <gp-button label="Toggle Popover" icon="info-circle" severity="info" (onClickEvent)="demoPopover.toggle($event)" />
            <gp-popover #demoPopover>
              <div style="padding: 0.75rem 1rem; width: 220px;">
                <h4 style="margin: 0 0 0.5rem 0; font-size: 0.9rem;">Quick Info</h4>
                <p style="margin: 0; font-size: 0.8rem; color: var(--gp-text-color-secondary);">
                  Contextual popover overlay triggered interactively.
                </p>
              </div>
            </gp-popover>
          </div>
        }
        @case ('card') {
          <gp-card header="Project Summary">A concise overview of the project state.</gp-card>
        }
        @case ('panel') {
          <gp-panel header="Project Summary">A concise overview of the project state.</gp-panel>
        }
        @case ('accordion') {
          <gp-accordion>
            <gp-accordion-tab header="Overview">A concise overview of the project state.</gp-accordion-tab>
            <gp-accordion-tab header="Details">Additional project details.</gp-accordion-tab>
          </gp-accordion>
        }
        @case ('fieldset') {
          <gp-fieldset legend="Profile">Contact details and preferences.</gp-fieldset>
        }
        @case ('divider') {
          <div style="min-width: 220px;"><gp-divider /></div>
        }
        @case ('scroll-panel') {
          <gp-scroll-panel height="8rem">Scrollable content preview.</gp-scroll-panel>
        }
        @case ('splitter') {
          <gp-splitter [style]="{ 'min-width': '320px' }">
            <gp-splitter-panel>Navigation</gp-splitter-panel>
            <gp-splitter-panel>Content</gp-splitter-panel>
          </gp-splitter>
        }
        @case ('toast') {
          <div>
            <gp-toast />
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              <gp-button label="Success Toast" severity="success" size="sm" (onClickEvent)="triggerSuccessToast()" />
              <gp-button label="Info Toast" severity="info" size="sm" (onClickEvent)="triggerInfoToast()" />
              <gp-button label="Warning Toast" severity="warning" size="sm" (onClickEvent)="triggerWarningToast()" />
              <gp-button label="Danger Toast" severity="danger" size="sm" (onClickEvent)="triggerDangerToast()" />
            </div>
          </div>
        }
        @case ('message') {
          <gp-message severity="success" text="Saved successfully" />
        }
        @case ('progress-bar') {
          <div style="min-width: 220px;"><gp-progress-bar [value]="70" /></div>
        }
        @case ('progress-spinner') {
          <gp-progress-spinner [value]="60" />
        }
        @case ('skeleton') {
          <div style="min-width: 220px;"><gp-skeleton width="12rem" height="1rem" /></div>
        }
        @case ('tag') {
          <gp-tag value="Beta" severity="secondary" />
        }
        @case ('chip') {
          <gp-chip label="New" />
        }
        @case ('avatar') {
          <gp-avatar label="JD" size="normal" />
        }
        @case ('badge') {
          <gp-badge [value]="'New'" severity="primary" />
        }
        @case ('icon') {
          <div style="display:flex; align-items:center; gap:0.75rem; min-width:220px;">
            <gp-icon name="search" size="1.5em" />
            <gp-icon name="check-circle" size="1.5em" color="var(--gp-success)" />
            <gp-icon name="star-fill" size="1.5em" color="var(--gp-warning)" />
          </div>
        }
        @case ('image') {
          <gp-image src="/img/generated-pixel-logomark.svg" alt="Generated Pixel" width="96px" height="96px" />
        }
        @case ('carousel') {
          <div style="width: 100%; max-width: 520px;">
            <gp-carousel [value]="demoCarouselItems">
              <ng-template #item let-slide>
                <div style="padding: 1.5rem; text-align: center; background: var(--gp-surface-ground); border-radius: 8px; border: 1px solid var(--gp-surface-border);">
                  <h3 style="margin: 0 0 0.5rem 0; font-size: 1.1rem; color: var(--gp-primary);">{{ slide.title }}</h3>
                  <p style="margin: 0; font-size: 0.875rem; color: var(--gp-text-color-secondary);">{{ slide.desc }}</p>
                </div>
              </ng-template>
            </gp-carousel>
          </div>
        }
        @case ('empty-state') {
          <gp-empty-state title="No items yet" message="Start by creating your first record." />
        }
        @case ('meter-group') {
          <gp-meter-group [value]="demoMeterItems" />
        }
        @case ('timeline') {
          <div style="width: 100%; max-width: 540px;">
            <gp-timeline [value]="demoTimelineEvents" />
          </div>
        }
        @default {
          <div class="unavailable-preview">
            <gp-icon name="code" size="1em" />
            <span>Interactive preview coming soon for this component.</span>
          </div>
        }
      }
    </ng-template>
  `,
  styles: [
    `
      .title-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;
      }
      .title-row h1 {
        margin: 0;
      }
      .doc-demo-box {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        align-items: center;
        padding: 1.25rem;
        border: 1px solid var(--gp-surface-border);
        border-radius: var(--gp-border-radius-md, 8px);
        background: var(--gp-surface-card);
      }
      .icon-header-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        flex-wrap: wrap;
        gap: 0.75rem;
      }
      .icon-search-input {
        padding: 0.4rem 0.75rem;
        border-radius: 6px;
        border: 1px solid var(--gp-surface-border);
        background: var(--gp-surface-ground);
        color: var(--gp-text-color);
        font-size: 0.85rem;
        outline: none;
        min-width: 200px;
      }
      .icon-search-input:focus {
        border-color: var(--gp-primary);
      }
      .icon-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
        gap: 0.75rem;
      }
      .icon-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 1rem 0.5rem;
        border: 1px solid var(--gp-surface-border);
        border-radius: var(--gp-border-radius-md, 8px);
        background: var(--gp-surface-card);
        transition:
          transform 0.15s ease,
          border-color 0.15s ease;
      }
      .icon-card:hover {
        transform: translateY(-2px);
        border-color: var(--gp-primary);
      }
      .icon-name {
        font-size: 0.75rem;
        color: var(--gp-text-color-secondary);
        font-family: monospace;
        word-break: break-all;
        text-align: center;
      }
    `
  ]
})
export class ComponentDocPageComponent implements OnInit {
  private confirmationService = inject(GpConfirmationService);
  private toastService = inject(GpToastService);

  doc: ReturnType<typeof getComponentDoc>;
  allIconNames: string[] = Object.keys(GP_DEFAULT_ICONS);
  searchTerm = '';
  demoDrawerVisible = false;

  demoOptions = [
    { label: 'Designer', value: 'designer' },
    { label: 'Developer', value: 'developer' },
    { label: 'Manager', value: 'manager' }
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
  demoMegaMenuItems: GpMegaMenuItem[] = [
    {
      label: 'Products',
      root: true,
      columns: [
        {
          label: 'Components',
          items: [
            { label: 'Buttons', icon: 'check' },
            { label: 'Forms', icon: 'edit' }
          ]
        },
        {
          label: 'Services',
          items: [
            { label: 'Analytics', icon: 'sliders' },
            { label: 'Storage', icon: 'folder' }
          ]
        }
      ]
    },
    {
      label: 'Solutions',
      root: true,
      columns: [
        {
          label: 'Enterprise',
          items: [
            { label: 'Security', icon: 'lock' },
            { label: 'Compliance', icon: 'check-circle' }
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
    label: 'CEO',
    expanded: true,
    children: [
      {
        label: 'CTO',
        expanded: true,
        children: [{ label: 'Lead Architect' }, { label: 'Principal Engineer' }]
      },
      {
        label: 'CFO',
        expanded: true,
        children: [{ label: 'Finance Manager' }]
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
  demoTreeNodes = [
    { label: 'Engineering', children: [{ label: 'Frontend' }, { label: 'Platform' }] },
    { label: 'Design', children: [{ label: 'Product' }, { label: 'Brand' }] }
  ];
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

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('component');
      this.doc = slug ? getComponentDoc(slug) : undefined;
      this.searchTerm = '';
      this.cdr.markForCheck();
    });
  }
}
