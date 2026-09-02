import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpDrawer } from './drawer';

describe('GpDrawer', () => {
  let component: GpDrawer;
  let fixture: ComponentFixture<GpDrawer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpDrawer]
    }).compileComponents();

    fixture = TestBed.createComponent(GpDrawer);
    component = fixture.componentInstance;
  });

  it('should create the drawer component', () => {
    expect(component).toBeTruthy();
  });
});
