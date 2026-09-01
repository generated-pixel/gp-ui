import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GpButtonComponent,
  GpDialogComponent,
  GpConfirmDialogComponent,
  GpConfirmationService,
  GpDrawerComponent,
  GpPopoverComponent,
  GpTooltipDirective,
  GpCommandPaletteComponent,
  GpCommandPaletteService,
  GpCommandItem,
  GpBottomSheetComponent
} from 'gp-ui';
import { DocCodeComponent } from '../../shared/doc-code.component';
import { DocApiTableComponent, DocApiProperty } from '../../shared/doc-api-table.component';

@Component({
  selector: 'app-overlay-demo',
  standalone: true,
  imports: [
    CommonModule,
    GpButtonComponent,
    GpDialogComponent,
    GpConfirmDialogComponent,
    GpDrawerComponent,
    GpPopoverComponent,
    GpTooltipDirective,
    GpCommandPaletteComponent,
    GpBottomSheetComponent,
    DocCodeComponent,
    DocApiTableComponent
  ],
  template: `
    <div class="page-container">
      <gp-confirm-dialog />

      <div class="page-header">
        <h1>Overlay & Modal Components</h1>
        <p class="page-desc">
          Centralized overlay infrastructure featuring Command Palettes, mobile Bottom Sheets, focus trapping, dynamic z-index layering, off-canvas drawers,
          popovers, and programmatic confirmation dialogs.
        </p>
      </div>

      <!-- Import Section -->
      <div class="doc-section">
        <h2 class="doc-section-title">Import</h2>
        <p class="doc-section-desc">Import overlay components and services:</p>
        <doc-code [code]="importCode" language="typescript" />
      </div>

      <!-- Live Overlays Demo -->
      <div class="doc-section">
        <h2 class="doc-section-title">Interactive Overlays</h2>
        <p class="doc-section-desc">
          Click below to trigger modal dialogs, programmatic confirm dialogs, slide-out drawers, popovers, bottom sheets, and the command palette:
        </p>
        <div class="doc-demo-box" style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
          <gp-button label="Show Dialog" (onClickEvent)="dialog.show()" />
          <gp-button label="Confirmation Dialog" severity="danger" (onClickEvent)="confirmDelete()" />
          <gp-button label="Open Drawer (Left)" severity="secondary" (onClickEvent)="drawer.show()" />
          <gp-button label="Toggle Popover" severity="info" (onClickEvent)="popover.toggle($event)" />
          <gp-button label="Open Bottom Sheet" severity="success" (onClickEvent)="bottomSheetVisible.set(true)" />
          <gp-button label="Open Command Palette (Ctrl+K)" severity="primary" (onClickEvent)="commandPalette.open()" />
          <gp-button label="Hover for Tooltip" [gpTooltip]="'This is an accessible tooltip!'" severity="contrast" />
        </div>
        <doc-code [code]="overlayCode" language="html" />
      </div>

      <!-- Command Palette Demo Section -->
      <div class="doc-section">
        <h2 class="doc-section-title">Command Palette / Omnibar (<span style="font-family: monospace; font-size: 0.9em;">gp-command-palette</span>)</h2>
        <p class="doc-section-desc">
          Power-user search and action dispatcher triggered via <kbd style="padding: 2px 6px; background: var(--gp-surface-ground); border: 1px solid var(--gp-surface-border); border-radius: 4px; font-weight: 600;">Cmd+K</kbd> or <kbd style="padding: 2px 6px; background: var(--gp-surface-ground); border: 1px solid var(--gp-surface-border); border-radius: 4px; font-weight: 600;">Ctrl+K</kbd>. Supports categorization, keyboard navigation, fuzzy search, and nested action drilling.
        </p>
        <doc-code [code]="commandPaletteCode" language="html" />
      </div>

      <!-- Bottom Sheet Demo Section -->
      <div class="doc-section">
        <h2 class="doc-section-title">Mobile Bottom Sheet (<span style="font-family: monospace; font-size: 0.9em;">gp-bottom-sheet</span>)</h2>
        <p class="doc-section-desc">
          Touch-friendly mobile drawer with drag handle, swipe-to-dismiss gesture physics, and safe-area inset support.
        </p>
        <doc-code [code]="bottomSheetCode" language="html" />
      </div>

      <!-- Dialog Component instance -->
      <gp-dialog #dialog header="User Profile Details" [maximizable]="true">
        <p>
          This is a fully accessible, focus-trapped dialog component with maximize, close, and custom footer actions.
        </p>
        <div footer>
          <gp-button label="Cancel" variant="outlined" severity="secondary" (onClickEvent)="dialog.close()" />
          <gp-button label="Save" severity="primary" (onClickEvent)="dialog.close()" />
        </div>
      </gp-dialog>

      <!-- Drawer Component instance -->
      <gp-drawer #drawer header="Sidebar Navigation" position="left">
        <p>Off-canvas sliding drawer with smooth animations and backdrop mask.</p>
      </gp-drawer>

      <!-- Popover Component instance -->
      <gp-popover #popover>
        <div style="padding: 0.25rem;">
          <h4 style="margin: 0 0 0.5rem 0;">Quick Actions</h4>
          <p style="font-size: 0.85rem; color: var(--gp-text-color-secondary); margin: 0 0 0.75rem 0;">
            Tethered floating overlay with auto-positioning.
          </p>
          <gp-button label="Got it" size="sm" (onClickEvent)="popover.hide()" />
        </div>
      </gp-popover>

      <!-- Bottom Sheet Component instance -->
      <gp-bottom-sheet [visible]="bottomSheetVisible()" (visibleChange)="bottomSheetVisible.set($event)" title="Share Options">
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <p style="margin: 0; color: var(--gp-text-color-secondary);">Select how you want to export or share this content:</p>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <gp-button label="Copy Link" icon="link" variant="outlined" (onClickEvent)="bottomSheetVisible.set(false)" />
            <gp-button label="Email Report" icon="mail" variant="outlined" (onClickEvent)="bottomSheetVisible.set(false)" />
            <gp-button label="Download PDF" icon="download" severity="primary" (onClickEvent)="bottomSheetVisible.set(false)" />
          </div>
        </div>
      </gp-bottom-sheet>

      <!-- Command Palette Component instance -->
      <gp-command-palette #commandPalette [items]="demoCommands" (onSelect)="onCommandSelected($event)" />

      <!-- Programmatic Confirmation Service Guide -->
      <div class="doc-section">
        <h2 class="doc-section-title">Programmatic Confirmation Dialog Guide</h2>
        <p class="doc-section-desc">
          Trigger confirmation prompts from TypeScript using <code>GpConfirmationService</code>:
        </p>
        <doc-code [code]="confirmServiceCode" language="typescript" />
      </div>

      <!-- API Reference -->
      <div class="doc-section">
        <h2 class="doc-section-title">API Reference</h2>
        <doc-api-table title="GpCommandPaletteComponent Properties (Inputs)" [properties]="commandPaletteProperties" />
        <doc-api-table title="GpBottomSheetComponent Properties (Inputs)" [properties]="bottomSheetProperties" />
        <doc-api-table title="GpDialogComponent Properties (Inputs)" [properties]="dialogProperties" />
        <doc-api-table title="GpDrawerComponent Properties (Inputs)" [properties]="drawerProperties" />
      </div>
    </div>
  `
})
export class OverlayDemoComponent {
  importCode = `import {
  GpDialogComponent,
  GpConfirmDialogComponent,
  GpConfirmationService,
  GpDrawerComponent,
  GpPopoverComponent,
  GpCommandPaletteComponent,
  GpBottomSheetComponent,
  GpTooltipDirective
} from '@generatedpixel/gp-ui';`;

  overlayCode = `<!-- Command Palette -->
<gp-command-palette [items]="commands" (onSelect)="handleCommand($event)" />

<!-- Mobile Bottom Sheet -->
<gp-bottom-sheet [(visible)]="showSheet" title="Share Options">
  <p>Sheet content here...</p>
</gp-bottom-sheet>

<!-- Modal Dialog -->
<gp-button label="Show Dialog" (onClickEvent)="dialog.show()" />
<gp-dialog #dialog header="Dialog Title" [maximizable]="true">
  <p>Dialog body content...</p>
  <div footer>
    <gp-button label="Close" (onClickEvent)="dialog.close()" />
  </div>
</gp-dialog>`;

  commandPaletteCode = `<gp-command-palette
  shortcut="meta.k, ctrl.k"
  placeholder="Type a command or search..."
  [items]="[
    { id: '1', title: 'New Customer', icon: 'user', category: 'Actions', shortcut: 'Alt+N' },
    { id: '2', title: 'Export Data', icon: 'download', category: 'Data', badge: 'CSV' },
    { id: '3', title: 'Dark Mode', icon: 'moon', category: 'Preferences' }
  ]"
  (onSelect)="executeCommand($event)"
/>`;

  bottomSheetCode = `<gp-bottom-sheet
  [(visible)]="bottomSheetOpen"
  title="Action Sheet"
  [showDragHandle]="true"
  [dismissable]="true"
>
  <div class="action-list">
    <button>Share to Slack</button>
    <button>Export as PDF</button>
  </div>
</gp-bottom-sheet>`;

  confirmServiceCode = `export class MyComponent {
  private confirmationService = inject(GpConfirmationService);

  deleteItem(): void {
    this.confirmationService.confirm({
      header: 'Delete Item',
      message: 'Are you sure you want to proceed?',
      icon: 'exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      accept: () => console.log('Deleted!')
    });
  }
}`;

  public bottomSheetVisible = signal(false);

  public demoCommands: GpCommandItem[] = [
    { id: 'nav-home', title: 'Go to Home / Getting Started', icon: 'file', category: 'Navigation', shortcut: 'G H' },
    { id: 'nav-forms', title: 'Go to Form Controls', icon: 'edit', category: 'Navigation', shortcut: 'G F' },
    { id: 'nav-tables', title: 'Go to Data Tables', icon: 'table', category: 'Navigation', shortcut: 'G T' },
    { id: 'nav-theming', title: 'Go to Theming Studio', icon: 'palette', category: 'Navigation', badge: 'Theme' },
    { id: 'act-export-csv', title: 'Export Current Dataset as CSV', icon: 'download', category: 'Actions', badge: 'CSV' },
    { id: 'act-export-excel', title: 'Export Current Dataset as Excel XML', icon: 'download', category: 'Actions', badge: 'XLS' },
    { id: 'pref-contrast', title: 'Switch to High Contrast Dark Mode', icon: 'moon', category: 'Accessibility', badge: 'WCAG AAA' }
  ];

  private confirmationService = inject(GpConfirmationService);

  public confirmDelete(): void {
    this.confirmationService.confirm({
      header: 'Delete Record',
      message: 'Are you sure you want to permanently delete this customer?',
      icon: 'exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      accept: () => alert('Record deleted!')
    });
  }

  public onCommandSelected(item: GpCommandItem): void {
    alert(`Command Executed: ${item.title}`);
  }

  commandPaletteProperties: DocApiProperty[] = [
    { name: 'items', type: 'GpCommandItem[]', default: '[]', description: 'List of command items and nested actions.' },
    { name: 'shortcut', type: 'string', default: "'meta.k, ctrl.k'", description: 'Global shortcut to toggle command palette.' },
    { name: 'placeholder', type: 'string', default: "'Type a command...'", description: 'Placeholder for omnibar search input.' },
    { name: 'visible', type: 'boolean', default: 'false', description: 'Two-way binding for palette visibility.' }
  ];

  bottomSheetProperties: DocApiProperty[] = [
    { name: 'visible', type: 'boolean', default: 'false', description: 'Controls bottom sheet open/close state.' },
    { name: 'title', type: 'string', default: 'undefined', description: 'Header title text.' },
    { name: 'showDragHandle', type: 'boolean', default: 'true', description: 'Displays top drag bar for touch gestures.' },
    { name: 'dismissable', type: 'boolean', default: 'true', description: 'Allows backdrop touch and swipe-down dismissal.' },
    { name: 'maxHeight', type: 'string', default: "'80vh'", description: 'Maximum height of sheet in viewport.' }
  ];

  dialogProperties: DocApiProperty[] = [
    { name: 'header', type: 'string', default: "''", description: 'Title text in dialog header bar.' },
    { name: 'visible', type: 'boolean', default: 'false', description: 'Controls modal open/close state.' },
    {
      name: 'modal',
      type: 'boolean',
      default: 'true',
      description: 'Renders a backdrop overlay mask behind the dialog.'
    },
    { name: 'closable', type: 'boolean', default: 'true', description: 'Renders a top-right close icon button.' },
    {
      name: 'maximizable',
      type: 'boolean',
      default: 'false',
      description: 'Renders a maximize/restore viewport toggle.'
    }
  ];

  drawerProperties: DocApiProperty[] = [
    { name: 'header', type: 'string', default: "''", description: 'Header title text.' },
    {
      name: 'position',
      type: "'left' | 'right' | 'top' | 'bottom'",
      default: "'left'",
      description: 'Sliding origin side.'
    },
    { name: 'visible', type: 'boolean', default: 'false', description: 'Controls drawer open/close visibility.' }
  ];
}
