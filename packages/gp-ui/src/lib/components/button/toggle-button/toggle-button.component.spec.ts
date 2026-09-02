import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpToggleButtonComponent } from './toggle-button.component';

describe('GpToggleButtonComponent', () => {
  let component: GpToggleButtonComponent;
  let fixture: ComponentFixture<GpToggleButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpToggleButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpToggleButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create the toggle button component', () => {
    expect(component).toBeTruthy();
  });
});
