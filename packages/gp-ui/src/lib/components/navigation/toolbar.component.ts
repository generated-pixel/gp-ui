import { GpBaseComponent } from '../../base/gp-base.component';
import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'gp-toolbar',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class GpToolbarComponent extends GpBaseComponent {}
