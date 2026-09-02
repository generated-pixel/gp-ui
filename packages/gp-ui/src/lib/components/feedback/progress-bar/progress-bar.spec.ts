import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpProgressBar } from './progress-bar';

describe('GpProgressBar', () => {
  let component: GpProgressBar;
  let fixture: ComponentFixture<GpProgressBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpProgressBar]
    }).compileComponents();

    fixture = TestBed.createComponent(GpProgressBar);
    component = fixture.componentInstance;
  });

  it('should create the progress bar component', () => {
    expect(component).toBeTruthy();
  });
});
