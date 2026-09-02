import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpCardComponent } from './card.component';

describe('GpCardComponent', () => {
  let component: GpCardComponent;
  let fixture: ComponentFixture<GpCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpCardComponent);
    component = fixture.componentInstance;
  });

  it('should create the card component', () => {
    expect(component).toBeTruthy();
  });
});
