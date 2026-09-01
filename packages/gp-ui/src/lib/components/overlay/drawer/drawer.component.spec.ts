import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpDrawerComponent } from './drawer.component';

describe('GpDrawerComponent', () => {
  let component: GpDrawerComponent;
  let fixture: ComponentFixture<GpDrawerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpDrawerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpDrawerComponent);
    component = fixture.componentInstance;
  });

  it('should create the drawer component', () => {
    expect(component).toBeTruthy();
  });
});
