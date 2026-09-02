import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpMultiSelect } from './multi-select';

describe('GpMultiSelect', () => {
  let component: GpMultiSelect;
  let fixture: ComponentFixture<GpMultiSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpMultiSelect]
    }).compileComponents();

    fixture = TestBed.createComponent(GpMultiSelect);
    component = fixture.componentInstance;
  });

  it('should create the multi-select component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle overlay open state when clicked', () => {
    fixture.componentRef.setInput('options', [
      { label: 'Option 1', value: '1' },
      { label: 'Option 2', value: '2' }
    ]);
    fixture.detectChanges();

    const trigger: HTMLElement = fixture.nativeElement.querySelector('.gp-multiselect');
    trigger.click();
    fixture.detectChanges();

    expect(component.overlayVisible()).toBeTrue();
  });
});
