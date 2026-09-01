import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpEmptyStateComponent } from './empty-state.component';

describe('GpEmptyStateComponent', () => {
  let component: GpEmptyStateComponent;
  let fixture: ComponentFixture<GpEmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpEmptyStateComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpEmptyStateComponent);
    component = fixture.componentInstance;
  });

  it('should create the empty-state component', () => {
    expect(component).toBeTruthy();
  });
});
