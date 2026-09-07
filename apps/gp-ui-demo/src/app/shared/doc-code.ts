import { Component, input, signal } from '@angular/core';

import { GpButton } from 'gp-ui';

@Component({
  selector: 'doc-code',
  standalone: true,
  imports: [GpButton],
  templateUrl: './doc-code.html',
  styleUrl: './doc-code.scss'
})
export class DocCode {
  public code = input<string>('');
  public language = input<string>('html');

  protected copied = signal(false);

  protected copyCode(): void {
    const text = this.code();
    if (!text) {
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      this.copied.set(true);
      setTimeout(() => {
        this.copied.set(false);
      }, 2000);
    });
  }
}
