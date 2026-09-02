import { GpBase } from '../../../base/gp-base';
import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'gp-toolbar',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss'
})
export class GpToolbar extends GpBase {}
