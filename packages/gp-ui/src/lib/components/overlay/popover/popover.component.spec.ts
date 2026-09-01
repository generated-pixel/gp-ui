import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpPopoverComponent } from './popover.component';

describe('GpPopoverComponent', () => {
  let component: GpPopoverComponent;
  let fixture: ComponentFixture<GpPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpPopoverComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpPopoverComponent);
    component = fixture.componentInstance;
  });

  it('should create the popover component', () => {
    expect(component).toBeTruthy();
  });
});
