import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpBadgeComponent } from './badge.component';

describe('GpBadgeComponent', () => {
  let component: GpBadgeComponent;
  let fixture: ComponentFixture<GpBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpBadgeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpBadgeComponent);
    component = fixture.componentInstance;
  });

  it('should create the badge component', () => {
    expect(component).toBeTruthy();
  });
});
