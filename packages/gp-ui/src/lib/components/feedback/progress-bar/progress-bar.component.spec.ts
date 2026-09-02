import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpProgressBarComponent } from './progress-bar.component';

describe('GpProgressBarComponent', () => {
  let component: GpProgressBarComponent;
  let fixture: ComponentFixture<GpProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpProgressBarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpProgressBarComponent);
    component = fixture.componentInstance;
  });

  it('should create the progress bar component', () => {
    expect(component).toBeTruthy();
  });
});
