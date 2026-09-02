import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpListbox } from './listbox';

describe('GpListbox', () => {
  let component: GpListbox;
  let fixture: ComponentFixture<GpListbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpListbox]
    }).compileComponents();

    fixture = TestBed.createComponent(GpListbox);
    component = fixture.componentInstance;
  });

  it('should create the listbox component', () => {
    expect(component).toBeTruthy();
  });

  it('should render options and select item on click', () => {
    fixture.componentRef.setInput('options', [
      { label: 'Item 1', value: '1' },
      { label: 'Item 2', value: '2' }
    ]);
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.gp-listbox-item');
    expect(items.length).toBe(2);

    items[0].click();
    fixture.detectChanges();

    expect(component.value()).toBe('1');
  });
});
