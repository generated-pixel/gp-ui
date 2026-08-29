import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpAvatarComponent, GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpDirectoryUserItem {
  id?: string | number;
  name: string;
  role: string;
  online?: boolean;
}

@Component({
  selector: 'gp-list-user-directory',
  standalone: true,
  imports: [CommonModule, GpAvatarComponent, GpButtonComponent, GpIconComponent],
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

  public onSearchInput(e: Event): void {
    const val = (e.target as HTMLInputElement).value;
    this.searchQuery.set(val);
    this.searchChange.emit(val);
  }
}
