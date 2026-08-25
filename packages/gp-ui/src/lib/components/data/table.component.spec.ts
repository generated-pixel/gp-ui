import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpTableComponent } from './table.component';
import { GpColumnComponent } from './column.component';

describe('GpTableComponent', () => {
  let component: GpTableComponent;
  let fixture: ComponentFixture<GpTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpTableComponent, GpColumnComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpTableComponent);
    component = fixture.componentInstance;
    component.value = [
      { id: 1, name: 'Alice', role: 'Admin' },
      { id: 2, name: 'Bob', role: 'User' },
      { id: 3, name: 'Charlie', role: 'Developer' }
    ];
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
