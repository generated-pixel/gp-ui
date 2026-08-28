import { GpBaseComponent } from '../../../base/gp-base.component';
import {
  Component,
  input,
  output,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  signal
} from '@angular/core';
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
  public header = input<string>('');
  public toggleable = input<boolean>(false);
  public showFooter = input<boolean>(false);

  public onToggle = output<{ collapsed: boolean }>();

  protected collapsed = signal<boolean>(false);

  public toggle(): void {
    const next = !this.collapsed();
    this.collapsed.set(next);
    this.onToggle.emit({ collapsed: next });
  }
}
