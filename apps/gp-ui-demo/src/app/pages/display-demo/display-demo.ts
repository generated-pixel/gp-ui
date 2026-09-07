import { Component } from '@angular/core';

import {
  GpAvatar,
  GpAvatarGroup,
  GpChip,
  GpImage,
  GpTimeline,
  GpMeterGroup,
  GpEmptyState,
  GpStatCard,
  GpAnnouncementBar,
  GpBannerAction,
  GpButton,
  GpMeterItem,
  GpTimelineEvent
} from 'gp-ui';
import { DocCode } from '../../shared/doc-code';
import { DocApiTable, DocApiProperty } from '../../shared/doc-api-table';
import { getComponentDoc } from '../component-docs/component-docs.data';

@Component({
  selector: 'app-display-demo',
  standalone: true,
  imports: [
    GpAvatar,
    GpAvatarGroup,
    GpChip,
    GpImage,
    GpTimeline,
    GpMeterGroup,
    GpEmptyState,
    GpStatCard,
    GpAnnouncementBar,
    GpButton,
    DocCode,
    DocApiTable
  ],
  templateUrl: './display-demo.html',
  styleUrl: './display-demo.scss'
})
export class DisplayDemo {
  importCode = `import {
  GpAvatar,
  GpAvatarGroup,
  GpChip,
  GpImage,
  GpCarousel,
  GpTimeline,
  GpMeterGroup,
  GpEmptyState
} from '@generatedpixel/gp-ui';`;

  avatarCode = `<gp-avatar label="JD" shape="circle" />
<gp-avatar icon="user" shape="circle" size="large" />

<gp-avatar-group>
  <gp-avatar label="A" shape="circle" />
  <gp-avatar label="B" shape="circle" />
  <gp-avatar label="+3" shape="circle" />
</gp-avatar-group>`;

  chipCode = '<gp-chip label="Angular" icon="code" [removable]="true" />';

  imageCode = '<gp-image src="https://picsum.photos/300/200" alt="Preview" width="240px" [preview]="true" />';

  meterCode = '<gp-meter-group [value]="meters" />';

  timelineCode = '<gp-timeline [value]="events" />';

  emptyStateCode = `<gp-empty-state title="No Transactions" message="You have no records.">
  <gp-button label="Add Item" icon="plus" size="sm" />
</gp-empty-state>`;

  meters: GpMeterItem[] = [
    { label: 'Apps', value: 40, color: 'var(--gp-primary)' },
    { label: 'Messages', value: 25, color: 'var(--gp-success)' },
    { label: 'Media', value: 15, color: 'var(--gp-warning)' },
    { label: 'System', value: 20, color: 'var(--gp-danger)' }
  ];

  bannerActions: GpBannerAction[] = [{ label: 'View Roadmap', url: 'https://github.com' }];

  events: GpTimelineEvent[] = [
    { status: 'Ordered', date: '15/10/2026 10:30', icon: 'check', color: '#6366f1' },
    { status: 'Processing', date: '15/10/2026 14:00', icon: 'refresh', color: '#f59e0b' },
    { status: 'Shipped', date: '16/10/2026 09:15', icon: 'upload', color: '#0ea5e9' },
    { status: 'Delivered', date: '17/10/2026 16:20', icon: 'check-circle', color: '#10b981' }
  ];

  avatarProperties: DocApiProperty[] = getComponentDoc('avatar')?.properties ?? [];
  avatarGroupProperties: DocApiProperty[] = getComponentDoc('avatar-group')?.properties ?? [];
  imageProperties: DocApiProperty[] = getComponentDoc('image')?.properties ?? [];
  chipProperties: DocApiProperty[] = getComponentDoc('chip')?.properties ?? [];
  timelineProperties: DocApiProperty[] = getComponentDoc('timeline')?.properties ?? [];
  meterGroupProperties: DocApiProperty[] = getComponentDoc('meter-group')?.properties ?? [];
  emptyStateProperties: DocApiProperty[] = getComponentDoc('empty-state')?.properties ?? [];
  statCardProperties: DocApiProperty[] = getComponentDoc('stat-card')?.properties ?? [];
  carouselProperties: DocApiProperty[] = getComponentDoc('carousel')?.properties ?? [];
}
