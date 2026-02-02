import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasetDesigner } from './dataset-designer';

describe('DatasetDesigner', () => {
  let component: DatasetDesigner;
  let fixture: ComponentFixture<DatasetDesigner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatasetDesigner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatasetDesigner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
