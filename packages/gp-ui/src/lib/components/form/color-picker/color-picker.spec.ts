import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpColorPicker } from './color-picker';

describe('GpColorPicker', () => {
  let component: GpColorPicker;
  let fixture: ComponentFixture<GpColorPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpColorPicker]
    }).compileComponents();

    fixture = TestBed.createComponent(GpColorPicker);
    component = fixture.componentInstance;
  });

  it('should create the color picker component', () => {
    expect(component).toBeTruthy();
  });
});
