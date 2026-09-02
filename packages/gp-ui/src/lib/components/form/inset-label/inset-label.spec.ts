import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpInsetLabel } from './inset-label';

describe('GpInsetLabel', () => {
  let component: GpInsetLabel;
  let fixture: ComponentFixture<GpInsetLabel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpInsetLabel]
    }).compileComponents();

    fixture = TestBed.createComponent(GpInsetLabel);
    component = fixture.componentInstance;
  });

  it('should create the inset label component', () => {
    expect(component).toBeTruthy();
  });
});
