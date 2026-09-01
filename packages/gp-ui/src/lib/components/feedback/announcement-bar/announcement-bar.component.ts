import { Component, OnInit, signal, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent } from '../../../icons/icon.component';
import { GpBadgeComponent } from '../badge/badge.component';
import { GpBannerSeverity, GpBannerAction } from './announcement-bar.interface';

@Component({
  selector: 'gp-announcement-bar',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpBadgeComponent],
  templateUrl: './announcement-bar.component.html',
  styleUrl: './announcement-bar.component.scss'
})
export class GpAnnouncementBarComponent implements OnInit {
  public message = input<string>('');
  public title = input<string | undefined>(undefined);
  public icon = input<string | undefined>(undefined);
  public badge = input<string | undefined>(undefined);
  public severity = input<GpBannerSeverity>('primary');
  public dismissible = input<boolean>(true);
  public sticky = input<boolean>(false);
  public storageKey = input<string | undefined>(undefined);
  public actions = input<GpBannerAction[] | undefined>(undefined);

  public onDismiss = output<void>();
  public onAction = output<GpBannerAction>();

  protected visible = signal<boolean>(true);
  protected isDismissing = signal<boolean>(false);

  ngOnInit(): void {
    const key = this.storageKey();
    if (key && typeof localStorage !== 'undefined') {
      const dismissed = localStorage.getItem(`gp_banner_dismissed_${key}`);
      if (dismissed === 'true') {
        this.visible.set(false);
      }
    }
  }

  public resolvedIcon = computed<string | null>(() => {
    const customIcon = this.icon();
    if (customIcon !== undefined) {
      return customIcon;
    }
    switch (this.severity()) {
      case 'info': {
        return 'info-circle';
      }
      case 'success': {
        return 'check-circle';
      }
      case 'warning': {
        return 'exclamation-triangle';
      }
      case 'danger': {
        return 'times-circle';
      }
      case 'primary': {
        return 'bullhorn';
      }
      default: {
        return null;
      }
    }
  });

  public dismiss(): void {
    this.isDismissing.set(true);
    setTimeout(() => {
      this.visible.set(false);
      const key = this.storageKey();
      if (key && typeof localStorage !== 'undefined') {
        localStorage.setItem(`gp_banner_dismissed_${key}`, 'true');
      }
      this.onDismiss.emit();
    }, 250);
  }

  public handleAction(action: GpBannerAction): void {
    if (action.action) {
      action.action();
    }
    if (action.url && typeof window !== 'undefined') {
      window.open(action.url, '_blank');
    }
    this.onAction.emit(action);
  }
}
