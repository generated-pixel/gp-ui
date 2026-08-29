import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-page-403',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
  templateUrl: './page-403.component.html',
  styleUrl: './page-403.component.scss'
})
export class GpPage403Component {
  @Input() title = 'Access Forbidden';
  @Input() description = 'You do not have administrative permission to view this resource. Contact your workspace owner to update your role.';
}
