import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpAvatarComponent, GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-list-user-directory',
  standalone: true,
  imports: [CommonModule, GpAvatarComponent, GpButtonComponent, GpIconComponent],
  templateUrl: './list-user-directory.component.html',
  styleUrl: './list-user-directory.component.scss'
})
export class GpListUserDirectoryComponent {
  @Input() title = 'Team Directory';

  users = [
    { name: 'Dr. Bruce Banner', role: 'Staff ML Engineer', online: true },
    { name: 'Natasha Romanoff', role: 'Security Architect', online: true },
    { name: 'Tony Stark', role: 'VP of Hardware', online: false },
    { name: 'Peter Parker', role: 'Frontend Developer', online: true }
  ];
}
