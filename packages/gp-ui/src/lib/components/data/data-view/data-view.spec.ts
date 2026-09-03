import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpDataView } from './data-view';
import { GpPaginator } from '../paginator/paginator';

describe('GpDataView & GpPaginator', () => {
  describe('GpDataView', () => {
    let fixture: ComponentFixture<GpDataView>;
    let component: GpDataView;
    const testItems = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
      { id: 4, name: 'Item 4' },
      { id: 5, name: 'Item 5' },
      { id: 6, name: 'Item 6' },
      { id: 7, name: 'Item 7' },
      { id: 8, name: 'Item 8' }
    ];

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [GpDataView]
      }).compileComponents();

      fixture = TestBed.createComponent(GpDataView);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('value', testItems);
      fixture.detectChanges();
    });

    it('should return all items when paginator is false', () => {
      fixture.componentRef.setInput('paginator', false);
      fixture.detectChanges();
      expect(component.displayedValue().length).toBe(8);
    });

    it('should correctly slice items when paginator is true', () => {
      fixture.componentRef.setInput('paginator', true);
      component.rows.set(3);
      component.first.set(0);
      fixture.detectChanges();

      expect(component.displayedValue().length).toBe(3);
      expect(component.displayedValue()[0].name).toBe('Item 1');
      expect(component.displayedValue()[2].name).toBe('Item 3');
    });

    it('should update displayed items when pagination changes to next page without losing data', () => {
      fixture.componentRef.setInput('paginator', true);
      component.rows.set(3);
      fixture.detectChanges();

      // Navigate to page 2 (first = 3)
      component.onPaginationChange({
        first: 3,
        rows: 3,
        page: 1,
        pageCount: 3
      });

      expect(component.displayedValue().length).toBe(3);
      expect(component.displayedValue()[0].name).toBe('Item 4');
      expect(component.displayedValue()[2].name).toBe('Item 6');

      // Navigate to page 3 (first = 6)
      component.onPaginationChange({
        first: 6,
        rows: 3,
        page: 2,
        pageCount: 3
      });

      expect(component.displayedValue().length).toBe(2);
      expect(component.displayedValue()[0].name).toBe('Item 7');
      expect(component.displayedValue()[1].name).toBe('Item 8');
    });

    it('should switch layout between list and grid without altering pagination state', () => {
      fixture.componentRef.setInput('paginator', true);
      component.rows.set(4);
      component.setLayout('grid');
      fixture.detectChanges();

      expect(component.layout()).toBe('grid');
      expect(component.displayedValue().length).toBe(4);

      component.setLayout('list');
      fixture.detectChanges();
      expect(component.layout()).toBe('list');
      expect(component.displayedValue().length).toBe(4);
    });
  });

  describe('GpPaginator', () => {
    let fixture: ComponentFixture<GpPaginator>;
    let paginator: GpPaginator;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [GpPaginator]
      }).compileComponents();

      fixture = TestBed.createComponent(GpPaginator);
      paginator = fixture.componentInstance;
      fixture.componentRef.setInput('totalRecords', 20);
      fixture.componentRef.setInput('rows', 5);
      fixture.componentRef.setInput('first', 0);
      fixture.detectChanges();
    });

    it('should compute page count and current page reactively', () => {
      expect((paginator as any).pageCount()).toBe(4);
      expect((paginator as any).page()).toBe(0);
      expect((paginator as any).isFirstPage()).toBe(true);
      expect((paginator as any).isLastPage()).toBe(false);

      fixture.componentRef.setInput('first', 5);
      fixture.detectChanges();
      expect((paginator as any).page()).toBe(1);
      expect((paginator as any).isFirstPage()).toBe(false);

      fixture.componentRef.setInput('first', 15);
      fixture.detectChanges();
      expect((paginator as any).page()).toBe(3);
      expect((paginator as any).isLastPage()).toBe(true);
    });

    it('should emit onPageChange with correct next state on changePage', () => {
      let state: any = null;
      paginator.onPageChange.subscribe((s) => (state = s));

      paginator.changePage(2);

      expect(state).toEqual({
        first: 10,
        rows: 5,
        page: 2,
        pageCount: 4
      });
    });
  });
});
