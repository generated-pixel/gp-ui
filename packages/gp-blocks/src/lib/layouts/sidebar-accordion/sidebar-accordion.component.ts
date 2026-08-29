import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpAccordionSubLink {
  id: string;
  label: string;
  active?: boolean;
}

export interface GpAccordionNavGroup {
  id: string;
  title: string;
  icon: string;
  open?: boolean;
  links: GpAccordionSubLink[];
}

@Component({
  selector: 'gp-layout-sidebar-accordion',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './sidebar-accordion.component.html',
  styleUrl: './sidebar-accordion.component.scss'
})
export class GpLayoutSidebarAccordionComponent {
  public brandName = input<string>('');
  public title = input<string>('');
  public activeSubLinkId = input<string>('');

  public groups = input<GpAccordionNavGroup[]>([]);

  public linkClick = output<GpAccordionSubLink>();
  public groupToggle = output<GpAccordionNavGroup>();

  public toggleGroup(idx: number): void {
    const grp = this.groups()[idx];
    if (grp) {
      grp.open = !grp.open;
      this.groupToggle.emit(grp);
    }
  }
}
