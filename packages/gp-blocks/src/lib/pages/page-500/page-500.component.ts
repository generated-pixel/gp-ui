import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-page-500',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './page-500.component.html',
  styleUrl: './page-500.component.scss'
})
export class GpPage500Component {
  @Input() title = 'Internal Server Error';
  @Input() description = 'Something unexpected happened on our server while processing your request. Our engineering team has been alerted.';
}
