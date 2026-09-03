import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpSelect } from './select';

describe('GpSelect', () => {
  let component: GpSelect;
  let fixture: ComponentFixture<GpSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpSelect]
    }).compileComponents();

    fixture = TestBed.createComponent(GpSelect);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' },
      { label: 'Option 3', value: '3' }
    ]);
    fixture.componentRef.setInput('appendTo', 'self');
    fixture.detectChanges();
  });

  it('should create the select component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle overlay on click', () => {
    const root: HTMLElement = fixture.nativeElement.querySelector('.gp-select');
    root.click();
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('.gp-select-overlay');
    expect(overlay).toBeTruthy();
  });

  it('should select item on click and emit onChange', () => {
    let selectedVal: any = null;
    component.onChange.subscribe((e) => (selectedVal = e.value));

    const root: HTMLElement = fixture.nativeElement.querySelector('.gp-select');
    root.click();
    fixture.detectChanges();

    const items: HTMLElement[] = fixture.nativeElement.querySelectorAll('.gp-select-item');
    expect(items.length).toBe(3);
    items[1].click();
    fixture.detectChanges();

    expect(selectedVal).toBe('2');
  });
});
