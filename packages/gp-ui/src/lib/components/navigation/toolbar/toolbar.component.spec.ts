import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpToolbarComponent } from './toolbar.component';

describe('GpToolbarComponent', () => {
  let component: GpToolbarComponent;
  let fixture: ComponentFixture<GpToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpToolbarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpToolbarComponent);
    component = fixture.componentInstance;
  });

  it('should create the toolbar component', () => {
    expect(component).toBeTruthy();
  });
});
