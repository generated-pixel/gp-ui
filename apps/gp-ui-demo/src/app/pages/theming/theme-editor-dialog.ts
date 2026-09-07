import { Component, inject, signal } from '@angular/core';

import { GpButton } from 'gp-ui';
import { GpIcon } from 'gp-ui-icons';
import { ThemeEditor } from './theme-editor';
import { ThemeEditorService } from './theme-editor.service';

@Component({
  selector: 'app-theme-editor-dialog',
  standalone: true,
  imports: [GpButton, GpIcon, ThemeEditor],
  templateUrl: './theme-editor-dialog.html',
  styleUrl: './theme-editor-dialog.scss'
})
export class ThemeEditorDialog {
  public editorService = inject(ThemeEditorService);
  public isMaximized = signal<boolean>(false);

  public toggleMaximize(): void {
    this.isMaximized.update((v) => !v);
  }

  public closeOnBackdrop(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('dialog-backdrop')) {
      this.editorService.close();
    }
  }
}
