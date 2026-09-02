import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpMessageComponent } from './message.component';

describe('GpMessageComponent', () => {
  let component: GpMessageComponent;
  let fixture: ComponentFixture<GpMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpMessageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpMessageComponent);
    component = fixture.componentInstance;
  });

  it('should create the message component', () => {
    expect(component).toBeTruthy();
  });
});
