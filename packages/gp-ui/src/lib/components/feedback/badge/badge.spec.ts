import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpBadge } from './badge';

describe('GpBadge', () => {
  let component: GpBadge;
  let fixture: ComponentFixture<GpBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpBadge]
    }).compileComponents();

    fixture = TestBed.createComponent(GpBadge);
    component = fixture.componentInstance;
  });

  it('should create the badge component', () => {
    expect(component).toBeTruthy();
  });
});
