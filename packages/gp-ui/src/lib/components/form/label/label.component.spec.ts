import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpLabelComponent } from './label.component';

describe('GpLabelComponent', () => {
  let component: GpLabelComponent;
  let fixture: ComponentFixture<GpLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpLabelComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpLabelComponent);
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
