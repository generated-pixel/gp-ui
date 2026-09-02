import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpEmptyState } from './empty-state';

describe('GpEmptyState', () => {
  let component: GpEmptyState;
  let fixture: ComponentFixture<GpEmptyState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpEmptyState]
    }).compileComponents();

    fixture = TestBed.createComponent(GpEmptyState);
    component = fixture.componentInstance;
  });

  it('should create the empty-state component', () => {
    expect(component).toBeTruthy();
  });
});
