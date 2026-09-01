import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpTagComponent } from './tag.component';

describe('GpTagComponent', () => {
  let component: GpTagComponent;
  let fixture: ComponentFixture<GpTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpTagComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpTagComponent);
    component = fixture.componentInstance;
  });

  it('should create the tag component', () => {
    expect(component).toBeTruthy();
  });
});
