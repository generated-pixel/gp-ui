import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpListboxComponent } from './listbox.component';

describe('GpListboxComponent', () => {
  let component: GpListboxComponent;
  let fixture: ComponentFixture<GpListboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpListboxComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpListboxComponent);
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
