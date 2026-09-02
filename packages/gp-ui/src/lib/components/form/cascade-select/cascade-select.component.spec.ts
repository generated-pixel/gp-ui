import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpCascadeSelectComponent } from './cascade-select.component';

describe('GpCascadeSelectComponent', () => {
  let component: GpCascadeSelectComponent;
  let fixture: ComponentFixture<GpCascadeSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpCascadeSelectComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpCascadeSelectComponent);
    component = fixture.componentInstance;
  });

  it('should create the cascade select component', () => {
    expect(component).toBeTruthy();
  });
});
