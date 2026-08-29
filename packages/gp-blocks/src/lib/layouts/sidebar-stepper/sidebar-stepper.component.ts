import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-sidebar-stepper',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './sidebar-stepper.component.html',
  styleUrl: './sidebar-stepper.component.scss'
})
export class GpLayoutSidebarStepperComponent {
  @Input() brandName = 'Onboarding Flow';
  @Input() currentStepTitle = 'Team & Workspace Details';
  @Input() currentStepSubtitle = 'Add your organization name and invite primary admins.';
}
