import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpTag } from './tag';

describe('GpTag', () => {
  let component: GpTag;
  let fixture: ComponentFixture<GpTag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpTag]
    }).compileComponents();

    fixture = TestBed.createComponent(GpTag);
    component = fixture.componentInstance;
  });

  it('should create the tag component', () => {
    expect(component).toBeTruthy();
  });
});
