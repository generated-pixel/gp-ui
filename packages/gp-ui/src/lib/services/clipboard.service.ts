import { Injectable, inject } from '@angular/core';
import { GpToastService } from './toast.service';

export interface GpClipboardOptions {
  showToast?: boolean;
  toastMessage?: string;
  toastTitle?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GpClipboardService {
  private toastService = inject(GpToastService, { optional: true });

  /**
   * Copies text to the user's system clipboard using navigator.clipboard
   * with fallback to legacy document.execCommand.
   */
  public async copy(text: string, options: GpClipboardOptions = {}): Promise<boolean> {
    if (!text && text !== '') {
      return false;
    }

    let success = false;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        success = true;
      } else {
        // Fallback for older browsers or non-secure contexts
        success = this.legacyCopy(text);
      }
    } catch (err) {
      console.warn('Navigator clipboard failed, attempting legacy copy fallback:', err);
      success = this.legacyCopy(text);
    }

    if (success && options.showToast !== false && this.toastService) {
      this.toastService.add({
        severity: 'success',
        summary: options.toastTitle || 'Copied to Clipboard',
        detail: options.toastMessage || 'Content has been copied to your clipboard.',
        life: 2500
      });
    }

    return success;
  }

  private legacyCopy(text: string): boolean {
    if (typeof document === 'undefined') {
      return false;
    }
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    let successful = false;
    try {
      successful = document.execCommand('copy');
    } catch (err) {
      console.error('Fallback execCommand copy failed:', err);
    }
    document.body.removeChild(textArea);
    return successful;
  }
}
