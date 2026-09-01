import { Directive, HostListener, inject, ElementRef, Renderer2, input, output } from '@angular/core';
import { GpClipboardService } from '../services/clipboard.service';

@Directive({
  selector: '[gpClipboard]',
  standalone: true
})
export class GpClipboardDirective {
  public textToCopy = input<string>('', { alias: 'gpClipboard' });
  public clipboardToast = input<boolean>(true);
  public clipboardMessage = input<string | undefined>(undefined);
  public clipboardTitle = input<string | undefined>(undefined);

  public onCopy = output<string>();
  public onError = output<any>();

  private clipboardService = inject(GpClipboardService);
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  @HostListener('click', ['$event'])
  public async handleClick(event: MouseEvent): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    const targetText = this.textToCopy() || this.el.nativeElement.innerText || '';
    if (!targetText) {
      return;
    }

    try {
      const ok = await this.clipboardService.copy(targetText, {
        showToast: this.clipboardToast(),
        toastMessage: this.clipboardMessage(),
        toastTitle: this.clipboardTitle()
      });

      if (ok) {
        this.triggerCopiedAnimation();
        this.onCopy.emit(targetText);
      } else {
        this.onError.emit(new Error('Failed to copy text'));
      }
    } catch (err) {
      this.onError.emit(err);
    }
  }

  private triggerCopiedAnimation(): void {
    const native = this.el.nativeElement;
    this.renderer.addClass(native, 'gp-clipboard-copied');
    setTimeout(() => {
      this.renderer.removeClass(native, 'gp-clipboard-copied');
    }, 1200);
  }
}
