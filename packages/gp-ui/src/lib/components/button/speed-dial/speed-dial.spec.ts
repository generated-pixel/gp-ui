import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpSpeedDial } from './speed-dial';

describe('GpSpeedDial', () => {
  let component: GpSpeedDial;
  let fixture: ComponentFixture<GpSpeedDial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpSpeedDial]
    }).compileComponents();

    fixture = TestBed.createComponent(GpSpeedDial);
    component = fixture.componentInstance;
  });

  it('should create the speed dial component', () => {
    expect(component).toBeTruthy();
  });
});
