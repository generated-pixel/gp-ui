import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpFloatLabel } from './float-label';

describe('GpFloatLabel', () => {
  let component: GpFloatLabel;
  let fixture: ComponentFixture<GpFloatLabel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpFloatLabel]
    }).compileComponents();

    fixture = TestBed.createComponent(GpFloatLabel);
    component = fixture.componentInstance;
  });

  it('should create the float label component', () => {
    expect(component).toBeTruthy();
  });
});
