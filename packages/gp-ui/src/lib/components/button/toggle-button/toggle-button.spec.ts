import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpToggleButton } from './toggle-button';

describe('GpToggleButton', () => {
  let component: GpToggleButton;
  let fixture: ComponentFixture<GpToggleButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpToggleButton]
    }).compileComponents();

    fixture = TestBed.createComponent(GpToggleButton);
    component = fixture.componentInstance;
  });

  it('should create the toggle button component', () => {
    expect(component).toBeTruthy();
  });
});
