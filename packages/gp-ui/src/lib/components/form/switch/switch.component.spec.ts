import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpSwitchComponent } from './switch.component';

describe('GpSwitchComponent', () => {
  let component: GpSwitchComponent;
  let fixture: ComponentFixture<GpSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpSwitchComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpSwitchComponent);
    component = fixture.componentInstance;
  });

  it('should create the switch component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle state on click', () => {
    let emitted = false;
    component.onChangeEvent.subscribe((val) => (emitted = val));

    fixture.detectChanges();
    const slider = fixture.nativeElement.querySelector('.gp-switch-slider');
    slider.click();
    fixture.detectChanges();

    expect(component.checked()).toBeTrue();
    expect(emitted).toBeTrue();
  });
});
