import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpBlockBase } from './gp-block-base';
import { GpFormAction } from '../schema/schema.types';

@Component({
  standalone: true,
  template: '<div>Block Base Component</div>'
})
class TestBlockHost extends GpBlockBase<{ title: string }> {}

describe('GpBlockBase', () => {
  let fixture: ComponentFixture<TestBlockHost>;
  let component: TestBlockHost;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestBlockHost]
    }).compileComponents();

    fixture = TestBed.createComponent(TestBlockHost);
    component = fixture.componentInstance;
  });

  it('should initialize with schema undefined and loading false', () => {
    expect(component.schema()).toBeUndefined();
    expect(component.loading()).toBe(false);
  });

  it('should emit actionClick on onActionClick', () => {
    let clickedAction: GpFormAction | null = null;
    component.actionClick.subscribe((act) => (clickedAction = act));

    const sampleAction: GpFormAction = {
      label: 'Submit Order',
      actionType: 'submit',
      severity: 'primary'
    };

    component.onActionClick(sampleAction);
    expect(clickedAction).toEqual(sampleAction);
  });
});
