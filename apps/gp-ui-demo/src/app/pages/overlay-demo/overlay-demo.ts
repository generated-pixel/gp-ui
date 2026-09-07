import { Component, inject, signal } from '@angular/core';

import {
  GpButton,
  GpDialog,
  GpConfirmDialog,
  GpConfirmationService,
  GpDrawer,
  GpPopover,
  GpTooltipDirective,
  GpCommandPalette,
  GpCommandPaletteService,
  GpCommandItem,
  GpBottomSheet
} from 'gp-ui';
import { DocCode } from '../../shared/doc-code';
import { DocApiTable, DocApiProperty } from '../../shared/doc-api-table';
import { getComponentDoc } from '../component-docs/component-docs.data';

@Component({
  selector: 'app-overlay-demo',
  standalone: true,
  imports: [
    GpButton,
    GpDialog,
    GpConfirmDialog,
    GpDrawer,
    GpPopover,
    GpTooltipDirective,
    GpCommandPalette,
    GpBottomSheet,
    DocCode,
    DocApiTable
  ],
  templateUrl: './overlay-demo.html',
  styleUrl: './overlay-demo.scss'
})
export class OverlayDemo {
  importCode = `import {
  GpDialog,
  GpConfirmDialog,
  GpConfirmationService,
  GpDrawer,
  GpPopover,
  GpCommandPalette,
  GpBottomSheet,
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

  confirmServiceCode = `export class My {
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
    {
      id: 'act-export-csv',
      title: 'Export Current Dataset as CSV',
      icon: 'download',
      category: 'Actions',
      badge: 'CSV'
    },
    {
      id: 'act-export-excel',
      title: 'Export Current Dataset as Excel XML',
      icon: 'download',
      category: 'Actions',
      badge: 'XLS'
    },
    {
      id: 'pref-contrast',
      title: 'Switch to High Contrast Dark Mode',
      icon: 'moon',
      category: 'Accessibility',
      badge: 'WCAG AAA'
    }
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

  commandPaletteProperties: DocApiProperty[] = getComponentDoc('command-palette')?.properties ?? [];
  bottomSheetProperties: DocApiProperty[] = getComponentDoc('bottom-sheet')?.properties ?? [];
  dialogProperties: DocApiProperty[] = getComponentDoc('dialog')?.properties ?? [];
  drawerProperties: DocApiProperty[] = getComponentDoc('drawer')?.properties ?? [];
  confirmDialogProperties: DocApiProperty[] = getComponentDoc('confirm-dialog')?.properties ?? [];
  popoverProperties: DocApiProperty[] = getComponentDoc('popover')?.properties ?? [];
}
