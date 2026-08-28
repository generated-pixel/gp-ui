import { GpBaseComponent } from '../../../base/gp-base.component';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';

@Component({
  selector: 'gp-panel',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class GpPanelComponent extends GpBaseComponent {
  @Input() header = '';
  @Input() toggleable = false;
  @Input() showFooter = false;

  @Output() onToggle = new EventEmitter<{ collapsed: boolean }>();

  protected collapsed = signal<boolean>(false);

  @Input() set collapsedProp(val: boolean) {
    this.collapsed.set(val);
  }

  public toggle(): void {
    const next = !this.collapsed();
    this.collapsed.set(next);
    this.onToggle.emit({ collapsed: next });
  }
}
