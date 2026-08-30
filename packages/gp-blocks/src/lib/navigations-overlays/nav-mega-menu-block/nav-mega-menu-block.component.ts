import { Component, input, output, computed, Input, TemplateRef, ContentChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpMegaMenuComponent, GpMegaMenuItem } from '@generatedpixel/gp-ui';

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
  imports: [CommonModule, GpMegaMenuComponent],
  templateUrl: './nav-mega-menu-block.component.html',
  styleUrl: './nav-mega-menu-block.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class GpNavMegaMenuBlockComponent {
  public sections = input<GpMegaMenuSection[]>([]);
  public promo = input<GpMegaMenuPromo | undefined>(undefined);
  public menuLabel = input<string>('Explore platform');

  public menuItems = computed<GpMegaMenuItem[]>(() => {
    const promo = this.promo();
    const columns = this.sections().map((section, index) => ({
      label: section.title,
      items: section.links.map((link) => ({
        label: link.title,
        description: link.desc,
        url: link.url,
        command: () => this.linkClick.emit(link)
      })),
      featured: index === 0 && promo && !this.effectivePromo
        ? {
            badge: promo.badge,
            title: promo.title,
            description: promo.text,
            actionLabel: promo.ctaText,
            actionCommand: () => this.promoClick.emit(promo)
          }
        : undefined
    }));

    if (columns.length === 0 && promo && !this.effectivePromo) {
      columns.push({
        label: '',
        items: [],
        featured: {
          badge: promo.badge,
          title: promo.title,
          description: promo.text,
          actionLabel: promo.ctaText,
          actionCommand: () => this.promoClick.emit(promo)
        }
      });
    }

    return [{ label: this.menuLabel(), icon: 'layout-grid', root: true, columns }];
  });

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
