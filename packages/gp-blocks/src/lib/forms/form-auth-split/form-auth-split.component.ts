import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GpButtonComponent,
  GpInputTextComponent,
  GpPasswordComponent,
  GpCheckboxComponent,
  GpIconComponent
} from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-form-auth-split',
  standalone: true,
  imports: [
    CommonModule,
    GpButtonComponent,
    GpInputTextComponent,
    GpPasswordComponent,
    GpCheckboxComponent,
    GpIconComponent
  ],
  templateUrl: './form-auth-split.component.html',
  styleUrl: './form-auth-split.component.scss'
})
export class GpFormAuthSplitComponent {
  @Input() brandName = 'Quantum UI';
}
