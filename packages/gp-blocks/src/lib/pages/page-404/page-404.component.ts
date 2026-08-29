import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-page-404',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './page-404.component.html',
  styleUrl: './page-404.component.scss'
})
export class GpPage404Component {
  @Input() title = 'Page Not Found';
  @Input() description = 'Sorry, the requested page or resource could not be found or has been moved.';
}
