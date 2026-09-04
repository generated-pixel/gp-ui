import { Component, input, signal } from '@angular/core';

import { GpButton } from 'gp-ui';

@Component({
  selector: 'doc-code',
  standalone: true,
  imports: [GpButton],
  template: `
    <div class="doc-code-container">
      <div class="doc-code-header">
        <span class="doc-code-lang">{{ language().toUpperCase() }}</span>
        <gp-button
          [label]="copied() ? 'Copied' : 'Copy'"
          [icon]="copied() ? 'check' : 'copy'"
          size="sm"
          variant="text"
          severity="secondary"
          [styleClass]="'doc-code-copy-btn' + (copied() ? ' doc-code-copied' : '')"
          ariaLabel="Copy code to clipboard"
          (onClickEvent)="copyCode()"
        />
      </div>
      <pre class="doc-code-pre"><code>{{ code() }}</code></pre>
    </div>
  `,
  styles: [
    `
      .doc-code-container {
        background: #0f172a;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: var(--gp-border-radius-md, 8px);
        overflow: hidden;
        margin: 1rem 0;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        max-width: 100%;
        min-width: 0;
        box-sizing: border-box;
      }
      .doc-code-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 1rem;
        background: rgba(255, 255, 255, 0.05);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        box-sizing: border-box;
      }
      .doc-code-lang {
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.75rem;
        font-weight: 700;
        color: #94a3b8;
        letter-spacing: 0.05em;
      }
      .doc-code-copy-btn {
        background: rgba(255, 255, 255, 0.1);
        border: none;
        color: #f8fafc;
        font-size: 0.75rem;
        font-weight: 600;
        padding: 0.25rem 0.6rem;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.15s ease;
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
      }
      .doc-code-copy-btn:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      .doc-code-copied {
        background: var(--gp-success, #10b981) !important;
        color: #ffffff !important;
      }
      .doc-code-pre {
        margin: 0;
        padding: 1.25rem;
        overflow-x: auto;
        font-family: 'JetBrains Mono', monospace;
        font-size: 0.85rem;
        line-height: 1.6;
        color: #e2e8f0;
        max-width: 100%;
        box-sizing: border-box;
        white-space: pre-wrap;
        word-break: break-word;
      }
      .doc-code-pre code {
        background: transparent;
        padding: 0;
        font-family: inherit;
      }
    `
  ]
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
      setTimeout(() => this.copied.set(false), 2000);
    });
  }
}
