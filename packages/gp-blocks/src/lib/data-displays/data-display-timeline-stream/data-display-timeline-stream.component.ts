import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpIconComponent, GpAvatarComponent } from '@generatedpixel/gp-ui';

@Component({
  selector: 'gp-data-display-timeline-stream',
  standalone: true,
  imports: [CommonModule, GpIconComponent, GpAvatarComponent],
  templateUrl: './data-display-timeline-stream.component.html',
  styleUrl: './data-display-timeline-stream.component.scss'
})
export class GpDataDisplayTimelineStreamComponent {
  @Input() title = 'Project Audit Trail & Activity';

  events = [
    { title: 'Production Release v2.4.0 Deployed', time: '10 mins ago', desc: 'Successfully deployed release artifact to 4 global regions with 0 errors.', author: 'Alex Chen', color: '#16a34a', icon: 'check' },
    { title: 'SSL Certificate Auto-Renewed', time: '2 hours ago', desc: 'Let’s Encrypt wildcard certificate renewed for *.gp-ui.com.', author: 'System Bot', color: '#3b82f6', icon: 'lock' },
    { title: 'Database Migration Executed', time: 'Yesterday at 8:45 PM', desc: 'Added indexed column for fast customer search queries.', author: 'Graeme Gorman', color: '#8b5cf6', icon: 'folder' }
  ];
}
