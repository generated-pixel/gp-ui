import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GpAvatarComponent,
  GpAvatarGroupComponent,
  GpChipComponent,
  GpImageComponent,
  GpCarouselComponent,
  GpTimelineComponent,
  GpMeterGroupComponent,
  GpEmptyStateComponent,
  GpButtonComponent,
  GpMeterItem,
  GpTimelineEvent
} from 'gp-ui';

@Component({
  selector: 'app-display-demo',
  standalone: true,
  imports: [
    CommonModule,
    GpAvatarComponent,
    GpAvatarGroupComponent,
    GpChipComponent,
    GpImageComponent,
    GpCarouselComponent,
    GpTimelineComponent,
    GpMeterGroupComponent,
    GpEmptyStateComponent,
    GpButtonComponent
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Display & Media Components</h1>
        <p class="page-desc">Avatars, Chips, Image Preview Lightbox, Carousel, Timeline, MeterGroup, and EmptyState.</p>
      </div>

      <!-- Avatar & Group -->
      <div class="doc-section">
        <h2 class="doc-section-title">Avatar & AvatarGroup</h2>
        <div class="doc-demo-box">
          <gp-avatar label="JD" shape="circle" />
          <gp-avatar icon="user" shape="circle" size="large" />
          <gp-avatar-group>
            <gp-avatar label="A" shape="circle" />
            <gp-avatar label="B" shape="circle" />
            <gp-avatar label="C" shape="circle" />
            <gp-avatar label="+3" shape="circle" />
          </gp-avatar-group>
        </div>
      </div>

      <!-- Chips -->
      <div class="doc-section">
        <h2 class="doc-section-title">Chips</h2>
        <div class="doc-demo-box">
          <gp-chip label="Action" />
          <gp-chip label="Angular" icon="code" [removable]="true" />
          <gp-chip label="TypeScript" icon="code" [removable]="true" />
        </div>
      </div>

      <!-- Image with Preview -->
      <div class="doc-section">
        <h2 class="doc-section-title">Image with Lightbox Preview & Zoom</h2>
        <div class="doc-demo-box">
          <gp-image
            src="https://picsum.photos/300/200"
            alt="Sample preview"
            width="240px"
            [preview]="true"
          />
        </div>
      </div>

      <!-- Meter Group -->
      <div class="doc-section">
        <h2 class="doc-section-title">Meter Group</h2>
        <gp-meter-group [value]="meters" />
      </div>

      <!-- Timeline -->
      <div class="doc-section">
        <h2 class="doc-section-title">Timeline</h2>
        <gp-timeline [value]="events" />
      </div>

      <!-- Empty State -->
      <div class="doc-section">
        <h2 class="doc-section-title">Empty State</h2>
        <gp-empty-state title="No Transactions" message="You have not made any purchases this month.">
          <gp-button label="Browse Products" icon="plus" size="sm" />
        </gp-empty-state>
      </div>
    </div>
  `
})
export class DisplayDemoComponent {
  meters: GpMeterItem[] = [
    { label: 'Apps', value: 40, color: 'var(--gp-primary)' },
    { label: 'Messages', value: 25, color: 'var(--gp-success)' },
    { label: 'Media', value: 15, color: 'var(--gp-warning)' },
    { label: 'System', value: 20, color: 'var(--gp-danger)' }
  ];

  events: GpTimelineEvent[] = [
    { status: 'Ordered', date: '15/10/2026 10:30', icon: 'check', color: '#6366f1' },
    { status: 'Processing', date: '15/10/2026 14:00', icon: 'refresh', color: '#f59e0b' },
    { status: 'Shipped', date: '16/10/2026 09:15', icon: 'upload', color: '#0ea5e9' },
    { status: 'Delivered', date: '17/10/2026 16:20', icon: 'check-circle', color: '#10b981' }
  ];
}
