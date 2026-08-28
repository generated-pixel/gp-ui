import { GpBaseComponent } from '../../../base/gp-base.component';
import { Component, input, ChangeDetectionStrategy, ViewEncapsulation, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';

@Component({
  selector: 'gp-fieldset',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './fieldset.component.html',
  styleUrl: './fieldset.component.scss'
})
export class GpFieldsetComponent extends GpBaseComponent {
  public legend = input<string>('');
  public toggleable = input<boolean>(false);

  protected collapsed = signal<boolean>(false);

  public toggle(): void {
    this.collapsed.update((v) => !v);
  }
}
