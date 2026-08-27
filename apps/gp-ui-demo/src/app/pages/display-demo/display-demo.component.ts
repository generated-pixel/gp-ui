import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GpAvatarComponent,
  GpAvatarGroupComponent,
  GpChipComponent,
  GpImageComponent,
  GpTimelineComponent,
  GpMeterGroupComponent,
  GpEmptyStateComponent,
  GpButtonComponent,
  GpMeterItem,
  GpTimelineEvent
} from 'gp-ui';
import { DocCodeComponent } from '../../shared/doc-code.component';
import { DocApiTableComponent, DocApiProperty } from '../../shared/doc-api-table.component';

@Component({
  selector: 'app-display-demo',
  standalone: true,
  imports: [
    CommonModule,
    GpAvatarComponent,
    GpAvatarGroupComponent,
    GpChipComponent,
    GpImageComponent,
    GpTimelineComponent,
    GpMeterGroupComponent,
    GpEmptyStateComponent,
    GpButtonComponent,
    DocCodeComponent,
    DocApiTableComponent
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Display & Media Components</h1>
        <p class="page-desc">
          Visual display elements including Profile Avatars, Dismissible Chips, Image Lightbox Previews, Multi-Item Carousels, Chronological Timelines, Segmented Meter Groups, and Empty State placeholders.
        </p>
      </div>

      <!-- Import Section -->
      <div class="doc-section">
        <h2 class="doc-section-title">Import</h2>
        <p class="doc-section-desc">Import display components into your Angular application:</p>
        <doc-code [code]="importCode" language="typescript" />
      </div>

      <!-- Avatar & Group -->
      <div class="doc-section">
        <h2 class="doc-section-title">Avatar & AvatarGroup</h2>
        <p class="doc-section-desc">User profile representations with text initials, image URLs, or icons, and overlapping avatar stack groups.</p>
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
        <doc-code [code]="avatarCode" language="html" />
      </div>

      <!-- Chips -->
      <div class="doc-section">
        <h2 class="doc-section-title">Chips (Tags with Icons & Remove Buttons)</h2>
        <div class="doc-demo-box">
          <gp-chip label="Action" />
          <gp-chip label="Angular" icon="code" [removable]="true" />
          <gp-chip label="TypeScript" icon="code" [removable]="true" />
        </div>
        <doc-code [code]="chipCode" language="html" />
      </div>

      <!-- Image with Preview -->
      <div class="doc-section">
        <h2 class="doc-section-title">Image with Lightbox Preview & Zoom</h2>
        <p class="doc-section-desc">Click the image below to open full-screen zoomable lightbox overlay:</p>
        <div class="doc-demo-box">
          <gp-image
            src="https://picsum.photos/300/200"
            alt="Sample preview"
            width="240px"
            [preview]="true"
          />
        </div>
        <doc-code [code]="imageCode" language="html" />
      </div>

      <!-- Meter Group -->
      <div class="doc-section">
        <h2 class="doc-section-title">Meter Group</h2>
        <p class="doc-section-desc">Multi-segmented proportion indicator showing distributed metrics.</p>
        <gp-meter-group [value]="meters" />
        <doc-code [code]="meterCode" language="html" />
      </div>

      <!-- Timeline -->
      <div class="doc-section">
        <h2 class="doc-section-title">Timeline</h2>
        <p class="doc-section-desc">Chronological process steps with status icons and dates.</p>
        <gp-timeline [value]="events" />
        <doc-code [code]="timelineCode" language="html" />
      </div>

      <!-- Empty State -->
      <div class="doc-section">
        <h2 class="doc-section-title">Empty State</h2>
        <p class="doc-section-desc">Call-to-action placeholder for empty views or filtered results.</p>
        <gp-empty-state title="No Transactions" message="You have not made any purchases this month.">
          <gp-button label="Browse Products" icon="plus" size="sm" />
        </gp-empty-state>
        <doc-code [code]="emptyStateCode" language="html" />
      </div>

      <!-- API Reference -->
      <div class="doc-section">
        <h2 class="doc-section-title">API Reference</h2>
        <doc-api-table title="GpAvatarComponent Properties (Inputs)" [properties]="avatarProperties" />
        <doc-api-table title="GpImageComponent Properties (Inputs)" [properties]="imageProperties" />
      </div>
    </div>
  `
})
export class DisplayDemoComponent {
  importCode = `import {
  GpAvatarComponent,
  GpAvatarGroupComponent,
  GpChipComponent,
  GpImageComponent,
  GpCarouselComponent,
  GpTimelineComponent,
  GpMeterGroupComponent,
  GpEmptyStateComponent
} from '@generatedpixel/gp-ui';`;

  avatarCode = `<gp-avatar label="JD" shape="circle" />
<gp-avatar icon="user" shape="circle" size="large" />

<gp-avatar-group>
  <gp-avatar label="A" shape="circle" />
  <gp-avatar label="B" shape="circle" />
  <gp-avatar label="+3" shape="circle" />
</gp-avatar-group>`;

  chipCode = `<gp-chip label="Angular" icon="code" [removable]="true" />`;

  imageCode = `<gp-image src="https://picsum.photos/300/200" alt="Preview" width="240px" [preview]="true" />`;

  meterCode = `<gp-meter-group [value]="meters" />`;

  timelineCode = `<gp-timeline [value]="events" />`;

  emptyStateCode = `<gp-empty-state title="No Transactions" message="You have no records.">
  <gp-button label="Add Item" icon="plus" size="sm" />
</gp-empty-state>`;

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

  avatarProperties: DocApiProperty[] = [
    { name: 'label', type: 'string', default: "''", description: 'Initials or text displayed inside the avatar.' },
    { name: 'image', type: 'string', default: "''", description: 'URL of the profile picture image.' },
    { name: 'icon', type: 'string', default: "''", description: 'Built-in SVG icon identifier.' },
    { name: 'shape', type: "'square' | 'circle'", default: "'square'", description: 'Shape geometry.' },
    { name: 'size', type: "'normal' | 'large' | 'xlarge'", default: "'normal'", description: 'Preset size dimensions.' }
  ];

  imageProperties: DocApiProperty[] = [
    { name: 'src', type: 'string', default: "''", description: 'Source image URL.' },
    { name: 'alt', type: 'string', default: "''", description: 'Alternative accessible text.' },
    { name: 'preview', type: 'boolean', default: 'false', description: 'Enables click-to-open full screen lightbox viewer.' }
  ];
}
