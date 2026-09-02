import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpSplitButtonComponent } from './split-button.component';

describe('GpSplitButtonComponent', () => {
  let component: GpSplitButtonComponent;
  let fixture: ComponentFixture<GpSplitButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpSplitButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpSplitButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create the split button component', () => {
    expect(component).toBeTruthy();
  });
});
