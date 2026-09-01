import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpAvatarComponent } from './avatar.component';

describe('GpAvatarComponent', () => {
  let component: GpAvatarComponent;
  let fixture: ComponentFixture<GpAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpAvatarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpAvatarComponent);
    component = fixture.componentInstance;
  });

  it('should create the avatar component', () => {
    expect(component).toBeTruthy();
  });
});
