import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface GpMegaMenuLink {
  title: string;
  desc: string;
  url?: string;
}

export interface GpMegaMenuSection {
  title: string;
  links: GpMegaMenuLink[];
}

export interface GpMegaMenuPromo {
  badge?: string;
  title: string;
  text: string;
  ctaText: string;
}

@Component({
  selector: 'gp-nav-mega-menu-block',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-mega-menu-block.component.html',
  styleUrl: './nav-mega-menu-block.component.scss'
})
export class GpNavMegaMenuBlockComponent {
  public sections = input<GpMegaMenuSection[]>([]);
  public promo = input<GpMegaMenuPromo | undefined>(undefined);

  public linkClick = output<GpMegaMenuLink>();
  public promoClick = output<GpMegaMenuPromo>();
}
