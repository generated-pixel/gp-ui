import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpProgressSpinner } from './progress-spinner';

describe('GpProgressSpinner', () => {
  let fixture: ComponentFixture<GpProgressSpinner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpProgressSpinner]
    }).compileComponents();

    fixture = TestBed.createComponent(GpProgressSpinner);
    fixture.detectChanges();
  });

  it('should create and render progress spinner SVG', () => {
    const spinner = fixture.nativeElement.querySelector('.gp-progress-spinner');
    expect(spinner).toBeTruthy();
    expect(fixture.nativeElement.querySelector('svg')).toBeTruthy();
  });
});
