import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpSwitch } from './switch';

describe('GpSwitch', () => {
  let component: GpSwitch;
  let fixture: ComponentFixture<GpSwitch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpSwitch]
    }).compileComponents();

    fixture = TestBed.createComponent(GpSwitch);
    component = fixture.componentInstance;
  });

  it('should create the switch component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle state on click', () => {
    let emitted = false;
    component.onChange.subscribe((event: { checked: boolean; originalEvent: Event }) => (emitted = event.checked));

    fixture.detectChanges();
    const slider = fixture.nativeElement.querySelector('.gp-switch-slider');
    slider.click();
    fixture.detectChanges();

    expect(component.checked()).toBe(true);
    expect(emitted).toBe(true);
  });
});
