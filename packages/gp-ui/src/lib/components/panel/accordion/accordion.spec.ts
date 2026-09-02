import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpAccordion } from './accordion';

describe('GpAccordion', () => {
  let component: GpAccordion;
  let fixture: ComponentFixture<GpAccordion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpAccordion]
    }).compileComponents();

    fixture = TestBed.createComponent(GpAccordion);
    component = fixture.componentInstance;
  });

  it('should create the accordion component', () => {
    expect(component).toBeTruthy();
  });
});
