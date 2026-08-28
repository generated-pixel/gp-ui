import {
  Component,
  input,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpPanelBaseComponent } from '../../../base/gp-panel-base.component';

@Component({
  selector: 'gp-panel',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.scss'
})
export class GpPanelComponent extends GpPanelBaseComponent {
  public showFooter = input<boolean>(false);
}
