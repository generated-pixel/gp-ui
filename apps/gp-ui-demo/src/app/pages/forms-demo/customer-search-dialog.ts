import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GP_DIALOG_DATA, GP_DIALOG_REF, GpDialogRef, GpInputText, GpButton, GpBadge } from 'gp-ui';

@Component({
  selector: 'app-customer-search-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, GpInputText, GpButton, GpBadge],
  templateUrl: './customer-search-dialog.html',
  styleUrl: './customer-search-dialog.scss'
})
export class CustomerSearchDialog {
  public dialogData = inject(GP_DIALOG_DATA, { optional: true });
  public dialogRef = inject<GpDialogRef>(GP_DIALOG_REF, { optional: true });

  public filterQuery = this.dialogData?.query || '';

  public customers = [
    { id: 101, name: 'Acme Global Enterprises', tier: 'Enterprise', location: 'New York, USA' },
    { id: 102, name: 'Apex Cyber Solutions', tier: 'Enterprise', location: 'London, UK' },
    { id: 103, name: 'BlueStar Logistics', tier: 'Professional', location: 'Toronto, Canada' },
    { id: 104, name: 'CloudScale Technologies', tier: 'Enterprise', location: 'San Francisco, USA' },
    { id: 105, name: 'DataCore Analytics Ltd', tier: 'Professional', location: 'Berlin, Germany' },
    { id: 106, name: 'EchoWave Interactive', tier: 'Standard', location: 'Sydney, Australia' },
    { id: 107, name: 'FusionWorks Labs', tier: 'Enterprise', location: 'Tokyo, Japan' },
    { id: 108, name: 'Global Horizon Corp', tier: 'Enterprise', location: 'Paris, France' }
  ];

  public filteredCustomers(): any[] {
    const q = (this.filterQuery || '').toLowerCase();
    if (!q) {
      return this.customers;
    }
    return this.customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.location.toLowerCase().includes(q) || String(c.id).includes(q)
    );
  }

  public chooseCustomer(customer: any): void {
    this.dialogRef?.close(customer);
  }
}
