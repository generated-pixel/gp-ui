import { GpBaseComponent } from '../../../base/gp-base.component';
import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpBadgeSeverity } from '../badge/badge.component';

@Component({
  selector: 'gp-tag',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss'
})
export class GpTagComponent extends GpBaseComponent {
  public value = input<string>('');
  public severity = input<GpBadgeSeverity>('primary');
  public icon = input<string>('');
  public rounded = input<boolean>(false);
}
