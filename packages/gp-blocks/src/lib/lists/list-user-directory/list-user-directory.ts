import {
  Component,
  input,
  output,
  signal,
  TemplateRef,
  contentChild,
  computed,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpAvatar, GpButton, GpIcon, GpInputText } from '@generatedpixel/gp-ui';

export interface GpDirectoryUserItem {
  id?: string | number;
  name: string;
  role: string;
  online?: boolean;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-list-user-directory',
  standalone: true,
  imports: [CommonModule, GpAvatar, GpButton, GpIcon, GpInputText],
  templateUrl: './list-user-directory.html',
  styleUrl: './list-user-directory.scss'
})
export class GpListUserDirectory {
  public title = input<string>('');
  public searchPlaceholder = input<string>('Search team members...');
  public profileBtnLabel = input<string>('View Profile');
  public messageBtnLabel = input<string>('Message');
  public users = input<GpDirectoryUserItem[]>([]);

  public searchQuery = signal<string>('');

  public searchChange = output<string>();
  public profileClick = output<GpDirectoryUserItem>();
  public messageClick = output<GpDirectoryUserItem>();

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public userTemplate = input<TemplateRef<{ $implicit: GpDirectoryUserItem }> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentUserTemplate = contentChild<TemplateRef<{ $implicit: GpDirectoryUserItem }>>('userTemplate');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectiveUserTemplate = computed(() => this.userTemplate() || this.contentUserTemplate());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());

  public onSearchInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.searchQuery.set(val);
    this.searchChange.emit(val);
  }
}
