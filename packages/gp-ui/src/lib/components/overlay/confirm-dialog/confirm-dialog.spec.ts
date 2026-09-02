import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpConfirmDialog } from './confirm-dialog';

describe('GpConfirmDialog', () => {
  let component: GpConfirmDialog;
  let fixture: ComponentFixture<GpConfirmDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpConfirmDialog]
    }).compileComponents();

    fixture = TestBed.createComponent(GpConfirmDialog);
    component = fixture.componentInstance;
  });

  it('should create the confirm dialog component', () => {
    expect(component).toBeTruthy();
  });
});
