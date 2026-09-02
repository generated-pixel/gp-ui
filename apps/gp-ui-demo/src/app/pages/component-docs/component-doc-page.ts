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
          <p class="doc-section-desc text-secondary mb-4">
            This component utilizes modern Angular <strong>Signal Inputs</strong> (<code>input()</code>),
            <strong>Two-Way Models</strong> (<code>model()</code>), and
            <strong>Output Signals</strong> (<code>output()</code>).
          </p>
          <doc-api-table title="Properties &amp; Signal Inputs" [properties]="doc.properties" />
          @if (doc.events?.length) {
            <doc-api-table title="Events &amp; Output Signals" [properties]="doc.events" [hasDefaults]="false" />
          }
        </div>

        @if (doc.slug === 'icon') {
          <div class="doc-section">
            <div class="icon-header-row">
              <h2 class="doc-section-title m-0">Available Icons ({{ filteredIconNames.length }})</h2>
              <gp-input-text
                placeholder="Search icons..."
                styleClass="icon-search-input"
                ariaLabel="Search icons"
                (onInputEvent)="onIconSearch($any($event.target).value)"
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
        @case ('label') {
          <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 380px; width: 100%;">
            <div>
              <gp-label
                for="doc-label-demo"
                text="Username"
                [required]="true"
                helpText="Your unique handle identifier"
              />
              <input id="doc-label-demo" gpInputText placeholder="johndoe" />
            </div>
            <div>
              <gp-label for="doc-label-opt" text="Organization" [optional]="true" size="sm" />
              <input id="doc-label-opt" gpInputText placeholder="Acme Global Inc." />
            </div>
          </div>
        }
        @case ('float-label') {
          <div style="display: flex; flex-direction: column; gap: 1.5rem; max-width: 380px; width: 100%;">
            <gp-float-label variant="on">
              <input id="doc-fl-border" gpInputText placeholder=" " />
              <label for="doc-fl-border">Email Address (Border Cutout)</label>
            </gp-float-label>
            <gp-float-label variant="in">
              <input id="doc-fl-in" gpInputText placeholder=" " />
              <label for="doc-fl-in">User ID (Inner Top)</label>
            </gp-float-label>
          </div>
        }
        @case ('inset-label') {
          <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 380px; width: 100%;">
            <gp-inset-label>
              <label for="doc-inset-first">First Name</label>
              <input id="doc-inset-first" gpInputText placeholder="Jane" />
            </gp-inset-label>
            <gp-inset-label>
              <label for="doc-inset-last">Last Name</label>
              <input id="doc-inset-last" gpInputText placeholder="Doe" />
            </gp-inset-label>
          </div>
        }
        @case ('form-field') {
          <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 420px; width: 100%;">
            <gp-form-field
              label="Corporate Email"
              appearance="outlined"
              [required]="true"
              helpText="Used for two-factor authentication"
            >
              <input gpInputText placeholder="name@company.com" />
            </gp-form-field>
            <gp-form-field
              label="Fixed Top Label Mode"
              floatLabel="never"
              hint="Always rendered in top standard position"
            >
              <input gpInputText placeholder="Enter details..." />
            </gp-form-field>
          </div>
        }
        @case ('date-range-picker') {
          <div style="max-width: 380px; width: 100%;">
            <gp-date-range-picker placeholder="Select billing period..." />
          </div>
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
        @case ('html-editor') {
          <div class="w-full">
            <gp-html-editor height="200px" [value]="'<h3>Rich Text Editor</h3><p>Edit formatted content with rich styling, headings, and color swatches.</p>'" />
          </div>
        }
        @case ('md-editor') {
          <div class="w-full">
            <gp-md-editor height="250px" [value]="'# Markdown Editor\n\nLive **markdown** rendering with tables, task lists, and code blocks.'" />
          </div>
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
          <div class="min-w-[220px]"><gp-slider [min]="0" [max]="100" [value]="68" /></div>
        }
        @case ('rating') {
          <gp-rating [value]="4" [max]="5" />
        }
        @case ('color-picker') {
          <div class="flex items-center gap-4">
            <gp-color-picker [value]="'#6366f1'" />
            <span class="text-sm font-mono text-secondary">#6366f1</span>
          </div>
        }
        @case ('input-mask') {
          <div class="min-w-[240px]">
            <gp-input-mask mask="(999) 999-9999" placeholder="(555) 000-0000" helperText="Phone number format" />
          </div>
        }
        @case ('cascade-select') {
          <div class="min-w-[240px]">
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
          <gp-autocomplete [suggestions]="demoCities" placeholder="Search cities (e.g. Rome, Paris, Tokyo...)" />
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
          <div class="w-full max-w-[480px]">
            <gp-table [value]="demoRows">
              <gp-column field="name" header="Project Name" [sortable]="true" />
              <gp-column field="status" header="Status" />
            </gp-table>
          </div>
        }
        @case ('table') {
          <div class="flex flex-col gap-2 min-w-[260px]">
            <div class="flex justify-between py-2 px-3 border border-surface rounded-md">
              <span>Name</span><span>Status</span>
            </div>
            <div class="flex justify-between py-2 px-3 border border-surface rounded-md">
              <span>Alpha</span><span>Ready</span>
            </div>
          </div>
        }
        @case ('tree-table') {
          <div class="w-full max-w-[560px]">
            <gp-tree-table [value]="demoTreeNodes">
              <gp-column field="label" header="Department" />
              <gp-column field="size" header="Size" />
              <gp-column field="type" header="Type" />
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
          <div class="w-full overflow-x-auto p-2">
            <gp-org-chart [value]="demoOrgChartNode" />
          </div>
        }
        @case ('menu') {
          <div class="flex gap-6 flex-wrap items-start">
            <div>
              <gp-menu [model]="demoMenuItems" />
            </div>
            <div>
              <gp-button label="Toggle Popup Menu" icon="bars" (onClickEvent)="demoPopupMenu.toggle($event)" />
              <gp-menu #demoPopupMenu [model]="demoMenuItems" [popup]="true" />
            </div>
          </div>
        }
        @case ('menubar') {
          <div class="w-full">
            <gp-menubar [model]="demoMenubarItems" />
          </div>
        }
        @case ('context-menu') {
          <div
            (contextmenu)="demoContextMenu.show($event)"
            class="py-10 px-8 border-2 border-dashed border-surface rounded-lg cursor-context-menu text-center w-full"
          >
            Right-click anywhere inside this box to trigger Context Menu
            <gp-context-menu #demoContextMenu [model]="demoContextMenuItems" />
          </div>
        }
        @case ('breadcrumb') {
          <gp-breadcrumb [model]="demoMenuItems" [home]="{ icon: 'home' }" />
        }
        @case ('panel-menu') {
          <div class="w-full max-w-[320px]">
            <gp-panel-menu [model]="demoPanelMenuItems" />
          </div>
        }
        @case ('tiered-menu') {
          <div class="flex gap-6 flex-wrap items-start">
            <div>
              <gp-tiered-menu [model]="demoTieredMenuItems" />
            </div>
            <div>
              <gp-button label="Popup Tiered Menu" icon="bars" (onClickEvent)="demoPopupTieredMenu.toggle($event)" />
              <gp-tiered-menu #demoPopupTieredMenu [model]="demoTieredMenuItems" [popup]="true" />
            </div>
          </div>
        }
        @case ('mega-menu') {
          <div class="w-full">
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
          <div class="flex gap-2 flex-wrap">
            <gp-button label="Overview" severity="primary" />
            <gp-button label="Details" variant="outlined" severity="secondary" />
          </div>
        }
        @case ('dock') {
          <div class="relative h-[110px] w-full flex items-end justify-center bg-surface-ground rounded-lg pb-2">
            <gp-dock [model]="demoDockItems" position="bottom" />
          </div>
        }
        @case ('toolbar') {
          <div class="w-full">
            <gp-toolbar>
              <div start class="flex gap-2">
                <gp-button label="New" icon="plus" severity="primary" size="sm" />
                <gp-button label="Open" icon="folder-open" severity="secondary" variant="outlined" size="sm" />
              </div>
              <div end class="flex gap-2">
                <gp-button icon="sliders" severity="secondary" variant="text" size="sm" />
                <gp-button icon="trash" severity="danger" variant="text" size="sm" />
              </div>
            </gp-toolbar>
          </div>
        }
        @case ('dialog') {
          <div>
            <gp-button label="Open Dialog" severity="primary" (onClickEvent)="demoDialogVisible = true" />
            <gp-dialog
              header="Edit Profile"
              [visible]="demoDialogVisible"
              (visibleChange)="demoDialogVisible = $event"
              [maximizable]="true"
            >
              <p class="m-0 mb-4 leading-normal text-primary">
                Make changes to your profile details here. Click save when you're done.
              </p>
              <div footer class="flex justify-end gap-2">
                <gp-button
                  label="Cancel"
                  severity="secondary"
                  variant="outlined"
                  (onClickEvent)="demoDialogVisible = false"
                />
                <gp-button label="Save" severity="primary" (onClickEvent)="demoDialogVisible = false" />
              </div>
            </gp-dialog>
          </div>
        }
        @case ('confirm-dialog') {
          <div>
            <gp-confirm-dialog />
            <gp-button
              label="Trigger Confirm Dialog"
              icon="exclamation-triangle"
              severity="warning"
              (onClickEvent)="triggerConfirm()"
            />
          </div>
        }
        @case ('drawer') {
          <div>
            <gp-button
              label="Open Right Drawer"
              icon="bars"
              severity="primary"
              (onClickEvent)="demoDrawerVisible = true"
            />
            <gp-drawer
              header="Settings &amp; Configuration"
              position="right"
              [visibleProp]="demoDrawerVisible"
              (visibleChange)="demoDrawerVisible = $event"
            >
              <div class="p-5">
                <p class="mt-0">Drawer content panel overlaying page context.</p>
                <gp-button label="Close Drawer" severity="secondary" (onClickEvent)="demoDrawerVisible = false" />
              </div>
            </gp-drawer>
          </div>
        }
        @case ('popover') {
          <div class="flex gap-4 items-center">
            <gp-button
              label="Toggle Popover"
              icon="info-circle"
              severity="info"
              (onClickEvent)="demoPopover.toggle($event)"
            />
            <gp-popover #demoPopover>
              <div class="py-3 px-4 w-[220px]">
                <h4 class="m-0 mb-2 text-sm">Quick Info</h4>
                <p class="m-0 text-xs text-secondary">Contextual popover overlay triggered interactively.</p>
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
          <div class="min-w-[220px]"><gp-divider /></div>
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
            <div class="flex gap-2 flex-wrap">
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
          <div class="min-w-[220px]"><gp-progress-bar [value]="70" /></div>
        }
        @case ('progress-spinner') {
          <gp-progress-spinner [value]="60" />
        }
        @case ('skeleton') {
          <div class="min-w-[220px]"><gp-skeleton width="12rem" height="1rem" /></div>
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
          <div class="flex items-center gap-3 min-w-[220px]">
            <gp-icon name="search" size="1.5em" />
            <gp-icon name="check-circle" size="1.5em" color="var(--gp-success)" />
            <gp-icon name="star-fill" size="1.5em" color="var(--gp-warning)" />
          </div>
        }
        @case ('image') {
          <gp-image src="/img/generated-pixel-logomark.svg" alt="Generated Pixel" width="96px" height="96px" />
        }
        @case ('carousel') {
          <div class="w-full max-w-[520px]">
            <gp-carousel [value]="demoCarouselItems">
              <ng-template #item let-slide>
                <div class="p-6 text-center bg-surface-ground rounded-lg border border-surface">
                  <h3 class="m-0 mb-2 text-lg text-primary">{{ slide.title }}</h3>
                  <p class="m-0 text-sm text-secondary">{{ slide.desc }}</p>
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
          <div class="w-full max-w-[540px]">
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
