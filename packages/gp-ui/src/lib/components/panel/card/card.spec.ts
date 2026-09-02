import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpCard } from './card';

describe('GpCard', () => {
  let component: GpCard;
  let fixture: ComponentFixture<GpCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpCard]
    }).compileComponents();

    fixture = TestBed.createComponent(GpCard);
    component = fixture.componentInstance;
  });

  it('should create the card component', () => {
    expect(component).toBeTruthy();
  });
});
