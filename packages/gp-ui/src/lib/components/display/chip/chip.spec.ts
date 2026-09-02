import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpChip } from './chip';

describe('GpChip', () => {
  let component: GpChip;
  let fixture: ComponentFixture<GpChip>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpChip]
    }).compileComponents();

    fixture = TestBed.createComponent(GpChip);
    component = fixture.componentInstance;
  });

  it('should create the chip component', () => {
    expect(component).toBeTruthy();
  });
});
