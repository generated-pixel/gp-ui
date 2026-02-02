import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardDesigner } from './dashboard-designer';

describe('DashboardDesigner', () => {
  let component: DashboardDesigner;
  let fixture: ComponentFixture<DashboardDesigner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardDesigner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardDesigner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
