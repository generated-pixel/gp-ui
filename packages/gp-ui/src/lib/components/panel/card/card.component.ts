import { GpBaseComponent } from '../../../base/gp-base.component';
import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gp-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class GpCardComponent extends GpBaseComponent {
  public header = input<string>('');
  public subheader = input<string>('');
  public headerImage = input<string>('');
  public hoverable = input<boolean>(false);
}
