import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpPopover } from './popover';

describe('GpPopover', () => {
  let component: GpPopover;
  let fixture: ComponentFixture<GpPopover>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpPopover]
    }).compileComponents();

    fixture = TestBed.createComponent(GpPopover);
    component = fixture.componentInstance;
  });

  it('should create the popover component', () => {
    expect(component).toBeTruthy();
  });
});
