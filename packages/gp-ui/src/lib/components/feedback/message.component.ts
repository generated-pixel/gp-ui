import { GpBaseComponent } from '../../base/gp-base.component';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../icons/icon.component';

export type GpMessageSeverity = 'success' | 'info' | 'warning' | 'error' | 'secondary' | 'contrast';

@Component({
  selector: 'gp-message',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class GpMessageComponent extends GpBaseComponent {
  @Input() severity: GpMessageSeverity = 'info';
  @Input() text = '';
  @Input() icon = '';
  @Input() closable = false;

  @Output() onClose = new EventEmitter<void>();

  protected visible = signal<boolean>(true);

  protected defaultIcon(): string {
    switch (this.severity) {
      case 'success': return 'check-circle';
      case 'warning': return 'exclamation-triangle';
      case 'error': return 'times-circle';
      default: return 'info-circle';
    }
  }

  public close(): void {
    this.visible.set(false);
    this.onClose.emit();
  }
}
