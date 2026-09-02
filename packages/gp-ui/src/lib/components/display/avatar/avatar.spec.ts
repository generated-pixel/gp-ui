import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpAvatar } from './avatar';

describe('GpAvatar', () => {
  let component: GpAvatar;
  let fixture: ComponentFixture<GpAvatar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpAvatar]
    }).compileComponents();

    fixture = TestBed.createComponent(GpAvatar);
    component = fixture.componentInstance;
  });

  it('should create the avatar component', () => {
    expect(component).toBeTruthy();
  });
});
