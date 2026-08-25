import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpButtonComponent } from './button.component';

describe('GpButtonComponent', () => {
  let component: GpButtonComponent;
  let fixture: ComponentFixture<GpButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create the button', () => {
    expect(component).toBeTruthy();
  });

  it('should render label', () => {
    component.label = 'Click Me';
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.textContent).toContain('Click Me');
  });

  it('should emit onClickEvent when clicked and not disabled', () => {
    let clicked = false;
    component.onClickEvent.subscribe(() => (clicked = true));
    component.label = 'Submit';
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button');
    btn.click();
    expect(clicked).toBeTrue();
  });

  it('should not emit onClickEvent when disabled', () => {
    let clicked = false;
    component.onClickEvent.subscribe(() => (clicked = true));
    component.disabled = true;
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button');
    btn.click();
    expect(clicked).toBeFalse();
  });

  it('should have loading class and spinner when loading is true', () => {
    component.loading = true;
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('gp-button-loading');
    expect(btn.disabled).toBeTrue();
  });
});
