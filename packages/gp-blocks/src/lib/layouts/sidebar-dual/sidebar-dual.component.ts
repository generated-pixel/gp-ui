import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpBadgeComponent } from '@generatedpixel/gp-ui';

export interface GpDualTier1Item {
  id: string;
  icon: string;
  title: string;
  active?: boolean;
}

export interface GpDualTier2Item {
  id: string;
  label: string;
  active?: boolean;
}

@Component({
  selector: 'gp-layout-sidebar-dual',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpBadgeComponent],
  templateUrl: './sidebar-dual.component.html',
  styleUrl: './sidebar-dual.component.scss'
})
export class GpLayoutSidebarDualComponent {
  public activeTier1Id = input<string>('');
  public subnavTitle = input<string>('');
  public subnavBadge = input<string>('');
  public activeTier2Id = input<string>('');
  public title = input<string>('');

  public tier1Items = input<GpDualTier1Item[]>([]);
  public tier2Items = input<GpDualTier2Item[]>([]);

  public tier1Click = output<GpDualTier1Item>();
  public tier2Click = output<GpDualTier2Item>();

  @Input() public tier1Template?: TemplateRef<any>;
  @Input() public tier2Template?: TemplateRef<any>;
  @Input() public topActionsTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('tier1') public contentTier1?: TemplateRef<any>;
  @ContentChild('tier2') public contentTier2?: TemplateRef<any>;
  @ContentChild('topActions') public contentTopActions?: TemplateRef<any>;
  @ContentChild('actions') public contentActions?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;
  @ContentChild('main') public contentMain?: TemplateRef<any>;

  public get effectiveTier1(): TemplateRef<any> | undefined {
    return this.tier1Template || this.contentTier1;
  }

  public get effectiveTier2(): TemplateRef<any> | undefined {
    return this.tier2Template || this.contentTier2;
  }

  public get effectiveTopActions(): TemplateRef<any> | undefined {
    return this.topActionsTemplate || this.contentTopActions || this.contentActions;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea || this.contentMain;
  }
}
