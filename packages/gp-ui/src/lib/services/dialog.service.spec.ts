import { Component, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GpDialogService } from './dialog.service';
import { GP_DIALOG_DATA, GP_DIALOG_REF, GpDialogRef } from './dialog.interface';

@Component({
  standalone: true,
  template: `
    <div class="test-dialog-content">
      <h2>Search Customer: {{ data?.query }}</h2>
      <button (click)="selectCustomer()">Choose Result</button>
    </div>
  `
})
class TestSearchModalComponent {
  public data = inject(GP_DIALOG_DATA, { optional: true });
  public dialogRef = inject<GpDialogRef>(GP_DIALOG_REF, { optional: true });

  public selectCustomer(): void {
    this.dialogRef?.close({ id: 101, name: 'Acme Corporation' });
  }
}

describe('GpDialogService', () => {
  let service: GpDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GpDialogService]
    });
    service = TestBed.inject(GpDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open dynamic dialog and receive emitted result on close', (done) => {
    const dialogRef = service.open(TestSearchModalComponent, {
      header: 'Search Dialog',
      data: { query: 'Acme' }
    });

    expect(dialogRef).toBeTruthy();

    dialogRef.onClose.subscribe((result) => {
      expect(result).toEqual({ id: 101, name: 'Acme Corporation' });
      done();
    });

    dialogRef.close({ id: 101, name: 'Acme Corporation' });
  });
});
