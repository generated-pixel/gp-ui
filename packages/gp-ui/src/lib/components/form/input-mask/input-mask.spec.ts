import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpInputMask } from './input-mask';

describe('GpInputMask', () => {
  let component: GpInputMask;
  let fixture: ComponentFixture<GpInputMask>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpInputMask]
    }).compileComponents();

    fixture = TestBed.createComponent(GpInputMask);
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
