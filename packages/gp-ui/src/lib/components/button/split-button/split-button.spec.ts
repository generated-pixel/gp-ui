import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpSplitButton } from './split-button';

describe('GpSplitButton', () => {
  let component: GpSplitButton;
  let fixture: ComponentFixture<GpSplitButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpSplitButton]
    }).compileComponents();

    fixture = TestBed.createComponent(GpSplitButton);
    component = fixture.componentInstance;
  });

  it('should create the split button component', () => {
    expect(component).toBeTruthy();
  });
});
