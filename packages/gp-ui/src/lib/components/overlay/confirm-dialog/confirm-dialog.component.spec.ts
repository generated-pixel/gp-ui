import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpConfirmDialogComponent } from './confirm-dialog.component';

describe('GpConfirmDialogComponent', () => {
  let component: GpConfirmDialogComponent;
  let fixture: ComponentFixture<GpConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpConfirmDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpConfirmDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create the confirm dialog component', () => {
    expect(component).toBeTruthy();
  });
});
