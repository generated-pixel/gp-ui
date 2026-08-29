import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpAvatarComponent, GpBadgeComponent, GpIconComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-list-stacked-feed',
  standalone: true,
  imports: [CommonModule, GpAvatarComponent, GpBadgeComponent, GpIconComponent],
  templateUrl: './list-stacked-feed.component.html',
  styleUrl: './list-stacked-feed.component.scss'
})
export class GpListStackedFeedComponent {
  @Input() title = 'Team Collaboration Feed';

  feedItems = [
    { author: 'Marcus Vance', action: 'opened pull request', target: '#402: Add Dark Mode Theme Presets', message: 'Ready for review. All unit tests and visual diffs passing.', time: '14 minutes ago' },
    { author: 'Elena Rostova', action: 'commented on issue', target: '#389: Performance optimization', message: 'Reduced initial bundle size by 34% by code-splitting heavy icon assets.', time: '1 hour ago' },
    { author: 'Graeme Gorman', action: 'deployed release tag', target: 'v0.2.1-production', time: '3 hours ago' }
  ];
}
