import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpTreeSelectComponent } from './tree-select.component';

describe('GpTreeSelectComponent', () => {
  let component: GpTreeSelectComponent;
  let fixture: ComponentFixture<GpTreeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpTreeSelectComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpTreeSelectComponent);
    component = fixture.componentInstance;
  });

  it('should create the tree select component', () => {
    expect(component).toBeTruthy();
  });
});
