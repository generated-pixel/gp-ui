import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpCascadeSelect } from './cascade-select';

describe('GpCascadeSelect', () => {
  let component: GpCascadeSelect;
  let fixture: ComponentFixture<GpCascadeSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpCascadeSelect]
    }).compileComponents();

    fixture = TestBed.createComponent(GpCascadeSelect);
    component = fixture.componentInstance;
  });

  it('should create the cascade select component', () => {
    expect(component).toBeTruthy();
  });
});
