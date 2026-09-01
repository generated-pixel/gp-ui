import { Component, input, output, TemplateRef, contentChild, computed, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GpAvatarComponent, GpBadgeComponent, GpButtonComponent, GpIconComponent } from '@generatedpixel/gp-ui';

export interface GpCustomerMetaField {
  label: string;
  value: string;
  isLink?: boolean;
  href?: string;
}

export interface GpCustomerTimelineEvent {
  id?: string;
  title: string;
  date: string;
  bulletClass?: string;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'gp-details-customer-overview',
  standalone: true,
  imports: [CommonModule, GpAvatarComponent, GpBadgeComponent, GpButtonComponent],
  templateUrl: './details-customer-overview.component.html',
  styleUrl: './details-customer-overview.component.scss'
})
export class GpDetailsCustomerOverviewComponent {
  public customerName = input<string>('');
  public customerStatus = input<string>('Active');
  public companyName = input<string>('');
  public location = input<string>('');
  public tags = input<string[]>([]);
  public editBtnLabel = input<string>('Edit Contact');
  public newDealBtnLabel = input<string>('New Deal');

  public metaFields = input<GpCustomerMetaField[]>([]);
  public timelineEvents = input<GpCustomerTimelineEvent[]>([]);

  public editContact = output<void>();
  public newDeal = output<void>();
  public eventClick = output<GpCustomerTimelineEvent>();

  public headerTemplate = input<TemplateRef<any> | undefined>(undefined);
  public metaTemplate = input<TemplateRef<any> | undefined>(undefined);
  public timelineTemplate = input<TemplateRef<any> | undefined>(undefined);
  public contentTemplate = input<TemplateRef<any> | undefined>(undefined);

  public contentHeader = contentChild<TemplateRef<any>>('header');
  public contentMeta = contentChild<TemplateRef<any>>('meta');
  public contentTimeline = contentChild<TemplateRef<any>>('timeline');
  public contentArea = contentChild<TemplateRef<any>>('content');

  public effectiveHeader = computed(() => this.headerTemplate() || this.contentHeader());

  public effectiveMeta = computed(() => this.metaTemplate() || this.contentMeta());

  public effectiveTimeline = computed(() => this.timelineTemplate() || this.contentTimeline());

  public effectiveContent = computed(() => this.contentTemplate() || this.contentArea());
}
