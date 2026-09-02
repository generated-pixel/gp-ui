import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpTextarea } from './textarea';

describe('GpTextarea', () => {
  let component: GpTextarea;
  let fixture: ComponentFixture<GpTextarea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpTextarea]
    }).compileComponents();

    fixture = TestBed.createComponent(GpTextarea);
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
