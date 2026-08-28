import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from 'gp-ui-icons';
import { ThemeEditorComponent } from './theme-editor.component';
import { ThemeEditorService } from './theme-editor.service';

@Component({
  selector: 'app-theme-editor-dialog',
  standalone: true,
  imports: [CommonModule, GpIconComponent, ThemeEditorComponent],
  template: `
    @if (editorService.isOpen()) {
      <div
        class="dialog-backdrop"
        [class.dialog-backdrop-maximized]="isMaximized()"
        (click)="closeOnBackdrop($event)"
      >
        <div
          class="dialog-window"
          [class.dialog-window-maximized]="isMaximized()"
          role="dialog"
          aria-labelledby="dialog-title"
        >
          <div class="dialog-header">
            <div class="header-title-wrap">
              <gp-icon name="sliders" size="1.25em" class="header-icon" />
              <h2 id="dialog-title">Theme Studio &amp; Angular Token Exporter</h2>
            </div>

            <div class="header-actions">
              <button
                type="button"
                class="header-icon-btn"
                (click)="toggleMaximize()"
                [title]="isMaximized() ? 'Restore Window Size' : 'Expand to Fit Screen'"
                [attr.aria-label]="isMaximized() ? 'Restore Window Size' : 'Expand to Fit Screen'"
              >
                <gp-icon [name]="isMaximized() ? 'compress' : 'expand'" size="1.1em" />
              </button>
              <button
                type="button"
                class="header-icon-btn close-btn"
                (click)="editorService.close()"
                aria-label="Close dialog"
                title="Close Dialog"
              >
                <gp-icon name="xmark" size="1.2em" />
              </button>
            </div>
          </div>

          <div class="dialog-body">
            <app-theme-editor />
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .dialog-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(15, 23, 42, 0.65);
        backdrop-filter: blur(6px);
        z-index: 99999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        animation: fadeIn 0.2s ease-out;

        &.dialog-backdrop-maximized {
          padding: 0;
        }
      }

      .dialog-window {
        background: var(--gp-surface-card, #ffffff);
        color: var(--gp-text-color, #1e293b);
        border: 1px solid var(--gp-surface-border, rgba(0, 0, 0, 0.15));
        border-radius: var(--gp-border-radius-xl, 1rem);
        width: 95vw;
        max-width: 1400px;
        height: 90vh;
        display: flex;
        flex-direction: column;
        box-shadow: var(--gp-shadow-xl, 0 20px 25px -5px rgba(0, 0, 0, 0.2));
        overflow: hidden;
        transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

        &.dialog-window-maximized {
          width: 100vw;
          height: 100vh;
          max-width: 100vw;
          max-height: 100vh;
          border-radius: 0;
          border: none;
        }
      }

      .dialog-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid var(--gp-surface-border, rgba(0, 0, 0, 0.1));
        background: var(--gp-surface-section, #f8fafc);
      }

      .header-title-wrap {
        display: flex;
        align-items: center;
        gap: 0.6rem;
      }

      .header-icon {
        color: var(--gp-primary, #4f46e5);
      }

      .dialog-header h2 {
        margin: 0;
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--gp-text-color, #1e293b);
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 0.4rem;
      }

      .header-icon-btn {
        background: transparent;
        border: none;
        color: var(--gp-text-color-muted, #64748b);
        padding: 0.4rem;
        border-radius: 0.375rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s ease;
      }

      .header-icon-btn:hover {
        background: var(--gp-surface-hover, rgba(0, 0, 0, 0.06));
        color: var(--gp-text-color, #1e293b);
      }

      .close-btn:hover {
        background: rgba(239, 68, 68, 0.15);
        color: #ef4444;
      }

      .dialog-body {
        flex: 1;
        overflow-y: auto;
        padding: 1.25rem;
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `
  ]
})
export class ThemeEditorDialogComponent {
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
