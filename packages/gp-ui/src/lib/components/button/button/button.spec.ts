import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpButton } from './button';

describe('GpButton', () => {
  let component: GpButton;
  let fixture: ComponentFixture<GpButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpButton]
    }).compileComponents();

    fixture = TestBed.createComponent(GpButton);
    component = fixture.componentInstance;
  });

  it('should create the button', () => {
    expect(component).toBeTruthy();
  });

  it('should render label', () => {
    fixture.componentRef.setInput('label', 'Click Me');
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.textContent).toContain('Click Me');
  });

  it('should emit onClickEvent when clicked and not disabled', () => {
    let clicked = false;
    component.onClickEvent.subscribe(() => (clicked = true));
    fixture.componentRef.setInput('label', 'Submit');
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button');
    btn.click();
    expect(clicked).toBeTrue();
  });

  it('should not emit onClickEvent when disabled', () => {
    let clicked = false;
    component.onClickEvent.subscribe(() => (clicked = true));
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button');
    btn.click();
    expect(clicked).toBeFalse();
  });

  it('should emit focus and blur events', () => {
    let focused = false;
    let blurred = false;
    component.onFocusEvent.subscribe(() => (focused = true));
    component.onBlurEvent.subscribe(() => (blurred = true));
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('button');
    btn.dispatchEvent(new FocusEvent('focus'));
    expect(focused).toBeTrue();

    btn.dispatchEvent(new FocusEvent('blur'));
    expect(blurred).toBeTrue();
  });

  it('should compute effective variant for shorthand flags', () => {
    fixture.componentRef.setInput('outlined', true);
    fixture.detectChanges();
    expect(component.effectiveVariant()).toBe('outlined');

    fixture.componentRef.setInput('outlined', false);
    fixture.componentRef.setInput('text', true);
    fixture.detectChanges();
    expect(component.effectiveVariant()).toBe('text');
  });

  it('should have loading class and spinner when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button');
    expect(btn.classList).toContain('gp-button-loading');
    expect(btn.disabled).toBeTrue();
  });
});
