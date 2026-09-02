import {
  Component,
  input,
  output,
  TemplateRef,
  contentChild,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpHeroNavLink {
  id: string;
  label: string;
  active?: boolean;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-layout-stacked-hero-banner',
  standalone: true,
  imports: [CommonModule, GpButtonComponent, GpIconComponent],
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

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public heroTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentHero = contentChild<TemplateRef<any>>('hero');
  public contentArea = contentChild<TemplateRef<any>>('content');
  public contentMain = contentChild<TemplateRef<any>>('main');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectiveHero = computed(() => this.heroTemplate() || this.contentHero());

  public effectiveContent = computed<TemplateRef<any> | undefined>(
    () => this.contentTemplate() || this.contentArea() || this.contentMain()
  );
}
