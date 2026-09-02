import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpTextareaComponent } from './textarea.component';

describe('GpTextareaComponent', () => {
  let component: GpTextareaComponent;
  let fixture: ComponentFixture<GpTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpTextareaComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpTextareaComponent);
    component = fixture.componentInstance;
  });

  it('should create the textarea component', () => {
    expect(component).toBeTruthy();
  });

  it('should update value and emit change', () => {
    let emitted = '';
    component.valueChange.subscribe((v) => (emitted = v));

    fixture.componentRef.setInput('value', 'Initial Text');
    fixture.detectChanges();

    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    expect(textarea.value).toBe('Initial Text');

    textarea.value = 'Updated Text';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(emitted).toBe('Updated Text');
  });
});
