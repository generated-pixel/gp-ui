import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpHeroNavLink {
  id: string;
  label: string;
  active?: boolean;
}

@Component({
  selector: 'gp-layout-stacked-hero-banner',
  standalone: true,
  imports: [CommonModule, GpIconComponent],
  templateUrl: './stacked-hero-banner.component.html',
  styleUrl: './stacked-hero-banner.component.scss'
})
export class GpLayoutStackedHeroBannerComponent {
  public brandName = input<string>('');
  public brandIcon = input<string>('layer-group');
  public heroTitle = input<string>('');
  public heroSubtitle = input<string>('');
  public primaryCta = input<string>('');
  public secondaryCta = input<string>('');

  public navLinks = input<GpHeroNavLink[]>([]);

  public primaryClick = output<void>();
  public secondaryClick = output<void>();
  public navLinkClick = output<GpHeroNavLink>();

  @Input() public headerTemplate?: TemplateRef<any>;
  @Input() public heroTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('header') public contentHeader?: TemplateRef<any>;
  @ContentChild('hero') public contentHero?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;
  @ContentChild('main') public contentMain?: TemplateRef<any>;

  public get effectiveHeader(): TemplateRef<any> | undefined {
    return this.headerTemplate || this.contentHeader;
  }

  public get effectiveHero(): TemplateRef<any> | undefined {
    return this.heroTemplate || this.contentHero;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea || this.contentMain;
  }
}
