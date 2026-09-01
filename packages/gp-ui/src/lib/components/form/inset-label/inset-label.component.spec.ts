import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpInsetLabelComponent } from './inset-label.component';

describe('GpInsetLabelComponent', () => {
  let component: GpInsetLabelComponent;
  let fixture: ComponentFixture<GpInsetLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpInsetLabelComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpInsetLabelComponent);
    component = fixture.componentInstance;
  });

  it('should create the inset label component', () => {
    expect(component).toBeTruthy();
  });
});
