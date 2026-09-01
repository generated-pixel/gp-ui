import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpFloatLabelComponent } from './float-label.component';

describe('GpFloatLabelComponent', () => {
  let component: GpFloatLabelComponent;
  let fixture: ComponentFixture<GpFloatLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpFloatLabelComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpFloatLabelComponent);
    component = fixture.componentInstance;
  });

  it('should create the float label component', () => {
    expect(component).toBeTruthy();
  });
});
