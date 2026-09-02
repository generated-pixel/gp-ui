import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpDialog } from './dialog';

describe('GpDialog', () => {
  let component: GpDialog;
  let fixture: ComponentFixture<GpDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpDialog]
    }).compileComponents();

    fixture = TestBed.createComponent(GpDialog);
    component = fixture.componentInstance;
  });

  it('should create the dialog component', () => {
    expect(component).toBeTruthy();
  });
});
