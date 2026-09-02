import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpSpeedDialComponent } from './speed-dial.component';

describe('GpSpeedDialComponent', () => {
  let component: GpSpeedDialComponent;
  let fixture: ComponentFixture<GpSpeedDialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpSpeedDialComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpSpeedDialComponent);
    component = fixture.componentInstance;
  });

  it('should create the speed dial component', () => {
    expect(component).toBeTruthy();
  });
});
