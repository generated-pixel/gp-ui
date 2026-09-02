import {
  Component,
  input,
  output,
  computed,
  TemplateRef,
  ViewEncapsulation,
  contentChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpMegaMenu, GpMegaMenuItem } from '@generatedpixel/gp-ui';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-nav-mega-menu-block',
  standalone: true,
  imports: [CommonModule, GpMegaMenu],
  templateUrl: './nav-mega-menu-block.html',
  styleUrl: './nav-mega-menu-block.scss',
  encapsulation: ViewEncapsulation.None
})
export class GpNavMegaMenuBlock {
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
      featured:
        index === 0 && promo && !this.effectivePromo
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

  public sectionsTemplate = input<TemplateRef<any> | undefined>(undefined);
  public promoTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentSections = contentChild<TemplateRef<any>>('sections');
  public contentPromo = contentChild<TemplateRef<any>>('promo');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveSections = computed(() => this.sectionsTemplate() || this.contentSections());

  public effectivePromo = computed(() => this.promoTemplate() || this.contentPromo());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());
}
