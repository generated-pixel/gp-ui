import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
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

  @Input() public sectionsTemplate?: TemplateRef<any>;
  @Input() public promoTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('sections') public contentSections?: TemplateRef<any>;
  @ContentChild('promo') public contentPromo?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveSections(): TemplateRef<any> | undefined {
    return this.sectionsTemplate || this.contentSections;
  }

  public get effectivePromo(): TemplateRef<any> | undefined {
    return this.promoTemplate || this.contentPromo;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }
}
