import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetDesigner } from './widget-designer';

describe('WidgetDesigner', () => {
  let component: WidgetDesigner;
  let fixture: ComponentFixture<WidgetDesigner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetDesigner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetDesigner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
