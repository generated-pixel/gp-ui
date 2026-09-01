import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpAutoCompleteComponent } from './autocomplete.component';
import { Subject } from 'rxjs';

describe('GpAutoCompleteComponent', () => {
  let component: GpAutoCompleteComponent;
  let fixture: ComponentFixture<GpAutoCompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpAutoCompleteComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpAutoCompleteComponent);
    component = fixture.componentInstance;
  });

  it('should create the autocomplete component', () => {
    expect(component).toBeTruthy();
  });

  it('should filter suggestions and select item in single mode', () => {
    const items = [
      { id: 1, name: 'Apple' },
      { id: 2, name: 'Banana' },
      { id: 3, name: 'Cherry' }
    ];
    fixture.componentRef.setInput('field', 'name');
    fixture.componentRef.setInput('suggestions', items);
    fixture.detectChanges();

    let selected: any = null;
    component.onSelect.subscribe((res) => (selected = res.value));

    component.selectItem(items[1]);
    fixture.detectChanges();

    expect(component.value).toEqual(items[1]);
    expect(selected).toEqual(items[1]);
    expect(component.query()).toBe('Banana');
  });

  it('should support multiple mode with tokens and removal', () => {
    const items = [
      { id: 1, name: 'TypeScript' },
      { id: 2, name: 'Angular' },
      { id: 3, name: 'Signals' }
    ];
    fixture.componentRef.setInput('multiple', true);
    fixture.componentRef.setInput('field', 'name');
    fixture.detectChanges();

    component.appendSelection(items[0]);
    component.appendSelection(items[1]);
    fixture.detectChanges();

    expect(component.selectedItems().length).toBe(2);
    expect(component.value).toEqual([items[0], items[1]]);

    component.removeMultipleItem(items[0]);
    fixture.detectChanges();

    expect(component.selectedItems().length).toBe(1);
    expect(component.selectedItems()[0]).toEqual(items[1]);
  });

  it('should automatically receive and add values from externalSelection Observable', () => {
    const externalStream$ = new Subject<any>();
    fixture.componentRef.setInput('multiple', true);
    fixture.componentRef.setInput('field', 'name');
    fixture.componentRef.setInput('externalSelection', externalStream$.asObservable());
    fixture.detectChanges();

    externalStream$.next({ id: 101, name: 'Selected From Search Dialog' });
    fixture.detectChanges();

    expect(component.selectedItems().length).toBe(1);
    expect(component.selectedItems()[0].name).toBe('Selected From Search Dialog');

    // Emit array of items from dialog
    externalStream$.next([
      { id: 102, name: 'Dialog Result 2' },
      { id: 103, name: 'Dialog Result 3' }
    ]);
    fixture.detectChanges();

    expect(component.selectedItems().length).toBe(3);
  });

  it('should emit onAdvancedSearch when advanced search row is triggered', () => {
    let advancedSearchQuery = '';
    component.onAdvancedSearch.subscribe((res) => (advancedSearchQuery = res.query));

    component.query.set('complex query');
    component.triggerAdvancedSearch();

    expect(advancedSearchQuery).toBe('complex query');
  });

  it('should automatically invoke searchDialogHandler and append selection when triggered', () => {
    const dialogStream$ = new Subject<any>();
    fixture.componentRef.setInput('multiple', true);
    fixture.componentRef.setInput('field', 'name');
    fixture.componentRef.setInput('searchDialogHandler', () => dialogStream$.asObservable());
    fixture.detectChanges();

    component.triggerAdvancedSearch();
    dialogStream$.next({ id: 999, name: 'Dialog Service Customer' });
    fixture.detectChanges();

    expect(component.selectedItems().length).toBe(1);
    expect(component.selectedItems()[0].name).toBe('Dialog Service Customer');
  });

  it('should clear selection when clear is clicked', () => {
    fixture.componentRef.setInput('showClear', true);
    fixture.componentRef.setInput('multiple', true);
    component.selectedItems.set([{ id: 1, name: 'Test' }]);
    fixture.detectChanges();

    component.clear();
    fixture.detectChanges();

    expect(component.selectedItems().length).toBe(0);
    expect(component.value).toEqual([]);
  });
});
