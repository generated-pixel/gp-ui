import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpMessage } from './message';

describe('GpMessage', () => {
  let component: GpMessage;
  let fixture: ComponentFixture<GpMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpMessage]
    }).compileComponents();

    fixture = TestBed.createComponent(GpMessage);
    component = fixture.componentInstance;
  });

  it('should create the message component', () => {
    expect(component).toBeTruthy();
  });
});
