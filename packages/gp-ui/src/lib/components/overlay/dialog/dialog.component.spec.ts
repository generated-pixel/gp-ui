import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpDialogComponent } from './dialog.component';

describe('GpDialogComponent', () => {
  let component: GpDialogComponent;
  let fixture: ComponentFixture<GpDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpDialogComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create the dialog component', () => {
    expect(component).toBeTruthy();
  });
});
