import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpTable } from './table';
import { GpColumn } from '../column/column';

describe('GpTable', () => {
  let component: GpTable;
  let fixture: ComponentFixture<GpTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpTable, GpColumn]
    }).compileComponents();

    fixture = TestBed.createComponent(GpTable);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('value', [
      { id: 1, name: 'Alice', role: 'Admin' },
      { id: 2, name: 'Bob', role: 'User' },
      { id: 3, name: 'Charlie', role: 'Developer' }
    ]);
    fixture.detectChanges();
  });

  it('should create the table component', () => {
    expect(component).toBeTruthy();
  });

  it('should resolve nested field data properly', () => {
    const data = { user: { profile: { name: 'Dave' } } };
    const val = component.resolveFieldData(data, 'user.profile.name');
    expect(val).toBe('Dave');
  });

  it('should sort data when sort is called', () => {
    component.sort('name');
    const sorted = component['sortedRows']();
    expect(sorted[0].name).toBe('Alice');
    expect(sorted[2].name).toBe('Charlie');

    // Toggle descending
    component.sort('name');
    const desc = component['sortedRows']();
    expect(desc[0].name).toBe('Charlie');
    expect(desc[2].name).toBe('Alice');
  });
});
