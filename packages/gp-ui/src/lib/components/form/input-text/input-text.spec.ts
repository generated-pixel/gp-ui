import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpInputText } from './input-text';

describe('GpInputText', () => {
  let component: GpInputText;
  let fixture: ComponentFixture<GpInputText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpInputText]
    }).compileComponents();

    fixture = TestBed.createComponent(GpInputText);
    component = fixture.componentInstance;
  });

  it('should create the input text component', () => {
    expect(component).toBeTruthy();
  });

  it('should write and display value via ControlValueAccessor', () => {
    component.writeValue('Hello World');
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.value).toBe('Hello World');
  });

  it('should clear value when clear button is clicked', () => {
    fixture.componentRef.setInput('clearable', true);
    component.writeValue('Test');
    fixture.detectChanges();

    let cleared = false;
    component.onClearEvent.subscribe(() => (cleared = true));

    const clearBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.gp-input-clear-btn');
    expect(clearBtn).toBeTruthy();
    clearBtn.click();
    fixture.detectChanges();

    expect(cleared).toBeTrue();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.value).toBe('');
  });
});
