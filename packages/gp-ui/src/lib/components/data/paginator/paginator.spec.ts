import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpPaginator } from './paginator';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [GpPaginator],
  template: `
    <gp-paginator
      [totalRecords]="totalRecords"
      [rows]="rows"
      [first]="first"
      (onPageChange)="lastPageEvent = $event"
    />
  `
})
class TestHostComponent {
  totalRecords = 100;
  rows = 10;
  first = 0;
  lastPageEvent: any = null;
}

describe('GpPaginator', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, GpPaginator]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render paginator buttons and page report', () => {
    const paginatorEl = fixture.nativeElement.querySelector('.gp-paginator');
    expect(paginatorEl).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Showing 1 to 10 of 100');
  });

  it('should change page on next page button click', () => {
    const nextBtn = fixture.nativeElement.querySelector('.gp-paginator-next');
    expect(nextBtn).toBeTruthy();
    nextBtn.click();
    fixture.detectChanges();

    expect(hostComponent.lastPageEvent).toBeTruthy();
    expect(hostComponent.lastPageEvent.page).toBe(1);
    expect(hostComponent.lastPageEvent.first).toBe(10);
  });
});
