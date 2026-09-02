import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpToolbar } from './toolbar';

describe('GpToolbar', () => {
  let component: GpToolbar;
  let fixture: ComponentFixture<GpToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpToolbar]
    }).compileComponents();

    fixture = TestBed.createComponent(GpToolbar);
    component = fixture.componentInstance;
  });

  it('should create the toolbar component', () => {
    expect(component).toBeTruthy();
  });
});
