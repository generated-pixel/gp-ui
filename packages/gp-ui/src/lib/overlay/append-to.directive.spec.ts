import { Component, ElementRef, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GpAppendToDirective } from './append-to.directive';
import { GpAppendToTarget } from './append-to.interface';

@Component({
  standalone: true,
  imports: [GpAppendToDirective],
  template: `
    <div #trigger class="trigger-box" style="width: 200px; height: 40px; margin: 100px;">
      Trigger Element
    </div>
    <div
      #overlay
      class="test-overlay"
      [gpAppendTo]="target"
      [gpConnectedTo]="trigger"
      [gpOverlayMatchWidth]="true"
      style="height: 150px;"
    >
      Overlay Content
    </div>
    <div id="custom-container" class="custom-portal"></div>
  `
})
class TestHostComponent {
  public target: GpAppendToTarget = 'body';
  public triggerRef = viewChild<ElementRef>('trigger');
  public overlayRef = viewChild<ElementRef>('overlay');
}

describe('GpAppendToDirective', () => {
  let component: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, GpAppendToDirective]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // Cleanup any lingering test overlay in document.body
    const els = document.querySelectorAll('.test-overlay');
    els.forEach((el) => el.parentNode?.removeChild(el));
  });

  it('should append overlay to document.body when target is "body"', () => {
    const overlayInBody = document.body.querySelector('.test-overlay');
    expect(overlayInBody).toBeTruthy();
  });

  it('should clean up and remove overlay from document.body on destroy', () => {
    expect(document.body.querySelector('.test-overlay')).toBeTruthy();
    fixture.destroy();
    expect(document.body.querySelector('.test-overlay')).toBeFalsy();
  });
});
