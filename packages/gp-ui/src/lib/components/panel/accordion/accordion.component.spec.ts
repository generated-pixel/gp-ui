import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpAccordionComponent } from './accordion.component';

describe('GpAccordionComponent', () => {
  let component: GpAccordionComponent;
  let fixture: ComponentFixture<GpAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpAccordionComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpAccordionComponent);
    component = fixture.componentInstance;
  });

  it('should create the accordion component', () => {
    expect(component).toBeTruthy();
  });
});
