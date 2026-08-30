import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpAvatarComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-layout-stacked-floating-card',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpAvatarComponent],
  templateUrl: './stacked-floating-card.component.html',
  styleUrl: './stacked-floating-card.component.scss'
})
export class GpLayoutStackedFloatingCardComponent {
  public brandName = input<string>('');
  public brandIcon = input<string>('box');
  public userName = input<string>('');
  public title = input<string>('');

  public brandClick = output<void>();
  public userClick = output<void>();

  @Input() public headerTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;
  @Input() public userTemplate?: TemplateRef<any>;

  @ContentChild('header') public contentHeader?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;
  @ContentChild('main') public contentMain?: TemplateRef<any>;
  @ContentChild('user') public contentUser?: TemplateRef<any>;

  public get effectiveHeader(): TemplateRef<any> | undefined {
    return this.headerTemplate || this.contentHeader;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea || this.contentMain;
  }

  public get effectiveUser(): TemplateRef<any> | undefined {
    return this.userTemplate || this.contentUser;
  }
}
