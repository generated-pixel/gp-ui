import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  GpAccordionComponent,
  GpAccordionTabComponent,
  GpAutoCompleteComponent,
  GpAvatarComponent,
  GpBadgeComponent,
  GpBreadcrumbComponent,
  GpButtonComponent,
  GpCardComponent,
  GpCheckboxComponent,
  GpChipComponent,
  GpDatePickerComponent,
  GpDividerComponent,
  GpEmptyStateComponent,
  GpFieldsetComponent,
  GpFileUploadComponent,
  GpInputNumberComponent,
  GpInputTextComponent,
  GpListboxComponent,
  GpMenuComponent,
  GpMenuItem,
  GpMessageComponent,
  GpMeterGroupComponent,
  GpMultiSelectComponent,
  GpPaginatorComponent,
  GpPanelComponent,
  GpPasswordComponent,
  GpProgressBarComponent,
  GpProgressSpinnerComponent,
  GpRadioButtonComponent,
  GpRatingComponent,
  GpScrollPanelComponent,
  GpSelectComponent,
  GpSkeletonComponent,
  GpSliderComponent,
  GpSpeedDialComponent,
  GpSplitterComponent,
  GpSplitterPanelComponent,
  GpSplitButtonComponent,
  GpStepComponent,
  GpStepperComponent,
  GpSwitchComponent,
  GpTagComponent,
  GpTextareaComponent,
  GpTimePickerComponent,
  GpTimelineComponent,
  GpToggleButtonComponent,
  GpTreeComponent,
  GpTreeSelectComponent,
  GpVirtualScrollerComponent,
  GpDataViewComponent,
  GpImageComponent,
  GpMenubarComponent,
  GpPanelMenuComponent,
  GpTieredMenuComponent
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
    GpCardComponent,
    GpCheckboxComponent,
    GpChipComponent,
    GpDatePickerComponent,
    GpDividerComponent,
    GpEmptyStateComponent,
    GpFieldsetComponent,
    GpFileUploadComponent,
    GpIconComponent,
    GpInputNumberComponent,
    GpInputTextComponent,
    GpListboxComponent,
    GpMenuComponent,
    GpMessageComponent,
    GpMeterGroupComponent,
    GpMultiSelectComponent,
    GpPaginatorComponent,
    GpPanelComponent,
    GpPasswordComponent,
    GpProgressBarComponent,
    GpProgressSpinnerComponent,
    GpRadioButtonComponent,
    GpRatingComponent,
    GpScrollPanelComponent,
    GpSelectComponent,
    GpSkeletonComponent,
    GpSliderComponent,
    GpSpeedDialComponent,
    GpSplitterComponent,
    GpSplitterPanelComponent,
    GpSplitButtonComponent,
    GpStepComponent,
    GpStepperComponent,
    GpSwitchComponent,
    GpTagComponent,
    GpTextareaComponent,
    GpTimePickerComponent,
    GpTimelineComponent,
    GpToggleButtonComponent,
    GpTreeComponent,
    GpTreeSelectComponent,
    GpVirtualScrollerComponent,
    GpDataViewComponent,
    GpImageComponent,
    GpMenubarComponent,
    GpPanelMenuComponent,
    GpTieredMenuComponent,
    DocCodeComponent,
    DocApiTableComponent
  ],
  template: `
    @if (doc) {
      <div class="page-container">
        <div class="page-header">
          <div class="title-row">
            <gp-badge [value]="doc.category" severity="secondary" />
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
          <doc-api-table title="Inputs" [properties]="doc.properties" />
          @if (doc.events?.length) {
            <doc-api-table title="Events" [properties]="doc.events" [hasDefaults]="false" />
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
        @case ('menu') {
          <gp-menu [model]="demoMenuItems" />
        }
        @case ('menubar') {
          <gp-menubar [model]="demoMenuItems" />
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
        @case ('dialog') {
          <gp-button label="Open Dialog" severity="primary" />
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
        @case ('empty-state') {
          <gp-empty-state title="No items yet" message="Start by creating your first record." />
        }
        @case ('meter-group') {
          <gp-meter-group [value]="demoMeterItems" />
        }
        @case ('timeline') {
          <gp-timeline [value]="demoRows" />
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
        padding: 0.5rem 0.75rem;
        border-radius: var(--gp-border-radius-md, 6px);
        border: 1px solid var(--gp-surface-border);
        background: var(--gp-surface-card);
        color: var(--gp-text-color);
        font-size: 0.9rem;
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
  doc: ReturnType<typeof getComponentDoc>;
  allIconNames: string[] = Object.keys(GP_DEFAULT_ICONS);
  searchTerm = '';

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
  demoTreeNodes = [
    { label: 'Engineering', children: [{ label: 'Frontend' }, { label: 'Platform' }] },
    { label: 'Design', children: [{ label: 'Product' }, { label: 'Brand' }] }
  ];
  demoMeterItems = [
    { label: 'Design', value: 45, color: 'var(--gp-primary)' },
    { label: 'Engineering', value: 30, color: 'var(--gp-info)' },
    { label: 'Operations', value: 25, color: 'var(--gp-success)' }
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
