import { Component, input, output, Input, TemplateRef, ContentChild } from '@angular/core';
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

  @Input() public headerTemplate?: TemplateRef<any>;
  @Input() public metaTemplate?: TemplateRef<any>;
  @Input() public timelineTemplate?: TemplateRef<any>;
  @Input() public contentTemplate?: TemplateRef<any>;

  @ContentChild('header') public contentHeader?: TemplateRef<any>;
  @ContentChild('meta') public contentMeta?: TemplateRef<any>;
  @ContentChild('timeline') public contentTimeline?: TemplateRef<any>;
  @ContentChild('content') public contentArea?: TemplateRef<any>;

  public get effectiveHeader(): TemplateRef<any> | undefined {
    return this.headerTemplate || this.contentHeader;
  }

  public get effectiveMeta(): TemplateRef<any> | undefined {
    return this.metaTemplate || this.contentMeta;
  }

  public get effectiveTimeline(): TemplateRef<any> | undefined {
    return this.timelineTemplate || this.contentTimeline;
  }

  public get effectiveContent(): TemplateRef<any> | undefined {
    return this.contentTemplate || this.contentArea;
  }
}
