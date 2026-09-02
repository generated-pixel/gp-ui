import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpTabsComponent } from './tabs.component';

describe('GpTabsComponent', () => {
  let component: GpTabsComponent;
  let fixture: ComponentFixture<GpTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpTabsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GpTabsComponent);
    component = fixture.componentInstance;
  });

  it('should create the tabs component', () => {
    expect(component).toBeTruthy();
  });
});
