import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpTreeSelect } from './tree-select';

describe('GpTreeSelect', () => {
  let component: GpTreeSelect;
  let fixture: ComponentFixture<GpTreeSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpTreeSelect]
    }).compileComponents();

    fixture = TestBed.createComponent(GpTreeSelect);
    component = fixture.componentInstance;
  });

  it('should create the tree select component', () => {
    expect(component).toBeTruthy();
  });
});
