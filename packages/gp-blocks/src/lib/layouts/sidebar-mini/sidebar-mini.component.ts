import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpAvatarComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-sidebar-mini',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpAvatarComponent],
  templateUrl: './sidebar-mini.component.html',
  styleUrl: './sidebar-mini.component.scss'
})
export class GpLayoutSidebarMiniComponent {
  @Input() brandIcon = 'box';
  @Input() userName = 'Alex';
  @Input() title = 'Minimal Console';
}
