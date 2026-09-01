import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpInputMaskComponent } from './input-mask.component';

describe('GpInputMaskComponent', () => {
  let component: GpInputMaskComponent;
  let fixture: ComponentFixture<GpInputMaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpInputMaskComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpInputMaskComponent);
    component = fixture.componentInstance;
  });

  it('should create the input mask component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with mask string', () => {
    fixture.componentRef.setInput('mask', '99-999999');
    fixture.detectChanges();
    expect(component.mask()).toBe('99-999999');
  });
});
