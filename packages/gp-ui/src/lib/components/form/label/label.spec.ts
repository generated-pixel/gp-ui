import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpLabel } from './label';

describe('GpLabel', () => {
  let component: GpLabel;
  let fixture: ComponentFixture<GpLabel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpLabel]
    }).compileComponents();

    fixture = TestBed.createComponent(GpLabel);
    component = fixture.componentInstance;
  });

  it('should create the label component', () => {
    expect(component).toBeTruthy();
  });

  it('should render required asterisk when required is true', () => {
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    const req = fixture.nativeElement.querySelector('.gp-label-required');
    expect(req).toBeTruthy();
  });
});
