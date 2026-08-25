import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy, ViewEncapsulation, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { GpIconComponent } from '../../icons/icon.component';
import { GpToastService } from '../../services/toast.service';
import { GpToastMessage, GpToastPosition } from '../../services/toast.interface';
import { ZIndexService } from '../../overlay/z-index.service';

@Component({
  selector: 'gp-toast',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      class="gp-toast"
      [class]="'gp-toast-' + position"
      [style.z-index]="zIndex()"
      role="region"
      aria-live="polite"
    >
      @for (msg of messages(); track msg.id) {
        <div
          class="gp-toast-message"
          [class]="'gp-toast-message-' + (msg.severity || 'info')"
          role="alert"
        >
          <gp-icon [name]="getSeverityIcon(msg.severity)" size="1.25em" class="gp-toast-icon" />

          <div class="gp-toast-message-text">
            @if (msg.summary) {
              <div class="gp-toast-summary">{{ msg.summary }}</div>
            }
            @if (msg.detail) {
              <div class="gp-toast-detail">{{ msg.detail }}</div>
            }
          </div>

          @if (msg.closable !== false) {
            <button
              type="button"
              class="gp-toast-close-btn"
              (click)="removeMessage(msg)"
              aria-label="Close notification"
            >
              <gp-icon name="times" size="0.85em" />
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .gp-toast {
      position: fixed;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      pointer-events: none;
      width: 24rem;
      max-width: 90vw;
    }
    .gp-toast-top-right { top: 1.5rem; right: 1.5rem; }
    .gp-toast-top-left { top: 1.5rem; left: 1.5rem; }
    .gp-toast-bottom-right { bottom: 1.5rem; right: 1.5rem; }
    .gp-toast-bottom-left { bottom: 1.5rem; left: 1.5rem; }
    .gp-toast-top-center { top: 1.5rem; left: 50%; transform: translateX(-50%); }
    .gp-toast-bottom-center { bottom: 1.5rem; left: 50%; transform: translateX(-50%); }

    .gp-toast-message {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem;
      border-radius: var(--gp-border-radius);
      box-shadow: var(--gp-shadow-lg);
      animation: gp-slide-down 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      border: 1px solid transparent;
    }
    .gp-toast-message-success { background: var(--gp-success-light); border-color: var(--gp-success-border); color: #065f46; }
    .gp-toast-message-success .gp-toast-icon { color: var(--gp-success); }
    .gp-toast-message-info { background: var(--gp-info-light); border-color: var(--gp-info-border); color: #075985; }
    .gp-toast-message-info .gp-toast-icon { color: var(--gp-info); }
    .gp-toast-message-warning { background: var(--gp-warning-light); border-color: var(--gp-warning-border); color: #92400e; }
    .gp-toast-message-warning .gp-toast-icon { color: var(--gp-warning); }
    .gp-toast-message-error { background: var(--gp-danger-light); border-color: var(--gp-danger-border); color: #991b1b; }
    .gp-toast-message-error .gp-toast-icon { color: var(--gp-danger); }

    .gp-toast-message-text {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .gp-toast-summary {
      font-weight: 700;
      font-size: var(--gp-font-size-sm);
    }
    .gp-toast-detail {
      font-size: var(--gp-font-size-xs);
      opacity: 0.9;
    }
    .gp-toast-close-btn {
      background: none;
      border: none;
      color: inherit;
      opacity: 0.6;
      cursor: pointer;
      padding: 0.15rem;
      display: inline-flex;
    }
    .gp-toast-close-btn:hover {
      opacity: 1;
    }
  `]
})
export class GpToastComponent implements OnInit, OnDestroy {
  private toastService = inject(GpToastService);
  private zIndexService = inject(ZIndexService);

  @Input() position: GpToastPosition = 'top-right';

  protected messages = signal<GpToastMessage[]>([]);
  protected zIndex = signal<number>(1200);

  private msgSub?: Subscription;
  private clearSub?: Subscription;

  ngOnInit(): void {
    this.zIndex.set(this.zIndexService.get('toast'));
    this.msgSub = this.toastService.message$.subscribe(msg => {
      this.addMessage(msg);
    });
    this.clearSub = this.toastService.clear$.subscribe(key => {
      this.messages.set([]);
    });
  }

  ngOnDestroy(): void {
    this.msgSub?.unsubscribe();
    this.clearSub?.unsubscribe();
  }

  public addMessage(msg: GpToastMessage): void {
    this.messages.update(prev => [...prev, msg]);
    if (!msg.sticky) {
      setTimeout(() => {
        this.removeMessage(msg);
      }, msg.life || 3500);
    }
  }

  public removeMessage(msg: GpToastMessage): void {
    this.messages.update(prev => prev.filter(m => m.id !== msg.id));
  }

  public getSeverityIcon(severity?: string): string {
    switch (severity) {
      case 'success': return 'check-circle';
      case 'warning': return 'exclamation-triangle';
      case 'error': return 'times-circle';
      default: return 'info-circle';
    }
  }
}
