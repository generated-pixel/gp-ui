import { Component, input, output, signal, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpAvatarComponent, GpButtonComponent, GpIconComponent, GpInputTextComponent } from '@generatedpixel/gp-ui';

export interface GpDirectoryUserItem {
  id?: string | number;
  name: string;
  role: string;
  online?: boolean;
}

@Component({
  selector: 'gp-list-user-directory',
  standalone: true,
  imports: [CommonModule, GpAvatarComponent, GpButtonComponent, GpIconComponent, GpInputTextComponent],
  templateUrl: './list-user-directory.component.html',
  styleUrl: './list-user-directory.component.scss'
})
export class GpListUserDirectoryComponent {
  public title = input<string>('');
  public searchPlaceholder = input<string>('Search team members...');
  public profileBtnLabel = input<string>('View Profile');
  public messageBtnLabel = input<string>('Message');
  public users = input<GpDirectoryUserItem[]>([]);

  public searchQuery = signal<string>('');

  public searchChange = output<string>();
  public profileClick = output<GpDirectoryUserItem>();
  public messageClick = output<GpDirectoryUserItem>();

  @Input() public headerTemplate?: TemplateRef<any>;
  @Input() public userTemplate?: TemplateRef<{ $implicit: GpDirectoryUserItem }>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('header') public contentHeader?: TemplateRef<any>;
  @ContentChild('userTemplate') public contentUserTemplate?: TemplateRef<{ $implicit: GpDirectoryUserItem }>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveHeader(): TemplateRef<any> | undefined {
    return this.headerTemplate || this.contentHeader;
  }

  public get effectiveUserTemplate(): TemplateRef<{ $implicit: GpDirectoryUserItem }> | undefined {
    return this.userTemplate || this.contentUserTemplate;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }

  public onSearchInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.searchQuery.set(val);
    this.searchChange.emit(val);
  }
}
