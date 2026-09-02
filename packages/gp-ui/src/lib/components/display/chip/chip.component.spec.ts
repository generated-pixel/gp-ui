import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpChipComponent } from './chip.component';

describe('GpChipComponent', () => {
  let component: GpChipComponent;
  let fixture: ComponentFixture<GpChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpChipComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpChipComponent);
    component = fixture.componentInstance;
  });

  it('should create the chip component', () => {
    expect(component).toBeTruthy();
  });
});
