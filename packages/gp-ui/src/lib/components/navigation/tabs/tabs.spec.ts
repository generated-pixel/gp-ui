import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpTabs } from './tabs';

describe('GpTabs', () => {
  let component: GpTabs;
  let fixture: ComponentFixture<GpTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpTabs]
    }).compileComponents();

    fixture = TestBed.createComponent(GpTabs);
    component = fixture.componentInstance;
  });

  it('should create the tabs component', () => {
    expect(component).toBeTruthy();
  });
});
